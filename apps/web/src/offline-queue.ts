import type { CalendarEvent, Note, SyncAck, SyncConflict, SyncOperation, Task } from "@sorta/contracts";
import { syncOperationSchema } from "@sorta/contracts";

export type PendingCapture = { id: string; text: string; createdAt: string; attempts: number; lastError: string | null };
export type CachedCoreRecords = { id: "core"; notes: Note[]; tasks: Task[]; events: CalendarEvent[]; cachedAt: string };
export type CachedNoteSnapshot = { noteId:string; revisionId:string; updateBase64:string; cachedAt:string };
export type LocalNoteDraft = CachedNoteSnapshot & { lastOperationId: string; lastOperation: Extract<SyncOperation,{type:"note_yjs_update"}> };
type AcknowledgedNoteOperation = { id:string; operation:Extract<SyncOperation,{type:"note_yjs_update"}>; acknowledgedAt:string };
type PendingSyncOperation = { id: string; operation: SyncOperation; createdAt: string };
export type StoredSyncConflict = SyncConflict & { id: string; recordedAt: string; operation?: SyncOperation };

const DATABASE = "sorta-private-offline-v1";
const CAPTURE_STORE = "pending-captures";
const META_STORE = "sync-meta";
const CORE_STORE = "core-cache";
const SYNC_STORE = "pending-sync";
const CONFLICT_STORE = "sync-conflicts";
const TRUST_KEY = "sorta.trustedOfflineCapture";
const POLICY_EXPIRY_KEY="sorta.offlinePolicyExpiresAt";
const POLICY_LIMITS_KEY="sorta.offlinePolicyLimits";
const PRIVATE_STORES=[CAPTURE_STORE,META_STORE,CORE_STORE,SYNC_STORE,CONFLICT_STORE] as const;
type PrivateStore=(typeof PRIVATE_STORES)[number];
type StoredRow={id:string;[key:string]:unknown};
type PrivateMutation={store:PrivateStore;value:StoredRow|null;id:string};
const blockedNoteAccess=new Set<string>();
let blockedCoreAccess=false;

export function offlineCaptureEnabled(){const expiry=localStorage.getItem(POLICY_EXPIRY_KEY);return localStorage.getItem(TRUST_KEY)==="true"&&offlinePolicyLimits()!==null&&(!expiry||Date.parse(expiry)>Date.now());}
export function offlinePolicyExpired(){const expiry=localStorage.getItem(POLICY_EXPIRY_KEY);return localStorage.getItem(TRUST_KEY)==="true"&&Boolean(expiry)&&Date.parse(expiry!)<=Date.now();}
export function setOfflineCaptureEnabled(enabled:boolean){ localStorage.setItem(TRUST_KEY,String(enabled)); }
export function setOfflinePolicyExpiry(expiresAt:string|null){if(expiresAt)localStorage.setItem(POLICY_EXPIRY_KEY,expiresAt);else localStorage.removeItem(POLICY_EXPIRY_KEY);}
export function offlinePolicyExpiry(){return localStorage.getItem(POLICY_EXPIRY_KEY);}
export type OfflinePolicyLimits={maxBytes:number;maxItems:number};
export function setOfflinePolicyLimits(limits:OfflinePolicyLimits|null){if(limits)localStorage.setItem(POLICY_LIMITS_KEY,JSON.stringify(limits));else localStorage.removeItem(POLICY_LIMITS_KEY);}
export function offlinePolicyLimits():OfflinePolicyLimits|null{
  try{
    const parsed=JSON.parse(localStorage.getItem(POLICY_LIMITS_KEY)??"null") as Partial<OfflinePolicyLimits>|null;
    return parsed&&Number.isSafeInteger(parsed.maxBytes)&&parsed.maxBytes!>0&&Number.isSafeInteger(parsed.maxItems)&&parsed.maxItems!>0
      ?{maxBytes:parsed.maxBytes!,maxItems:parsed.maxItems!}:null;
  }catch{return null;}
}

export class OfflineCacheLimitError extends Error{
  constructor(readonly byteCount:number,readonly itemCount:number,readonly limits:OfflinePolicyLimits){super("Offline cache policy limit exceeded");this.name="OfflineCacheLimitError";}
}

