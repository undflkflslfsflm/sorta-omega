import { api,ApiError,VAULT_ID } from "./api";
import { clearOfflinePrivateDataForLogout, setCachedCoreAccessBlocked, setOfflineCaptureEnabled, setOfflineClearOnLogout, setOfflinePolicyExpiry } from "./offline-queue";

type CachePolicy=Awaited<ReturnType<typeof api.deviceCachePolicy>>;
function policyExpiry(policy:CachePolicy){
  if(policy.expireAfterSeconds===null)return null;
  const base=Date.parse(policy.updatedAt??policy.createdAt??"");
  return new Date((Number.isFinite(base)?base:Date.now())+policy.expireAfterSeconds*1000).toISOString();
}
function policyAllowsOmega(policy:CachePolicy){
  const expiry=policyExpiry(policy);
  return policy.trusted&&policy.mode==="trusted_persistent"&&policy.selectedVaultIds.includes(VAULT_ID)
    &&policy.latestPurge?.status!=="requested"&&(!expiry||Date.parse(expiry)>Date.now());
}
async function rememberPolicy(policy:CachePolicy){await setOfflineClearOnLogout(policy.clearOnLogout);setOfflinePolicyExpiry(policyExpiry(policy));}

export async function approvePersistentOfflineCache(deviceId:string){
  const current=await api.deviceCachePolicy(deviceId);
  if(current.latestPurge?.status==="requested")throw new Error("Cache purge must be completed before persistent caching is approved again");
  const selectedVaultIds=[...new Set([...current.selectedVaultIds,VAULT_ID])];
  const configured=policyAllowsOmega(current)
    ?current
    :await api.setDeviceCachePolicy(current,{trusted:true,selectedVaultIds,cacheLimits:current.cacheLimits,expireAfterSeconds:current.expireAfterSeconds,clearOnLogout:current.clearOnLogout});
  if(!policyAllowsOmega(configured))throw new Error("Persistent cache policy was not applied");
  await rememberPolicy(configured);
  return configured;
}

export async function verifyPersistentOfflineCache(deviceId:string){
  const policy=await api.deviceCachePolicy(deviceId);
  if(policyAllowsOmega(policy)){await rememberPolicy(policy);return policy;}
  try{await clearOfflinePrivateDataForLogout();}finally{
    setOfflineCaptureEnabled(false);setOfflinePolicyExpiry(null);
    try{await setCachedCoreAccessBlocked(true);}catch{/* The in-memory block is immediate. */}
  }
  throw new ApiError(403,policy.latestPurge?.status==="requested"?"offline_cache_purge_requested":"offline_cache_policy_unavailable");
}
