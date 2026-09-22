import { api,VAULT_ID } from "./api";
import { setOfflineClearOnLogout } from "./offline-queue";

export async function approvePersistentOfflineCache(deviceId:string){
  const current=await api.deviceCachePolicy(deviceId);
  const selectedVaultIds=[...new Set([...current.selectedVaultIds,VAULT_ID])];
  const configured=current.trusted&&current.selectedVaultIds.includes(VAULT_ID)
    ?current
    :await api.setDeviceCachePolicy(current,{trusted:true,selectedVaultIds,cacheLimits:current.cacheLimits,expireAfterSeconds:current.expireAfterSeconds,clearOnLogout:current.clearOnLogout});
  if(!configured.trusted||!configured.selectedVaultIds.includes(VAULT_ID))throw new Error("Persistent cache policy was not applied");
  await setOfflineClearOnLogout(configured.clearOnLogout);
  return configured;
}