function database():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{const request=indexedDB.open(DATABASE,2);request.onupgradeneeded=()=>{for(const name of [CAPTURE_STORE,META_STORE,CORE_STORE,SYNC_STORE,CONFLICT_STORE])if(!request.result.objectStoreNames.contains(name))request.result.createObjectStore(name,{keyPath:"id"});};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
}
async function withStore<T>(storeName:string,mode:IDBTransactionMode,action:(store:IDBObjectStore,done:(value:T)=>void,fail:(reason:unknown)=>void)=>void):Promise<T>{
  const db=await database();
  return new Promise((resolve,reject)=>{
    let transaction: IDBTransaction;
    try { transaction=db.transaction(storeName,mode); }
    catch(error){db.close();reject(error);return;}
    let result:T;
    let failure:unknown;
    transaction.oncomplete=()=>{db.close();resolve(result);};
    transaction.onabort=()=>{db.close();reject(failure??transaction.error??new Error("Offline transaction aborted"));};
    transaction.onerror=()=>{failure??=transaction.error;};
    const fail=(reason:unknown)=>{failure=reason;try{transaction.abort();}catch{db.close();reject(reason);}};
    try { action(transaction.objectStore(storeName),value=>{result=value;},fail); }
    catch(error){fail(error);}
  });
}
async function put<T extends {id:string}>(storeName:string,item:T){await withStore<void>(storeName,"readwrite",(store,done,fail)=>{const request=store.put(item);request.onsuccess=()=>done();request.onerror=()=>fail(request.error);});}
async function get<T>(storeName:string,id:string){return withStore<T|undefined>(storeName,"readonly",(store,done,fail)=>{const request=store.get(id);request.onsuccess=()=>done(request.result as T|undefined);request.onerror=()=>fail(request.error);});}
async function getAll<T>(storeName:string){return withStore<T[]>(storeName,"readonly",(store,done,fail)=>{const request=store.getAll();request.onsuccess=()=>done(request.result as T[]);request.onerror=()=>fail(request.error);});}
async function remove(storeName:string,id:string){await withStore<void>(storeName,"readwrite",(store,done,fail)=>{const request=store.delete(id);request.onsuccess=()=>done();request.onerror=()=>fail(request.error);});}
async function clear(storeName:string){await withStore<void>(storeName,"readwrite",(store,done,fail)=>{const request=store.clear();request.onsuccess=()=>done();request.onerror=()=>fail(request.error);});}

function countsTowardPolicy(store:PrivateStore,row:StoredRow){return store!==META_STORE||row.id.startsWith("note-snapshot:")||row.id.startsWith("note-draft:");}
function encodedBytes(value:unknown){return new TextEncoder().encode(JSON.stringify(value)).byteLength;}
async function mutatePrivate<T>(plan:(rows:Map<PrivateStore,StoredRow[]>)=>{mutations:PrivateMutation[];result:T}):Promise<T>{
  const db=await database();
  return new Promise<T>((resolve,reject)=>{
    let transaction:IDBTransaction;
    try{transaction=db.transaction([...PRIVATE_STORES],"readwrite");}
    catch(error){db.close();reject(error);return;}
    let failure:unknown,result:T,remaining=PRIVATE_STORES.length;
    const rows=new Map<PrivateStore,StoredRow[]>();
    const fail=(reason:unknown)=>{failure=reason;try{transaction.abort();}catch{db.close();reject(reason);}};
    transaction.oncomplete=()=>{db.close();resolve(result);};
    transaction.onabort=()=>{db.close();reject(failure??transaction.error??new Error("Offline transaction aborted"));};
    transaction.onerror=()=>{failure??=transaction.error;};
    const prepare=()=>{
      try{
        const prepared=plan(rows),projected=new Map<PrivateStore,StoredRow[]>([...rows].map(([store,items])=>[store,[...items]]));
        for(const mutation of prepared.mutations){
          const items=projected.get(mutation.store)!;
          const index=items.findIndex(item=>item.id===mutation.id);
          if(mutation.value===null){if(index>=0)items.splice(index,1);}
          else if(index>=0)items[index]=mutation.value;else items.push(mutation.value);
        }
        const retained=[...projected].flatMap(([store,items])=>items.filter(item=>countsTowardPolicy(store,item)));
        const limits=offlinePolicyLimits(),byteCount=retained.reduce((total,item)=>total+encodedBytes(item),0);
        if(limits&&(retained.length>limits.maxItems||byteCount>limits.maxBytes))throw new OfflineCacheLimitError(byteCount,retained.length,limits);
        result=prepared.result;
        for(const mutation of prepared.mutations){const store=transaction.objectStore(mutation.store);if(mutation.value===null)store.delete(mutation.id);else store.put(mutation.value);}
      }catch(error){fail(error);}
    };
    for(const storeName of PRIVATE_STORES){
      const request=transaction.objectStore(storeName).getAll();
      request.onerror=()=>fail(request.error);
      request.onsuccess=()=>{rows.set(storeName,request.result as StoredRow[]);if(--remaining===0)prepare();};
    }
  });
}

