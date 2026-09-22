import * as Y from "yjs";
import { api,ApiError } from "./api";
import { cachedNoteSnapshot,localNoteDraft,offlineCaptureEnabled,replicaDeviceId,setCachedNoteAccessBlocked } from "./offline-queue";
import { sharedEditorContent } from "./rich-editor-extensions";

export function canUseOfflineNote(error:unknown){
  return error instanceof TypeError||(error instanceof ApiError&&error.status>=500);
}
export function isNoteAccessDenied(error:unknown){
  return error instanceof ApiError&&[401,403,404,410].includes(error.status);
}

async function trustedSnapshot(noteId:string){
  if(!offlineCaptureEnabled()||!await replicaDeviceId())return null;
  return cachedNoteSnapshot(noteId);
}

export async function loadNoteSnapshot(noteId:string){
  try{
    const snapshot=await api.noteDocument(noteId,"yjs_update");
    await setCachedNoteAccessBlocked(noteId,false);
    return {...snapshot,offline:false};
  }
  catch(error){
    if(isNoteAccessDenied(error)){
      // The in-memory deny is immediate; persistence prevents a later offline
      // reopen from reviving this snapshot. Unsent drafts are not destroyed.
      try{await setCachedNoteAccessBlocked(noteId,true);}finally{throw error;}
    }
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
