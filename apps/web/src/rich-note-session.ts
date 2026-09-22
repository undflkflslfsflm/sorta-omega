import * as Y from "yjs";
import type { SyncOperation } from "@sorta/contracts";
import { localNoteDraft, persistLocalNoteEdit, type CachedNoteSnapshot } from "./offline-queue";

const remoteOrigin = Symbol("remote-note-update");
export function encodeNoteUpdate(update:Uint8Array):string {
  let binary="";
  for(let start=0;start<update.length;start+=8192)binary+=String.fromCharCode(...update.subarray(start,start+8192));
  return btoa(binary);
}
function decode(update:string){return Uint8Array.from(atob(update),character=>character.charCodeAt(0));}
type NoteUpdate=Extract<SyncOperation,{type:"note_yjs_update"}>;
type PendingWrite={snapshot:Omit<CachedNoteSnapshot,"cachedAt">;operation:NoteUpdate;count:number};

export class RichNoteSession {
  private updates:Uint8Array[]=[];
  private pending:PendingWrite|null=null;
  private saving:Promise<void>|null=null;
  private closed=false;
  private readonly observe=(update:Uint8Array,origin:unknown)=>{
    if(origin!==remoteOrigin)this.updates.push(update.slice());
  };
  private constructor(
    readonly document:Y.Doc,
    private readonly snapshot:Omit<CachedNoteSnapshot,"cachedAt">,
    private readonly baseRevision:number,
    private lastOperationId:string|null
  ){document.on("update",this.observe);}

  static async open(snapshot:Omit<CachedNoteSnapshot,"cachedAt">,baseRevision:number){
    if(!Number.isSafeInteger(baseRevision)||baseRevision<1)throw new Error("Invalid note revision");
    const document=new Y.Doc();
    try{
      Y.applyUpdate(document,decode(snapshot.updateBase64),remoteOrigin);
      // Only the server initializes shared rich history.
      if(!document.share.has("prosemirror"))throw new Error("Note requires server rich-text migration");
      const draft=await localNoteDraft(snapshot.noteId);
      if(draft)Y.applyUpdate(document,decode(draft.updateBase64),remoteOrigin);
      return new RichNoteSession(document,snapshot,baseRevision,draft?.lastOperationId??null);
    }catch(error){document.destroy();throw error;}
  }

  get hasUnsavedChanges(){return this.updates.length>0;}

  applyRemote(updateBase64:string){
    if(this.closed)throw new Error("Note session is closed");
    Y.applyUpdate(this.document,decode(updateBase64),remoteOrigin);
  }

  persist():Promise<void>{
    if(this.closed)return Promise.reject(new Error("Note session is closed"));
    if(this.saving)return this.saving;
    this.saving=this.drain().finally(()=>{this.saving=null;});
    return this.saving;
  }

  private async drain(){
    while(this.updates.length){
      // Keep the exact snapshot/update/ID after a failed transaction. Later edits
      // are persisted separately once this write succeeds.
      this.pending??={
        snapshot:{...this.snapshot,updateBase64:encodeNoteUpdate(Y.encodeStateAsUpdate(this.document))},
        operation:{type:"note_yjs_update",operationId:crypto.randomUUID(),noteId:this.snapshot.noteId,
          baseRevision:this.baseRevision,updateBase64:encodeNoteUpdate(Y.mergeUpdates(this.updates))},
        count:this.updates.length
      };
      await persistLocalNoteEdit(this.pending.snapshot,this.pending.operation,this.lastOperationId);
      this.lastOperationId=this.pending.operation.operationId;
      this.updates.splice(0,this.pending.count);
      this.pending=null;
    }
  }

  close(){
    if(this.saving||this.hasUnsavedChanges)throw new Error("Persist unsaved note changes before closing");
    this.closed=true;
    this.document.off("update",this.observe);
    this.document.destroy();
  }
}
