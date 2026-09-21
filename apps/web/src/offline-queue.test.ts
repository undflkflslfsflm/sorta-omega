import "fake-indexeddb/auto";
import { beforeEach,describe,expect,it } from "vitest";
import { cacheCoreRecords,cachedCoreRecords,clearOfflineReplica,clearPendingCaptures,flushSyncOperations,offlineCaptureEnabled,pendingSyncOperations,queueSyncOperation,setOfflineCaptureEnabled,setReplicaDeviceId,setSyncCursor,syncConflicts,syncCursor } from "./offline-queue";

const storage=new Map<string,string>();
Object.defineProperty(globalThis,"localStorage",{value:{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value),removeItem:(key:string)=>storage.delete(key),clear:()=>storage.clear()}});

describe("trusted browser replica",()=>{
  beforeEach(async()=>{storage.clear();await clearPendingCaptures();await clearOfflineReplica();});

  it("keeps trust explicit and caches only the selected core projection",async()=>{
    expect(offlineCaptureEnabled()).toBe(false);setOfflineCaptureEnabled(true);expect(offlineCaptureEnabled()).toBe(true);
    await cacheCoreRecords({notes:[],tasks:[],events:[]});
    expect((await cachedCoreRecords())?.notes).toEqual([]);
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
