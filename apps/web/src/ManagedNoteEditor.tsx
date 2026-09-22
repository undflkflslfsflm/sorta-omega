import { useEffect, useRef, useState } from "react";
import type { EditorDocument } from "@sorta/contracts";
import * as Y from "yjs";
import RichDocumentEditor from "./RichDocumentEditor";
import { RichNoteSession } from "./rich-note-session";
import { isNoteAccessDenied, loadNoteSnapshot } from "./cached-shared-note";
import { localNoteDraft, offlineCaptureEnabled, replicaDeviceId, setCachedNoteAccessBlocked, syncConflicts } from "./offline-queue";

// Retain failed forced-unmount saves in memory so reopening the note can recover
// them. Normal navigation cannot discard an unpersisted shared edit.
const recoverySessions=new Map<string,RichNoteSession>();
type Mode={kind:"loading"}|{kind:"legacy"}|{kind:"shared";session:RichNoteSession}|{kind:"error"};

export async function openManagedNoteSession(noteId:string,revision:number):Promise<RichNoteSession|undefined>{
  if(!offlineCaptureEnabled()||!await replicaDeviceId()){
    if(recoverySessions.has(noteId)||await localNoteDraft(noteId))throw new Error("Restore trusted device access to recover the shared draft");
    return;
  }
  const snapshot=await loadNoteSnapshot(noteId);
  if(typeof snapshot.content!=="string")throw new Error("Invalid shared snapshot");
  const probe=new Y.Doc();
  let migrated=false;
  try{Y.applyUpdate(probe,Uint8Array.from(atob(snapshot.content),c=>c.charCodeAt(0)));migrated=probe.share.has("prosemirror");}
  finally{probe.destroy();}
  if(!migrated){if(snapshot.offline)throw new Error("Legacy note is not available for shared offline editing");return;}
  const retained=recoverySessions.get(noteId);
  if(retained){retained.applyRemote(snapshot.content);recoverySessions.delete(noteId);return retained;}
  return RichNoteSession.open({noteId,revisionId:snapshot.revisionId,updateBase64:snapshot.content},revision);
}

export default function ManagedNoteEditor({noteId,revision,initialDocument,disabled,onSave,onSharedSaved}:{
  noteId:string;revision:number;initialDocument:EditorDocument;disabled:boolean;
  onSave:(document:EditorDocument)=>Promise<void>;onSharedSaved:()=>Promise<void>;
}){
  const [mode,setMode]=useState<Mode>({kind:"loading"});
  const [notice,setNotice]=useState<string|null>(null);
  const [accessBlocked,setAccessBlocked]=useState(false);
  const [attempt,setAttempt]=useState(0);
  const refreshRunning=useRef(false);
  const refreshAgain=useRef(false);
  const alive=useRef(true);
  const modeRef=useRef(mode);modeRef.current=mode;
  const refreshCallback=useRef(onSharedSaved);refreshCallback.current=onSharedSaved;

  useEffect(()=>{
    let cancelled=false;
    alive.current=true;
    let owned:RichNoteSession|undefined;
    setMode({kind:"loading"});setNotice(null);
    async function open(){
      owned=await openManagedNoteSession(noteId,revision);
      if(cancelled){if(owned)release(owned);owned=undefined;return;}
      setMode(owned?{kind:"shared",session:owned}:{kind:"legacy"});
    }
    function release(session:RichNoteSession){
      void session.persist().then(()=>session.close()).catch(()=>{
        recoverySessions.set(noteId,session);
        window.alert("A shared note could not be saved locally. Reopen it in this tab to recover your edits before closing the browser.");
      });
    }
    void open().catch(()=>{if(!cancelled){setMode({kind:"error"});setNotice("Could not open the shared note safely. Retry without replacing its local draft.");}});
    return()=>{cancelled=true;alive.current=false;if(owned)release(owned);};
    // Select mode before editing. Server revision changes refresh the existing
    // session below; they must not remount and replace its local history.
  },[noteId,attempt]);

  async function refreshShared(push:boolean){
    const current=modeRef.current;
    if(current.kind!=="shared")return;
    if(refreshRunning.current){if(push)refreshAgain.current=true;return;}
    refreshRunning.current=true;
    try{
      if(!offlineCaptureEnabled()||!await replicaDeviceId())throw new Error("Offline device unavailable");
      if(push)await refreshCallback.current();
      const snapshot=await loadNoteSnapshot(noteId);
      if(!alive.current||modeRef.current!==current)return;
      if(typeof snapshot.content!=="string")throw new Error("Invalid shared snapshot");
      current.session.applyRemote(snapshot.content);
      if(!snapshot.offline)setAccessBlocked(false);
      const conflicts=await syncConflicts();
      if(alive.current)setNotice(conflicts.some(item=>item.operation?.type==="note_yjs_update"&&item.operation.noteId===noteId)
        ?"Some note edits need review in Settings → offline conflicts. Your local draft is retained."
        :null);
    }catch(error){if(alive.current){
      if(isNoteAccessDenied(error)){
        setAccessBlocked(true);
        setNotice("Access to this note is no longer available. Editing and cached reopening are blocked; local unsent edits are retained.");
        try{await setCachedNoteAccessBlocked(noteId,true);}catch{setNotice("Access is blocked in this tab, but the device could not store that restriction. Do not rely on offline reopening until storage is repaired.");}
      }
      else setNotice("Server sync is unavailable. Locally saved edits remain queued; retry when connected.");
    }}
    finally{
      refreshRunning.current=false;
      if(refreshAgain.current&&alive.current){refreshAgain.current=false;void refreshShared(true);}
    }
  }
  useEffect(()=>{void refreshShared(false);},[revision,initialDocument]);
  useEffect(()=>{
    if(mode.kind!=="shared")return;
    const reconnect=()=>void refreshShared(true);
    window.addEventListener("online",reconnect);
    return()=>window.removeEventListener("online",reconnect);
  },[mode]);

  if(mode.kind==="loading")return <div className="editor-loading">Opening canonical note…</div>;
  if(mode.kind==="error")return <div className="form-error">{notice}<button onClick={()=>setAttempt(value=>value+1)}>Retry opening note</button></div>;
  return <>{notice&&<p className="form-error">{notice}</p>}{mode.kind==="shared"&&<button className="text-button" onClick={()=>void refreshShared(true)}>Sync shared note</button>}
    <RichDocumentEditor initialDocument={initialDocument} disabled={disabled||accessBlocked} onSave={onSave}
      session={mode.kind==="shared"?mode.session:undefined} onLocalSaved={()=>void refreshShared(true)}/></>;
}
