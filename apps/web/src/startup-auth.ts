import { ApiError, type AuthSession } from "./api";
import { classifyWorkspaceRefreshFailure } from "./workspace-refresh";

export type StartupAuthState="setup"|"signin"|"recovery"|"authenticated"|"offline"|"unavailable";
export async function resolveStartupAuthState(dependencies:{
  session:()=>Promise<AuthSession>;
  loginOptions:()=>Promise<unknown>;
  cachedOfflineAvailable:()=>Promise<boolean>;
  blockCoreCache:()=>Promise<void>;
}):Promise<StartupAuthState>{
  try{
    const session=await dependencies.session();
    return session.auth_level==="recovery"?"recovery":"authenticated";
  }catch(error){
    const failure=classifyWorkspaceRefreshFailure(error);
    if(failure==="outage")return await dependencies.cachedOfflineAvailable()?"offline":"unavailable";
    if(failure==="access_denied")try{await dependencies.blockCoreCache();}catch{/* In-memory blocking is applied before persistence. */}
    // Once the host explicitly responds, a later login-options outage must not
    // downgrade the decision into unauthenticated offline access.
    try{await dependencies.loginOptions();return "signin";}
    catch(loginError){return loginError instanceof ApiError&&loginError.code==="bootstrap_required"?"setup":"unavailable";}
  }
}
