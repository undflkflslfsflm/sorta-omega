import * as Y from "yjs";
import { api,ApiError } from "./api";
import { cachedNoteSnapshot,localNoteDraft,offlineCaptureEnabled,replicaDeviceId } from "./offline-queue";
import { sharedEditorContent } from "./rich-editor-extensions";

export function canUseOfflineNote(error:unknown){
  return error instanceof TypeError||(error instanceof ApiError&&error.status>=500);
}

async function trustedSnapshot(noteId:string){
  if(!offlineCaptureEnabled()||!await replicaDeviceId())return null;
  return cachedNoteSnapshot(noteId);
}

export async function loadNoteSnapshot(noteId:string){
  try{return {...await api.noteDocument(noteId,"yjs_update"),offline:false};}
  catch(error){
    if(!canUseOfflineNote(error))throw error;
    const cached=await trustedSnapshot(noteId);
    if(!cached)throw error;
    return {format:"yjs_update" as const,content:cached.updateBase64,revisionId:cached.revisionId,sourceMap:[],offline:true};
  }
}

export async function loadCachedNoteDocument(noteId:string){
  const snapshot=await trustedSnapshot(noteId);
  if(!snapshot)return null;
  const doc=new Y.Doc();
  try{
    Y.applyUpdate(doc,Uint8Array.from(atob(snapshot.updateBase64),c=>c.charCodeAt(0)));
    if(!doc.share.has("prosemirror"))return null;
    const draft=await localNoteDraft(noteId);
    if(draft)Y.applyUpdate(doc,Uint8Array.from(atob(draft.updateBase64),c=>c.charCodeAt(0)));
    return sharedEditorContent(doc);
  }finally{doc.destroy();}
}