export async function pendingCaptures():Promise<PendingCapture[]>{return (await getAll<PendingCapture>(CAPTURE_STORE)).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));}
export async function queueCapture(text:string,id=crypto.randomUUID()):Promise<PendingCapture>{const item={id,text,createdAt:new Date().toISOString(),attempts:0,lastError:null};await mutatePrivate(()=>({mutations:[{store:CAPTURE_STORE,id,value:item}],result:undefined}));return item;}
export async function removePendingCapture(id:string){await remove(CAPTURE_STORE,id);}
export async function clearPendingCaptures(){await clear(CAPTURE_STORE);}
export async function flushPendingCaptures(send:(item:PendingCapture)=>Promise<unknown>){const items=await pendingCaptures();let sent=0;for(const item of items){try{await send(item);await removePendingCapture(item.id);sent++;}catch{break;}}return {sent,remaining:items.length-sent};}

export async function setReplicaDeviceId(deviceId:string){await put(META_STORE,{id:"device-id",value:deviceId});}
export async function replicaDeviceId(){return (await get<{id:string;value:string}>(META_STORE,"device-id"))?.value??null;}
export async function setOfflineClearOnLogout(value:boolean){await put(META_STORE,{id:"clear-on-logout",value});}
export async function offlineClearOnLogout(){return (await get<{id:string;value:boolean}>(META_STORE,"clear-on-logout"))?.value??true;}
export async function setSyncCursor(cursor:string){await put(META_STORE,{id:"cursor",value:cursor});}
export async function syncCursor(){return (await get<{id:string;value:string}>(META_STORE,"cursor"))?.value??null;}
function validateNoteSnapshot(snapshot:Omit<CachedNoteSnapshot,"cachedAt">){
  if(!offlineCaptureEnabled())throw new Error("Trusted offline storage is disabled");
  const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if(!uuid.test(snapshot.noteId)||!uuid.test(snapshot.revisionId))throw new Error("Invalid note snapshot identity");
  if(snapshot.updateBase64.length<4||snapshot.updateBase64.length>2_666_668||snapshot.updateBase64.length%4!==0||! /^[A-Za-z0-9+/]*={0,2}$/.test(snapshot.updateBase64))throw new Error("Invalid note snapshot encoding");
}
export async function cacheNoteSnapshot(snapshot:Omit<CachedNoteSnapshot,"cachedAt">){
  validateNoteSnapshot(snapshot);
  const value={id:`note-snapshot:${snapshot.noteId}`,...snapshot,cachedAt:new Date().toISOString()};
  await mutatePrivate(()=>({mutations:[{store:META_STORE,id:value.id,value}],result:undefined}));
}
export async function localNoteDraft(noteId:string):Promise<LocalNoteDraft|null>{
  if(!offlineCaptureEnabled())return null;
  return (await get<LocalNoteDraft>(META_STORE,`note-draft:${noteId}`))??null;
}

