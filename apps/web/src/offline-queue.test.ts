import "fake-indexeddb/auto";
import { dismissSyncConflict } from "./offline-queue";
import { localNoteDraft, persistLocalNoteEdit } from "./offline-queue";
import { cacheNoteSnapshot, cachedNoteSnapshot, removeCachedNoteSnapshot } from "./offline-queue";
import { beforeEach,describe,expect,it,vi } from "vitest";
import { cacheCoreRecords,cachedCoreAccessBlocked,cachedCoreRecords,clearOfflinePrivateDataForLogout,clearOfflineReplica,clearPendingCaptures,flushSyncOperations,offlineCaptureEnabled,localNoteDraft as readLocalNoteDraft,offlineClearOnLogout,offlinePolicyExpiry,pendingCaptures,pendingSyncOperations,queueCapture,queueSyncOperation,replicaDeviceId,setCachedCoreAccessBlocked,setOfflineCaptureEnabled,setOfflineClearOnLogout,setOfflinePolicyExpiry,setReplicaDeviceId,setSyncCursor,syncConflicts,syncCursor } from "./offline-queue";

const storage=new Map<string,string>();
Object.defineProperty(globalThis,"localStorage",{value:{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value),removeItem:(key:string)=>storage.delete(key),clear:()=>storage.clear()}});

