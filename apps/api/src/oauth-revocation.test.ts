import { describe, expect, it, vi } from "vitest";
import { revokeGoogleOAuthToken, selectOAuthRevocationToken, unsupportedOAuthRevocation } from "./oauth-revocation.js";

describe("OAuth provider revocation", () => {
  it("prefers a refresh token and never returns unrelated credential fields", () => {
    expect(selectOAuthRevocationToken(JSON.stringify({ access_token: "access", refresh_token: "refresh", id_token: "identity" }))).toBe("refresh");
    expect(selectOAuthRevocationToken(JSON.stringify({ access_token: "access" }))).toBe("access");
    expect(selectOAuthRevocationToken("not-json")).toBeNull();
  });

  it("posts only the token to Google's fixed HTTPS revocation endpoint", async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 200 }));
    await expect(revokeGoogleOAuthToken("secret-token", fetcher as typeof fetch)).resolves.toEqual({
      attempted: true,
      succeeded: true,
      cleanupMayBeIncomplete: false,
      errorCode: null
    });
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://oauth2.googleapis.com/revoke");
    expect(init.method).toBe("POST");
    expect(init.redirect).toBe("error");
    expect(String(init.body)).toBe("token=secret-token");
    expect(String(init.body)).not.toContain("client");
  });

  it("records rejected, unavailable, and unsupported cleanup honestly", async () => {
    await expect(revokeGoogleOAuthToken("token", async () => new Response(null, { status: 400 }))).resolves.toMatchObject({ attempted: true, succeeded: false, cleanupMayBeIncomplete: true, errorCode: "provider_revocation_rejected" });
    await expect(revokeGoogleOAuthToken("token", async () => { throw new Error("offline"); })).resolves.toMatchObject({ attempted: true, succeeded: false, cleanupMayBeIncomplete: true, errorCode: "provider_revocation_unavailable" });
    expect(unsupportedOAuthRevocation()).toMatchObject({ attempted: false, succeeded: false, cleanupMayBeIncomplete: true, errorCode: "provider_revocation_unsupported" });
  });
});
