import "fake-indexeddb/auto";
import { beforeEach,describe,expect,it,vi } from "vitest";
import type { DeviceCachePolicy } from "@sorta/contracts";
import { api,ApiError,VAULT_ID } from "./api";
import { approvePersistentOfflineCache,enforceLocalOfflinePolicyExpiry,verifyPersistentOfflineCache } from "./offline-enrollment";
import { cacheCoreRecords,cachedCoreRecords,clearOfflineReplica,offlineCaptureEnabled,offlineClearOnLogout,offlinePolicyExpiry,offlinePolicyLimits,setOfflineCaptureEnabled,setOfflinePolicyExpiry,setOfflinePolicyLimits,setReplicaDeviceId } from "./offline-queue";

const deviceId="00000000-0000-4000-8000-000000000611";
const storage=new Map<string,string>();
Object.defineProperty(globalThis,"localStorage",{value:{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value),removeItem:(key:string)=>storage.delete(key)}});
const policy={deviceId,mode:"session_only",trusted:false,selectedVaultIds:[],cacheLimits:{maxBytes:536_870_912,maxItems:10_000},expireAfterSeconds:null,clearOnLogout:true,reportedState:{status:"unknown",cachedVaultIds:[],byteCount:null,itemCount:null,reportedAt:null},latestPurge:null,revision:0,createdAt:null,updatedAt:null} as DeviceCachePolicy;
describe("persistent offline enrollment",()=>{
  beforeEach(async()=>{vi.restoreAllMocks();vi.useRealTimers();storage.clear();setOfflinePolicyLimits(policy.cacheLimits);await clearOfflineReplica();});
  it("explicitly promotes a session-only paired device and records logout policy",async()=>{
    vi.spyOn(api,"deviceCachePolicy").mockResolvedValue(policy);
    const configured={...policy,mode:"trusted_persistent" as const,trusted:true,selectedVaultIds:[VAULT_ID],revision:1};
    const update=vi.spyOn(api,"setDeviceCachePolicy").mockResolvedValue(configured);
    expect(await approvePersistentOfflineCache(deviceId)).toEqual(configured);
    expect(update).toHaveBeenCalledWith(policy,{trusted:true,selectedVaultIds:[VAULT_ID],cacheLimits:policy.cacheLimits,expireAfterSeconds:null,clearOnLogout:true});
    expect(await offlineClearOnLogout()).toBe(true);
    expect(offlinePolicyLimits()).toEqual(policy.cacheLimits);
  });
  it("does not rewrite an already approved policy and preserves retain-on-logout",async()=>{
    const configured={...policy,mode:"trusted_persistent" as const,trusted:true,selectedVaultIds:[VAULT_ID],clearOnLogout:false};
    vi.spyOn(api,"deviceCachePolicy").mockResolvedValue(configured);
    const update=vi.spyOn(api,"setDeviceCachePolicy");
    expect(await approvePersistentOfflineCache(deviceId)).toEqual(configured);
    expect(update).not.toHaveBeenCalled();
    expect(await offlineClearOnLogout()).toBe(false);
  });
  it("rejects a server response that did not approve persistent vault caching",async()=>{
    vi.spyOn(api,"deviceCachePolicy").mockResolvedValue(policy);
    vi.spyOn(api,"setDeviceCachePolicy").mockResolvedValue(policy);
    await expect(approvePersistentOfflineCache(deviceId)).rejects.toThrow("not applied");
  });
  it("records server-relative policy expiry",async()=>{
    const updatedAt=new Date(Date.now()+10_000).toISOString();
    const expiring={...policy,mode:"trusted_persistent" as const,trusted:true,selectedVaultIds:[VAULT_ID],expireAfterSeconds:3600,updatedAt};
    vi.spyOn(api,"deviceCachePolicy").mockResolvedValue(expiring);
    await approvePersistentOfflineCache(deviceId);setOfflineCaptureEnabled(true);
    expect(offlinePolicyExpiry()).toBe(new Date(Date.parse(updatedAt)+3_600_000).toISOString());expect(offlineCaptureEnabled()).toBe(true);
  });
  it("renews an otherwise approved policy after its validity window expires",async()=>{
    const expired={...policy,mode:"trusted_persistent" as const,trusted:true,selectedVaultIds:[VAULT_ID],expireAfterSeconds:3600,updatedAt:"2020-01-01T00:00:00.000Z"};
    const renewed={...expired,revision:1,updatedAt:new Date().toISOString()};
    vi.spyOn(api,"deviceCachePolicy").mockResolvedValue(expired);
    const update=vi.spyOn(api,"setDeviceCachePolicy").mockResolvedValue(renewed);
    expect(await approvePersistentOfflineCache(deviceId)).toEqual(renewed);
    expect(update).toHaveBeenCalledOnce();
  });
  it("clears and disables private data when an online policy check reports purge",async()=>{
    setOfflineCaptureEnabled(true);await setReplicaDeviceId(deviceId);await cacheCoreRecords({notes:[],tasks:[],events:[]});
    const purged={...policy,latestPurge:{id:"00000000-0000-4000-8000-000000000612",status:"requested" as const,requestedAt:"2026-09-22T12:00:00.000Z",acknowledgedAt:null}};
    vi.spyOn(api,"deviceCachePolicy").mockResolvedValue(purged);
    await expect(verifyPersistentOfflineCache(deviceId)).rejects.toMatchObject({status:403,code:"offline_cache_purge_requested"});
    expect(offlineCaptureEnabled()).toBe(false);expect(offlinePolicyLimits()).toBeNull();expect(await cachedCoreRecords()).toBeNull();
  });
  it("refreshes a valid policy without deleting cached data",async()=>{
    setOfflineCaptureEnabled(true);await cacheCoreRecords({notes:[],tasks:[],events:[]});
    const configured={...policy,mode:"trusted_persistent" as const,trusted:true,selectedVaultIds:[VAULT_ID]};
    vi.spyOn(api,"deviceCachePolicy").mockResolvedValue(configured);
    expect(await verifyPersistentOfflineCache(deviceId)).toEqual(configured);
    expect(await cachedCoreRecords()).not.toBeNull();
  });
  it("clears a replica when its server-side device grant is gone",async()=>{
    setOfflineCaptureEnabled(true);await setReplicaDeviceId(deviceId);await cacheCoreRecords({notes:[],tasks:[],events:[]});
    vi.spyOn(api,"deviceCachePolicy").mockRejectedValue(new ApiError(404,"device_not_found"));
    await expect(verifyPersistentOfflineCache(deviceId)).rejects.toMatchObject({status:403,code:"offline_replica_device_revoked"});
    expect(offlineCaptureEnabled()).toBe(false);expect(await cachedCoreRecords()).toBeNull();
  });
  it("does not destroy retained data for a transient policy-check failure",async()=>{
    setOfflineCaptureEnabled(true);await cacheCoreRecords({notes:[],tasks:[],events:[]});
    const failure=new TypeError("offline");vi.spyOn(api,"deviceCachePolicy").mockRejectedValue(failure);
    await expect(verifyPersistentOfflineCache(deviceId)).rejects.toBe(failure);
    expect(offlineCaptureEnabled()).toBe(true);expect(await cachedCoreRecords()).not.toBeNull();
  });
  it("actively removes expired private bytes before an online policy request",async()=>{
    const request=vi.spyOn(api,"deviceCachePolicy");
    setOfflineCaptureEnabled(true);setOfflinePolicyExpiry("2020-01-01T00:00:00.000Z");await cacheCoreRecords({notes:[],tasks:[],events:[]});
    expect(await enforceLocalOfflinePolicyExpiry()).toBe(true);
    expect(offlineCaptureEnabled()).toBe(false);expect(offlinePolicyExpiry()).toBeNull();expect(await cachedCoreRecords()).toBeNull();
    expect(request).not.toHaveBeenCalled();
  });
});
