import { describe, expect, it } from "vitest";
import { ApiError } from "./api";
import { passkeySignInMessage } from "./passkey-signin";

describe("passkey sign-in guidance", () => {
  it("distinguishes browser limitations from server verification", () => {
    expect(passkeySignInMessage("options", new TypeError("Failed to fetch"))).toContain("Tailscale");
    expect(passkeySignInMessage("browser", new Error("webauthn_unavailable"))).toContain("Safari");
    expect(passkeySignInMessage("browser", Object.assign(new Error("blocked"), { name: "SecurityError" }))).toContain("blocked");
    expect(passkeySignInMessage("verify", new ApiError(401, "unknown_passkey"))).toContain("not registered");
    expect(passkeySignInMessage("verify", new ApiError(410, "challenge_expired"))).toContain("too long");
  });

  it("does not expose raw browser or server exception text", () => {
    expect(passkeySignInMessage("browser", new Error("secret browser detail"))).not.toContain("secret browser detail");
    expect(passkeySignInMessage("verify", new Error("secret server detail"))).not.toContain("secret server detail");
  });
});