describe("trusted browser replica",()=>{
  beforeEach(async()=>{storage.clear();await clearPendingCaptures();await clearOfflineReplica();});

  const noteSnapshot={noteId:"00000000-0000-4000-8000-000000000511",revisionId:"00000000-0000-4000-8000-000000000512",updateBase64:"AAA="};
  const noteOperation={type:"note_yjs_update" as const,operationId:"00000000-0000-4000-8000-000000000513",noteId:noteSnapshot.noteId,baseRevision:1,updateBase64:"AAA="};

  it("persists a workspace access block without destroying retained records",async()=>{
    const records={notes:[],tasks:[],events:[]};
    await cacheCoreRecords(records);
    expect(await cachedCoreRecords()).toMatchObject(records);
    await setCachedCoreAccessBlocked(true);
    expect(await cachedCoreAccessBlocked()).toBe(true);
    expect(await cachedCoreRecords()).toBeNull();
    await setCachedCoreAccessBlocked(false);
    expect(await cachedCoreAccessBlocked()).toBe(false);
    expect(await cachedCoreRecords()).toMatchObject(records);
  });

  it("disables trusted caching synchronously when its recorded policy expires",()=>{
    vi.useFakeTimers();vi.setSystemTime(new Date("2026-09-22T12:00:00.000Z"));
    setOfflineCaptureEnabled(true);setOfflinePolicyExpiry("2026-09-22T13:00:00.000Z");
    expect(offlineCaptureEnabled()).toBe(true);expect(offlinePolicyExpiry()).toBe("2026-09-22T13:00:00.000Z");
    vi.setSystemTime(new Date("2026-09-22T13:00:00.000Z"));expect(offlineCaptureEnabled()).toBe(false);
    vi.useRealTimers();
  });

  it("clears private logout data while preserving device enrollment and policy",async()=>{
    setOfflineCaptureEnabled(true);await setReplicaDeviceId(noteSnapshot.noteId);await setOfflineClearOnLogout(false);
    await cacheCoreRecords({notes:[],tasks:[],events:[]});await queueCapture("unsent");await persistLocalNoteEdit(noteSnapshot,noteOperation,null);
    await clearOfflinePrivateDataForLogout();
    expect(await replicaDeviceId()).toBe(noteSnapshot.noteId);
    expect(await offlineClearOnLogout()).toBe(false);
    expect(await cachedCoreRecords()).toBeNull();
    expect(await pendingCaptures()).toEqual([]);
    expect(await pendingSyncOperations()).toEqual([]);
    expect(await readLocalNoteDraft(noteSnapshot.noteId)).toBeNull();
  });

  it("commits a local note and outbox together, preserves it across remote refresh and retries",async()=>{
    await expect(persistLocalNoteEdit(noteSnapshot,noteOperation,null)).rejects.toThrow("disabled");
    setOfflineCaptureEnabled(true);
    await persistLocalNoteEdit(noteSnapshot,noteOperation,null);
    await persistLocalNoteEdit(noteSnapshot,noteOperation,null);
    expect((await pendingSyncOperations()).map(row=>row.operation)).toEqual([noteOperation]);
    await cacheNoteSnapshot({...noteSnapshot,updateBase64:"AQI="});
    expect(await localNoteDraft(noteSnapshot.noteId)).toMatchObject({...noteSnapshot,lastOperationId:noteOperation.operationId});
    await setSyncCursor("before");
    await flushSyncOperations(async()=>({acceptedOperationIds:[noteOperation.operationId],conflicts:[],cursor:"after"}));
    await persistLocalNoteEdit(noteSnapshot,noteOperation,null);
    expect(await pendingSyncOperations()).toEqual([]);
    await expect(persistLocalNoteEdit(noteSnapshot,{...noteOperation,baseRevision:2},null)).rejects.toThrow("cannot be reused");
    setOfflineCaptureEnabled(false);
    expect(await localNoteDraft(noteSnapshot.noteId)).toBeNull();
    setOfflineCaptureEnabled(true);
    await clearOfflineReplica();
    expect(await localNoteDraft(noteSnapshot.noteId)).toBeNull();
  });

  it("rejects competing stale editors instead of overwriting their local snapshot",async()=>{
    setOfflineCaptureEnabled(true);
    const second={...noteOperation,operationId:"00000000-0000-4000-8000-000000000514"};
    const results=await Promise.allSettled([
      persistLocalNoteEdit(noteSnapshot,noteOperation,null),
      persistLocalNoteEdit({...noteSnapshot,updateBase64:"AQI="},second,null)
    ]);
    expect(results.map(result=>result.status).sort()).toEqual(["fulfilled","rejected"]);
    expect(await pendingSyncOperations()).toHaveLength(1);
    const draft=(await localNoteDraft(noteSnapshot.noteId))!;
    expect((await pendingSyncOperations())[0].id).toBe(draft.lastOperationId);
    const next={...noteOperation,operationId:"00000000-0000-4000-8000-000000000515",updateBase64:"AQI="};
    await persistLocalNoteEdit({...noteSnapshot,updateBase64:"AQI="},next,draft.lastOperationId);
    expect((await pendingSyncOperations()).map(row=>row.id)).toEqual([draft.lastOperationId,next.operationId]);
    expect((await localNoteDraft(noteSnapshot.noteId))?.lastOperationId).toBe(next.operationId);
  });

  it("rolls back both local note and outbox when snapshot persistence aborts",async()=>{
    setOfflineCaptureEnabled(true);
    const original=IDBObjectStore.prototype.put;
    const spy=vi.spyOn(IDBObjectStore.prototype,"put").mockImplementation(function(this:IDBObjectStore,value:unknown,key?:IDBValidKey){
      const request=original.call(this,value,key);
      if(this.name==="sync-meta")request.addEventListener("success",()=>this.transaction.abort());
      return request;
    });
    try{await expect(persistLocalNoteEdit(noteSnapshot,noteOperation,null)).rejects.toThrow();}
    finally{spy.mockRestore();}
    expect(await localNoteDraft(noteSnapshot.noteId)).toBeNull();
    expect(await pendingSyncOperations()).toEqual([]);
    await persistLocalNoteEdit(noteSnapshot,noteOperation,null);
    expect(await pendingSyncOperations()).toHaveLength(1);
  });

  it("retains canonical snapshots only for trusted use and erases them with the replica",async()=>{
    const snapshot={noteId:"00000000-0000-4000-8000-000000000411",revisionId:"00000000-0000-4000-8000-000000000412",updateBase64:"AAA="};
    await expect(cacheNoteSnapshot(snapshot)).rejects.toThrow("disabled");
    setOfflineCaptureEnabled(true);
    await cacheNoteSnapshot(snapshot);
    expect(await cachedNoteSnapshot(snapshot.noteId)).toMatchObject(snapshot);
    setOfflineCaptureEnabled(false);
    expect(await cachedNoteSnapshot(snapshot.noteId)).toBeNull();
    setOfflineCaptureEnabled(true);
    await removeCachedNoteSnapshot(snapshot.noteId);
    expect(await cachedNoteSnapshot(snapshot.noteId)).toBeNull();
    await cacheNoteSnapshot(snapshot);
    await clearOfflineReplica();
    expect(await cachedNoteSnapshot(snapshot.noteId)).toBeNull();
  });

  it("rejects a write that succeeds at request level but aborts before commit",async()=>{
    const original=IDBObjectStore.prototype.put;
    const spy=vi.spyOn(IDBObjectStore.prototype,"put").mockImplementation(function(this:IDBObjectStore,value:unknown,key?:IDBValidKey){
      const request=original.call(this,value,key);
      const transaction=this.transaction;
      request.addEventListener("success",()=>transaction.abort());
      return request;
    });
    try {
      await expect(setSyncCursor("uncommitted-cursor")).rejects.toBeDefined();
    } finally { spy.mockRestore(); }
    expect(await syncCursor()).toBeNull();
  });

  it("keeps trust explicit and caches only the selected core projection",async()=>{
    expect(offlineCaptureEnabled()).toBe(false);setOfflineCaptureEnabled(true);expect(offlineCaptureEnabled()).toBe(true);
    await cacheCoreRecords({notes:[],tasks:[],events:[]});
    expect((await cachedCoreRecords())?.notes).toEqual([]);
  });

  it("shares overlapping flushes and permits retry after a failed send",async()=>{
    await setSyncCursor("cursor");
    const id="00000000-0000-4000-8000-000000000321";
    await queueSyncOperation({type:"task_create",operationId:id,taskId:"00000000-0000-4000-8000-000000000322",command:{title:"Only once",priority:3,allowSplit:true}});
    const failing=vi.fn().mockRejectedValue(new Error("offline"));
    const first=flushSyncOperations(failing);
    const second=flushSyncOperations(failing);
    expect(first).toBe(second);
    const failures=await Promise.allSettled([first,second]);
    expect(failures.map(result=>result.status)).toEqual(["rejected","rejected"]);
    expect(failing).toHaveBeenCalledTimes(1);
    const succeeding=vi.fn().mockResolvedValue({acceptedOperationIds:[id],cursor:"cursor",conflicts:[]});
    const retry=flushSyncOperations(succeeding);
    expect(flushSyncOperations(succeeding)).toBe(retry);
    expect(await retry).toEqual({sent:1,remaining:0,conflicts:0});
    expect(succeeding).toHaveBeenCalledTimes(1);
  });

  it("preserves enqueue order within one millisecond and refuses changed operation IDs",async()=>{
    const time=vi.spyOn(Date,"now").mockReturnValue(1700000000000);
    const first={type:"task_create" as const,operationId:"00000000-0000-4000-8000-000000000999",taskId:"00000000-0000-4000-8000-000000000123",command:{title:"First",priority:3,allowSplit:true}};
    const second={...first,operationId:"00000000-0000-4000-8000-000000000001",command:{...first.command,title:"Second"}};
    try {
      await Promise.all([queueSyncOperation(first),queueSyncOperation(second)]);
      await queueSyncOperation(first);
      await expect(queueSyncOperation({...first,command:{...first.command,title:"Replacement"}})).rejects.toThrow("cannot be reused");
    } finally {time.mockRestore();}
    const queued=await pendingSyncOperations();
    expect(queued.map(item=>item.operation)).toEqual([first,second]);
  });

  it("rolls back queue deletion and cursor advancement when storing a conflict fails",async()=>{
    const id="00000000-0000-4000-8000-000000000211";
    await setSyncCursor("before");
    await queueSyncOperation({type:"task_create",operationId:id,taskId:"00000000-0000-4000-8000-000000000212",command:{title:"Keep my change",priority:3,allowSplit:true}});
    const original=IDBObjectStore.prototype.put;
    const spy=vi.spyOn(IDBObjectStore.prototype,"put").mockImplementation(function(this:IDBObjectStore,value:unknown,key?:IDBValidKey){
      if(this.name==="sync-conflicts")throw new Error("Simulated disk failure");
      return original.call(this,value,key);
    });
    try {
      await expect(flushSyncOperations(async()=>({acceptedOperationIds:[],cursor:"after",conflicts:[{operationId:id,code:"stale_revision",currentRevision:2,tombstoned:false}]}))).rejects.toThrow();
    } finally { spy.mockRestore(); }
    expect(await syncCursor()).toBe("before");
    expect((await pendingSyncOperations()).map(item=>item.id)).toEqual([id]);
    expect(await syncConflicts()).toEqual([]);
  });

  it("flushes ordered operations once, advances the cursor, and retains conflicts for review",async()=>{
    const first="00000000-0000-4000-8000-000000000111",second="00000000-0000-4000-8000-000000000112";
    await setReplicaDeviceId("00000000-0000-4000-8000-000000000100");await setSyncCursor("cursor-1");
    await queueSyncOperation({type:"task_create",operationId:first,taskId:"00000000-0000-4000-8000-000000000121",command:{title:"One",priority:3,allowSplit:true}});
    await queueSyncOperation({type:"task_create",operationId:second,taskId:"00000000-0000-4000-8000-000000000122",command:{title:"Two",priority:3,allowSplit:true}});
    const result=await flushSyncOperations(async(operations,cursor)=>{expect(cursor).toBe("cursor-1");expect(operations.map(item=>item.operationId)).toEqual([first,second]);return{acceptedOperationIds:[first],cursor:"cursor-2",conflicts:[{operationId:second,code:"stale_revision",currentRevision:2,tombstoned:false}]};});
    expect(result).toEqual({sent:1,remaining:0,conflicts:1});expect(await syncCursor()).toBe("cursor-2");expect(await pendingSyncOperations()).toEqual([]);expect((await syncConflicts())[0]?.operationId).toBe(second);
    expect((await syncConflicts())[0]?.operation).toMatchObject({operationId:second,command:{title:"Two"}});
    await queueSyncOperation({type:"task_create",operationId:first,taskId:"00000000-0000-4000-8000-000000000121",command:{title:"Still pending",priority:3,allowSplit:true}});
    await dismissSyncConflict(second);
    expect(await syncConflicts()).toEqual([]);
    expect((await pendingSyncOperations()).map(item=>item.id)).toEqual([first]);
  });
});
