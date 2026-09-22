import { describe,expect,it } from "vitest";
import { ApiError } from "./api";
import { classifyWorkspaceRefreshFailure } from "./workspace-refresh";

describe("workspace refresh failure classification",()=>{
  it("distinguishes authentication and authorization from outages",()=>{
    expect(classifyWorkspaceRefreshFailure(new ApiError(401,"expired"))).toBe("authentication_required");
    expect(classifyWorkspaceRefreshFailure(new ApiError(403,"denied"))).toBe("access_denied");
    expect(classifyWorkspaceRefreshFailure(new TypeError("network"))).toBe("outage");
    for(const status of [500,502,503,504])expect(classifyWorkspaceRefreshFailure(new ApiError(status,"unavailable"))).toBe("outage");
  });
  it("does not classify conflicts, validation, absence, or malformed responses as offline",()=>{
    for(const status of [400,404,409,410,422,429])expect(classifyWorkspaceRefreshFailure(new ApiError(status,"not_outage"))).toBe("other");
    expect(classifyWorkspaceRefreshFailure(new SyntaxError("malformed"))).toBe("other");
    expect(classifyWorkspaceRefreshFailure(new Error("storage failed"))).toBe("other");
  });
});
