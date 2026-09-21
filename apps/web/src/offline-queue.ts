import type { CalendarEvent, Note, SyncAck, SyncConflict, SyncOperation, Task } from "@sorta/contracts";

export type PendingCapture = { id: string; text: string; createdAt: string; attempts: number; lastError: string | null };
export type CachedCoreRecords = { id: "core"; notes: Note[]; tasks: Task[]; events: CalendarEvent[]; cachedAt: string };
type PendingSyncOperation = { id: string; operation: SyncOperation; createdAt: string };
type StoredSyncConflict = SyncConflict & { id: string; recordedAt: string };

const DATABASE = "sorta-private-offline-v1";
const CAPTURE_STORE = "pending-captures";
const META_STORE = "sync-meta";
const CORE_STORE = "core-cache";
const SYNC_STORE = "pending-sync";
const CONFLICT_STORE = "sync-conflicts";
const TRUST_KEY = "sorta.trustedOfflineCapture";

export function offlineCaptureEnabled(){ return localStorage.getItem(TRUST_KEY)==="true"; }
export function setOfflineCaptureEnabled(enabled:boolean){ localStorage.setItem(TRUST_KEY,String(enabled)); }

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

export async function pendingCaptures():Promise<PendingCapture[]>{return (await getAll<PendingCapture>(CAPTURE_STORE)).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));}
export async function queueCapture(text:string,id=crypto.randomUUID()):Promise<PendingCapture>{const item={id,text,createdAt:new Date().toISOString(),attempts:0,lastError:null};await put(CAPTURE_STORE,item);return item;}
export async function removePendingCapture(id:string){await remove(CAPTURE_STORE,id);}
export async function clearPendingCaptures(){await clear(CAPTURE_STORE);}
export async function flushPendingCaptures(send:(item:PendingCapture)=>Promise<unknown>){const items=await pendingCaptures();let sent=0;for(const item of items){try{await send(item);await removePendingCapture(item.id);sent++;}catch{break;}}return {sent,remaining:items.length-sent};}

export async function setReplicaDeviceId(deviceId:string){await put(META_STORE,{id:"device-id",value:deviceId});}
export async function replicaDeviceId(){return (await get<{id:string;value:string}>(META_STORE,"device-id"))?.value??null;}
export async function setSyncCursor(cursor:string){await put(META_STORE,{id:"cursor",value:cursor});}
export async function syncCursor(){return (await get<{id:string;value:string}>(META_STORE,"cursor"))?.value??null;}
export async function cacheCoreRecords(records:Omit<CachedCoreRecords,"id"|"cachedAt">){await put(CORE_STORE,{id:"core",...records,cachedAt:new Date().toISOString()});}
export async function cachedCoreRecords(){return (await get<CachedCoreRecords>(CORE_STORE,"core"))??null;}
export async function queueSyncOperation(operation:SyncOperation){await put(SYNC_STORE,{id:operation.operationId,operation,createdAt:new Date().toISOString()});}
export async function pendingSyncOperations(){return (await getAll<PendingSyncOperation>(SYNC_STORE)).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));}
export async function syncConflicts(){return (await getAll<StoredSyncConflict>(CONFLICT_STORE)).sort((a,b)=>a.recordedAt.localeCompare(b.recordedAt));}
export async function clearOfflineReplica(){for(const store of [META_STORE,CORE_STORE,SYNC_STORE,CONFLICT_STORE])await clear(store);}
export async function flushSyncOperations(send:(operations:SyncOperation[],cursor:string)=>Promise<SyncAck>){
  const cursor=await syncCursor();if(!cursor)return {sent:0,remaining:(await pendingSyncOperations()).length,conflicts:0};
  let sent=0,conflictCount=0,currentCursor=cursor;
  for(;;){const batch=(await pendingSyncOperations()).slice(0,100);if(!batch.length)break;const ack=await send(batch.map(item=>item.operation),currentCursor);currentCursor=ack.cursor;await setSyncCursor(currentCursor);const completed=new Set([...ack.acceptedOperationIds,...ack.conflicts.map(item=>item.operationId)]);for(const item of batch)if(completed.has(item.id))await remove(SYNC_STORE,item.id);for(const conflict of ack.conflicts){await put(CONFLICT_STORE,{...conflict,id:conflict.operationId,recordedAt:new Date().toISOString()});conflictCount++;}sent+=ack.acceptedOperationIds.length;if(completed.size===0)break;}
  return {sent,remaining:(await pendingSyncOperations()).length,conflicts:conflictCount};
}
