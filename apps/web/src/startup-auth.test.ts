import { describe,expect,it,vi } from "vitest";
import { ApiError,type AuthSession } from "./api";
import { resolveStartupAuthState } from "./startup-auth";

const session={id:"s",owner_id:"o",expires_at:"2026-09-23T00:00:00.000Z",auth_level:"passkey"} as AuthSession;
function dependencies(){return {session:vi.fn(async()=>session),loginOptions:vi.fn(async()=>({})),cachedOfflineAvailable:vi.fn(async()=>true),blockCoreCache:vi.fn(async()=>{})};}
describe("startup authentication boundary",()=>{
  it("accepts authenticated and restricted recovery sessions",async()=>{
    const authenticated=dependencies();expect(await resolveStartupAuthState(authenticated)).toBe("authenticated");
    const recovery=dependencies();recovery.session.mockResolvedValue({...session,auth_level:"recovery"});
    expect(await resolveStartupAuthState(recovery)).toBe("recovery");
  });
  it("uses trusted cache only when the initial session request is unavailable",async()=>{
    for(const error of [new TypeError("offline"),new ApiError(503,"unavailable")]){
      const available=dependencies();available.session.mockRejectedValue(error);
      expect(await resolveStartupAuthState(available)).toBe("offline");
      expect(available.loginOptions).not.toHaveBeenCalled();
      const missing=dependencies();missing.session.mockRejectedValue(error);missing.cachedOfflineAvailable.mockResolvedValue(false);
      expect(await resolveStartupAuthState(missing)).toBe("unavailable");
    }
  });
  it("never falls back after an explicit authentication failure",async()=>{
    const deps=dependencies();deps.session.mockRejectedValue(new ApiError(401,"expired"));deps.loginOptions.mockRejectedValue(new TypeError("offline"));
    expect(await resolveStartupAuthState(deps)).toBe("unavailable");
    expect(deps.cachedOfflineAvailable).not.toHaveBeenCalled();
  });
  it("blocks core cache on 403 even if persistence reports failure",async()=>{
    const deps=dependencies();deps.session.mockRejectedValue(new ApiError(403,"denied"));deps.blockCoreCache.mockRejectedValue(new Error("storage"));
    expect(await resolveStartupAuthState(deps)).toBe("signin");
    expect(deps.blockCoreCache).toHaveBeenCalledOnce();
    expect(deps.cachedOfflineAvailable).not.toHaveBeenCalled();
  });
  it("shows setup only for the explicit bootstrap state",async()=>{
    const setup=dependencies();setup.session.mockRejectedValue(new ApiError(401,"missing"));setup.loginOptions.mockRejectedValue(new ApiError(409,"bootstrap_required"));
    expect(await resolveStartupAuthState(setup)).toBe("setup");
    const malformed=dependencies();malformed.session.mockRejectedValue(new SyntaxError("bad session"));malformed.loginOptions.mockRejectedValue(new SyntaxError("bad options"));
    expect(await resolveStartupAuthState(malformed)).toBe("unavailable");
  });
});