// The draft and outgoing update commit together. Remote snapshot refreshes use
// a separate key and cannot overwrite unsent local work. Callers serialize their
// own edits and reload/merge if another tab changes the expected draft version.
export async function persistLocalNoteEdit(
  snapshot:Omit<CachedNoteSnapshot,"cachedAt">,
  input:Extract<SyncOperation,{type:"note_yjs_update"}>,
  expectedLocalOperationId:string|null
){
  validateNoteSnapshot(snapshot);
  const operation=syncOperationSchema.parse(input);
  if(operation.type!=="note_yjs_update"||operation.noteId!==snapshot.noteId)throw new Error("Note update identity mismatch");
  await mutatePrivate(rows=>{
    if(!offlineCaptureEnabled())throw new Error("Trusted offline storage is disabled");
    const draft=rows.get(META_STORE)!.find(row=>row.id===`note-draft:${snapshot.noteId}`) as LocalNoteDraft|undefined;
    const acknowledged=rows.get(META_STORE)!.find(row=>row.id===`note-ack:${snapshot.noteId}`) as AcknowledgedNoteOperation|undefined;
    if(draft?.lastOperationId===operation.operationId){
      if(draft.updateBase64!==snapshot.updateBase64||draft.revisionId!==snapshot.revisionId||JSON.stringify(draft.lastOperation)!==JSON.stringify(operation))throw new Error("Queued operation ID cannot be reused for different content");
    }else if(acknowledged?.operation.operationId===operation.operationId){
      if(JSON.stringify(acknowledged.operation)!==JSON.stringify(operation))throw new Error("Acknowledged operation ID cannot be reused for different content");
      return {mutations:[],result:undefined};
    }else if((draft?.lastOperationId??acknowledged?.operation.operationId??null)!==expectedLocalOperationId)throw new Error("Local note changed in another editor");
    const queued=rows.get(SYNC_STORE)! as PendingSyncOperation[],prior=queued.find(row=>row.id===operation.operationId);
    if(prior&&JSON.stringify(prior.operation)!==JSON.stringify(operation))throw new Error("Queued operation ID cannot be reused for different content");
    if(draft?.lastOperationId===operation.operationId)return {mutations:[],result:undefined};
    if(prior)throw new Error("Queued operation ID is already in use");
    const last=queued.reduce((latest,row)=>Math.max(latest,Date.parse(row.createdAt)||0),0);
    const queuedValue={id:operation.operationId,operation,createdAt:new Date(Math.max(Date.now(),last+1)).toISOString()};
    const draftValue={id:`note-draft:${snapshot.noteId}`,...snapshot,lastOperationId:operation.operationId,lastOperation:operation,cachedAt:new Date().toISOString()};
    return {mutations:[{store:SYNC_STORE,id:queuedValue.id,value:queuedValue},{store:META_STORE,id:draftValue.id,value:draftValue}],result:undefined};
  });
}
export async function cachedNoteSnapshot(noteId:string):Promise<CachedNoteSnapshot|null>{
  if(!offlineCaptureEnabled())return null;
  if(await cachedNoteAccessBlocked(noteId))return null;
  return (await get<CachedNoteSnapshot>(META_STORE,`note-snapshot:${noteId}`))??null;
}
export async function cachedNoteAccessBlocked(noteId:string){return blockedNoteAccess.has(noteId)||Boolean(await get(META_STORE,`note-access-blocked:${noteId}`));}
export async function setCachedNoteAccessBlocked(noteId:string,blocked:boolean){
  if(blocked){
    blockedNoteAccess.add(noteId);
    await put(META_STORE,{id:`note-access-blocked:${noteId}`,blocked:true});
  }else{
    await remove(META_STORE,`note-access-blocked:${noteId}`);
    blockedNoteAccess.delete(noteId);
  }
}
export async function removeCachedNoteSnapshot(noteId:string){await remove(META_STORE,`note-snapshot:${noteId}`);}
export async function setCachedCoreAccessBlocked(blocked:boolean){
  if(blocked){blockedCoreAccess=true;await put(META_STORE,{id:"core-access-blocked",blocked:true});}
  else{await remove(META_STORE,"core-access-blocked");blockedCoreAccess=false;}
}
export async function cachedCoreAccessBlocked(){return blockedCoreAccess||Boolean(await get(META_STORE,"core-access-blocked"));}
export async function cacheCoreRecords(records:Omit<CachedCoreRecords,"id"|"cachedAt">){const value={id:"core",...records,cachedAt:new Date().toISOString()};await mutatePrivate(()=>({mutations:[{store:CORE_STORE,id:value.id,value}],result:undefined}));}
export async function cachedCoreRecords(){if(await cachedCoreAccessBlocked())return null;return (await get<CachedCoreRecords>(CORE_STORE,"core"))??null;}
export async function queueSyncOperation(operation:SyncOperation){
  await mutatePrivate(rows=>{
    const queued=rows.get(SYNC_STORE)! as PendingSyncOperation[],prior=queued.find(item=>item.id===operation.operationId);
    if(prior){if(JSON.stringify(prior.operation)!==JSON.stringify(operation))throw new Error("Queued operation ID cannot be reused for different content");return {mutations:[],result:undefined};}
    const last=queued.reduce((latest,item)=>Math.max(latest,Date.parse(item.createdAt)||0),0);
    const value={id:operation.operationId,operation,createdAt:new Date(Math.max(Date.now(),last+1)).toISOString()};
    return {mutations:[{store:SYNC_STORE,id:value.id,value}],result:undefined};
  });
}
export async function pendingSyncOperations(){return (await getAll<PendingSyncOperation>(SYNC_STORE)).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));}
export async function syncConflicts(){return (await getAll<StoredSyncConflict>(CONFLICT_STORE)).sort((a,b)=>a.recordedAt.localeCompare(b.recordedAt));}
export async function dismissSyncConflict(id:string){await remove(CONFLICT_STORE,id);}
export async function clearOfflineReplica(){for(const store of [META_STORE,CORE_STORE,SYNC_STORE,CONFLICT_STORE])await clear(store);blockedNoteAccess.clear();blockedCoreAccess=false;}
export async function clearOfflinePrivateDataForLogout(){
  await clear(CAPTURE_STORE);
  for(const store of [CORE_STORE,SYNC_STORE,CONFLICT_STORE])await clear(store);
  await withStore<void>(META_STORE,"readwrite",(store,done,fail)=>{
    const request=store.getAll();
    request.onerror=()=>fail(request.error);
    request.onsuccess=()=>{
      for(const row of request.result as Array<{id:string}>)if(!["device-id","clear-on-logout"].includes(row.id))store.delete(row.id);
      done();
    };
  });
  blockedNoteAccess.clear();blockedCoreAccess=false;
}
async function persistSyncAck(ack:SyncAck,batch:PendingSyncOperation[]){
  const batchIds=new Set(batch.map(item=>item.id));
  const accepted=new Set(ack.acceptedOperationIds);
  const completed=new Set([...ack.acceptedOperationIds,...ack.conflicts.map(item=>item.operationId)]);
  if([...completed].some(id=>!batchIds.has(id)))throw new Error("Sync acknowledgement contains an unknown operation");
  await mutatePrivate(rows=>{
    const now=new Date().toISOString();
    const queued=rows.get(SYNC_STORE)! as PendingSyncOperation[];
    const remaining=queued.filter(item=>!completed.has(item.id));
    const mutations:PrivateMutation[]=[
      {store:META_STORE,id:"cursor",value:{id:"cursor",value:ack.cursor}},
      ...[...completed].map(id=>({store:SYNC_STORE,id,value:null}) satisfies PrivateMutation),
      ...ack.conflicts.map(conflict=>({store:CONFLICT_STORE,id:conflict.operationId,value:{...conflict,id:conflict.operationId,operation:batch.find(item=>item.id===conflict.operationId)!.operation,recordedAt:now}}) satisfies PrivateMutation)
    ];
    const acceptedNotes=new Map<string,Extract<SyncOperation,{type:"note_yjs_update"}>>();
    for(const item of batch)if(accepted.has(item.id)&&item.operation.type==="note_yjs_update")acceptedNotes.set(item.operation.noteId,item.operation);
    for(const [noteId,operation] of acceptedNotes){
      mutations.push({store:META_STORE,id:`note-ack:${noteId}`,value:{id:`note-ack:${noteId}`,operation,acknowledgedAt:now}});
      const draft=rows.get(META_STORE)!.find(row=>row.id===`note-draft:${noteId}`) as LocalNoteDraft|undefined;
      const hasLaterUpdate=remaining.some(item=>item.operation.type==="note_yjs_update"&&item.operation.noteId===noteId);
      if(draft?.lastOperationId===operation.operationId&&!hasLaterUpdate){
        mutations.push(
          {store:META_STORE,id:`note-snapshot:${noteId}`,value:{id:`note-snapshot:${noteId}`,noteId,revisionId:draft.revisionId,updateBase64:draft.updateBase64,cachedAt:now}},
          {store:META_STORE,id:`note-draft:${noteId}`,value:null}
        );
      }
    }
    return {mutations,result:undefined};
  });
  return completed.size;
}
let activeSyncFlush: Promise<{sent:number;remaining:number;conflicts:number}> | null = null;
export function flushSyncOperations(send:(operations:SyncOperation[],cursor:string)=>Promise<SyncAck>){
  if(activeSyncFlush)return activeSyncFlush;
  activeSyncFlush=runSyncFlush(send).finally(()=>{activeSyncFlush=null;});
  return activeSyncFlush;
}
async function runSyncFlush(send:(operations:SyncOperation[],cursor:string)=>Promise<SyncAck>){
  const cursor=await syncCursor();if(!cursor)return {sent:0,remaining:(await pendingSyncOperations()).length,conflicts:0};
  let sent=0,conflictCount=0,currentCursor=cursor;
  for(;;){const batch=(await pendingSyncOperations()).slice(0,100);if(!batch.length)break;const ack=await send(batch.map(item=>item.operation),currentCursor);const completed=await persistSyncAck(ack,batch);currentCursor=ack.cursor;conflictCount+=ack.conflicts.length;sent+=ack.acceptedOperationIds.length;if(completed===0)break;}
  return {sent,remaining:(await pendingSyncOperations()).length,conflicts:conflictCount};
}
