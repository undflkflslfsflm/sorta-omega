export type OAuthRevocationResult = {
  attempted: boolean;
  succeeded: boolean;
  cleanupMayBeIncomplete: boolean;
  errorCode: string | null;
};

export function selectOAuthRevocationToken(serializedCredentials: string): string | null {
  let credentials: unknown;
  try {
    credentials = JSON.parse(serializedCredentials);
  } catch {
    return null;
  }
  if (!credentials || typeof credentials !== "object" || Array.isArray(credentials)) return null;
  const value = credentials as Record<string, unknown>;
  const refreshToken = typeof value.refresh_token === "string" ? value.refresh_token.trim() : "";
  const accessToken = typeof value.access_token === "string" ? value.access_token.trim() : "";
  return refreshToken || accessToken || null;
}

export async function revokeGoogleOAuthToken(
  token: string,
  fetcher: typeof fetch = fetch
): Promise<OAuthRevocationResult> {
  try {
    const response = await fetcher("https://oauth2.googleapis.com/revoke", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
      body: new URLSearchParams({ token }),
      redirect: "error",
      signal: AbortSignal.timeout(15_000)
    });
    return response.status === 200
      ? { attempted: true, succeeded: true, cleanupMayBeIncomplete: false, errorCode: null }
      : { attempted: true, succeeded: false, cleanupMayBeIncomplete: true, errorCode: "provider_revocation_rejected" };
  } catch {
    return { attempted: true, succeeded: false, cleanupMayBeIncomplete: true, errorCode: "provider_revocation_unavailable" };
  }
}

export const unsupportedOAuthRevocation = (): OAuthRevocationResult => ({
  attempted: false,
  succeeded: false,
  cleanupMayBeIncomplete: true,
  errorCode: "provider_revocation_unsupported"
});

export const noOAuthCredentialRevocation = (): OAuthRevocationResult => ({
  attempted: false,
  succeeded: false,
  cleanupMayBeIncomplete: false,
  errorCode: null
});
