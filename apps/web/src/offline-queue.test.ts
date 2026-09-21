import "fake-indexeddb/auto";
import { beforeEach,describe,expect,it,vi } from "vitest";
import { cacheCoreRecords,cachedCoreRecords,clearOfflineReplica,clearPendingCaptures,flushSyncOperations,offlineCaptureEnabled,pendingSyncOperations,queueSyncOperation,setOfflineCaptureEnabled,setReplicaDeviceId,setSyncCursor,syncConflicts,syncCursor } from "./offline-queue";

const storage=new Map<string,string>();
Object.defineProperty(globalThis,"localStorage",{value:{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value),removeItem:(key:string)=>storage.delete(key),clear:()=>storage.clear()}});

describe("trusted browser replica",()=>{
  beforeEach(async()=>{storage.clear();await clearPendingCaptures();await clearOfflineReplica();});

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
  });
});
