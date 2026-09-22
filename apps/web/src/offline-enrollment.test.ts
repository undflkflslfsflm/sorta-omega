import "fake-indexeddb/auto";
import { beforeEach,describe,expect,it,vi } from "vitest";
import type { DeviceCachePolicy } from "@sorta/contracts";
import { api,VAULT_ID } from "./api";
import { approvePersistentOfflineCache } from "./offline-enrollment";
import { clearOfflineReplica,offlineClearOnLogout } from "./offline-queue";

const deviceId="00000000-0000-4000-8000-000000000611";
const policy={deviceId,mode:"session_only",trusted:false,selectedVaultIds:[],cacheLimits:{maxBytes:536_870_912,maxItems:10_000},expireAfterSeconds:null,clearOnLogout:true,reportedState:{status:"unknown",cachedVaultIds:[],byteCount:null,itemCount:null,reportedAt:null},latestPurge:null,revision:0,createdAt:null,updatedAt:null} as DeviceCachePolicy;
describe("persistent offline enrollment",()=>{
  beforeEach(async()=>{vi.restoreAllMocks();await clearOfflineReplica();});
  it("explicitly promotes a session-only paired device and records logout policy",async()=>{
    vi.spyOn(api,"deviceCachePolicy").mockResolvedValue(policy);
    const configured={...policy,mode:"trusted_persistent" as const,trusted:true,selectedVaultIds:[VAULT_ID],revision:1};
    const update=vi.spyOn(api,"setDeviceCachePolicy").mockResolvedValue(configured);
    expect(await approvePersistentOfflineCache(deviceId)).toEqual(configured);
    expect(update).toHaveBeenCalledWith(policy,{trusted:true,selectedVaultIds:[VAULT_ID],cacheLimits:policy.cacheLimits,expireAfterSeconds:null,clearOnLogout:true});
    expect(await offlineClearOnLogout()).toBe(true);
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
});
