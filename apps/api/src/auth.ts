import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { AuthenticationResponseJSON, RegistrationResponseJSON, WebAuthnCredential } from "@simplewebauthn/server";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse
} from "@simplewebauthn/server";
import { z } from "zod";
import { approveDevicePairingSchema, cachePurgeRequestSchema, createApiTokenSchema, createDevicePairingSchema, deviceCachePolicySchema, exchangeDevicePairingSchema, refreshNativeTokenSchema, requestDeviceCachePurgeSchema, setDeviceCachePolicySchema } from "@sorta/contracts";
import { config } from "./config.js";
import { query, transaction } from "./db.js";
import { bearerSecret, createAccessSecret, createUserCode, hashAccessSecret, normalizeUserCode, refreshTokenDecision, requiredDeviceScope, validDeviceScopes } from "./device-auth.js";

const appOrigin = new URL(config.APP_ORIGIN);
const rpID = appOrigin.hostname;
const secureCookie = appOrigin.protocol === "https:";
const cookieName = secureCookie ? "__Host-sorta_session" : "sorta_session";
const challengeLifetimeMs = 5 * 60_000;
const sessionLifetimeSeconds = 30 * 24 * 60 * 60;

const bootstrapOptionsSchema = z.object({
  bootstrap_secret: z.string().min(1),
  owner_label: z.string().trim().min(1).max(120)
});
const bootstrapVerifySchema = z.object({
  challenge_id: z.string().uuid(),
  credential: z.custom<RegistrationResponseJSON>((value) => typeof value === "object" && value !== null)
});
const loginVerifySchema = z.object({
  challenge_id: z.string().uuid(),
  credential: z.custom<AuthenticationResponseJSON>((value) => typeof value === "object" && value !== null)
});

type SessionRow = {
  id: string;
  owner_id: string;
  expires_at: Date;
  auth_level: "passkey" | "recovery";
  created_at: Date;
};

const recoverySchema = z.object({ recovery_code: z.string().trim().min(3).max(200) });
const passkeyOptionsInputSchema = z.object({ label: z.string().trim().min(1).max(120) });
const recoveryAttempts = new Map<string, { count: number; resetAt: number }>();
const recentStrongAuthenticationMs = 10 * 60_000;
const accessTokenLifetimeMs = 15 * 60_000;
const refreshTokenLifetimeMs = 30 * 24 * 60 * 60_000;
const pairingLifetimeMs = 10 * 60_000;
const pairingAttempts = new Map<string, { count: number; resetAt: number }>();

type BearerPrincipal = {
  kind: "device" | "api_token";
  id: string;
  owner_id: string;
  vault_ids: string[];
  scopes: string[];
};

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function secretMatches(actual: string): boolean {
  if (!config.BOOTSTRAP_SECRET) return false;
  return timingSafeEqual(digest(actual), digest(config.BOOTSTRAP_SECRET));
}

function sessionResponse(row: SessionRow) {
  return { id: row.id, owner_id: row.owner_id, expires_at: row.expires_at.toISOString(), auth_level: row.auth_level };
}

function makeRecoveryCodes() {
  return Array.from({ length: 10 }, () => `${randomBytes(5).toString("hex").slice(0, 5)}-${randomBytes(5).toString("hex").slice(0, 5)}`);
}

function recoveryRateLimited(key: string) {
  const now = Date.now();
  const current = recoveryAttempts.get(key);
  if (!current || current.resetAt <= now) {
    recoveryAttempts.set(key, { count: 1, resetAt: now + 15 * 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

function pairingRateLimited(key: string) {
  const now = Date.now();
  const current = pairingAttempts.get(key);
  if (!current || current.resetAt <= now) {
    pairingAttempts.set(key, { count: 1, resetAt: now + 15 * 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 10;
}

async function getBearerPrincipal(request: FastifyRequest): Promise<BearerPrincipal | null> {
  const secret = bearerSecret(request.headers.authorization);
  if (!secret) return null;
  const tokenHash = hashAccessSecret(secret);
  if (secret.startsWith("sda_")) {
    const result = await query<BearerPrincipal & { token_hash: Buffer }>(
      `SELECT 'device' AS kind,d.id,d.owner_id,d.vault_ids,d.scopes,t.token_hash
       FROM device_access_tokens t JOIN devices d ON d.id=t.device_id
       WHERE t.token_hash=$1 AND t.revoked_at IS NULL AND t.expires_at>now() AND d.revoked_at IS NULL`,
      [tokenHash]
    );
    const principal = result.rows[0];
    if (!principal || principal.token_hash.length !== tokenHash.length || !timingSafeEqual(principal.token_hash, tokenHash)) return null;
    await query("UPDATE devices SET last_seen_at=now() WHERE id=$1", [principal.id]);
    return principal;
  }
  const result = await query<BearerPrincipal & { token_hash: Buffer }>(
    `UPDATE api_tokens SET last_used_at=now()
     WHERE token_hash=$1 AND revoked_at IS NULL AND expires_at>now()
     RETURNING 'api_token' AS kind,id,owner_id,vault_ids,scopes,token_hash`,
    [tokenHash]
  );
  const principal = result.rows[0];
  if (!principal || principal.token_hash.length !== tokenHash.length || !timingSafeEqual(principal.token_hash, tokenHash)) return null;
  return principal;
}

export function hasRecentStrongAuthentication(session: SessionRow) {
  return session.auth_level === "passkey" && Date.now() - session.created_at.getTime() <= recentStrongAuthenticationMs;
}

function passkeySummary(row: Record<string, any>) {
  return {
    id: row.id,
    label: row.label,
    device_type: row.device_type,
    backed_up: row.backed_up,
    created_at: row.created_at.toISOString(),
    last_used_at: row.last_used_at ? row.last_used_at.toISOString() : null
  };
}

function setSessionCookie(reply: FastifyReply, token: string) {
  reply.setCookie(cookieName, token, {
    path: "/",
    httpOnly: true,
    secure: secureCookie,
    sameSite: "strict",
    maxAge: sessionLifetimeSeconds
  });
}

async function createSession(ownerId: string, authLevel: "passkey" | "recovery") {
  const id = randomUUID();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionLifetimeSeconds * 1000);
  await query(
    "INSERT INTO sessions(id, owner_id, token_hash, auth_level, expires_at) VALUES ($1, $2, $3, $4, $5)",
    [id, ownerId, digest(token), authLevel, expiresAt]
  );
  return { token, row: { id, owner_id: ownerId, expires_at: expiresAt, auth_level: authLevel, created_at: new Date() } satisfies SessionRow };
}

export async function getOwnerSession(request: FastifyRequest): Promise<SessionRow | null> {
  const token = request.cookies[cookieName];
  if (!token) return null;
  const result = await query<SessionRow>(
    `UPDATE sessions SET last_seen_at = now()
     WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()
     RETURNING id, owner_id, expires_at, auth_level, created_at`,
    [digest(token)]
  );
  return result.rows[0] ?? null;
}

export async function getVaultListAccess(request: FastifyRequest): Promise<{ ownerId: string; vaultIds: string[] | null } | null> {
  const session = await getOwnerSession(request);
  if (session) return session.auth_level === "passkey" ? { ownerId: session.owner_id, vaultIds: null } : null;
  const principal = await getBearerPrincipal(request);
  if (!principal || !principal.scopes.includes("vault:read")) return null;
  return { ownerId: principal.owner_id, vaultIds: principal.vault_ids };
}

export async function requireVaultOwner(request: FastifyRequest, reply: FastifyReply) {
  const session = await getOwnerSession(request);
  const params = request.params as { vaultId?: string };
  if (!params.vaultId) return reply.code(400).send({ error: "vault_required" });
  if (session) {
    if (session.auth_level !== "passkey") return reply.code(403).send({ error: "recovery_session_restricted" });
    const vault = await query("SELECT 1 FROM vaults WHERE id = $1 AND owner_id = $2", [params.vaultId, session.owner_id]);
    if (!vault.rowCount) return reply.code(404).send({ error: "vault_not_found" });
    return;
  }
  const principal = await getBearerPrincipal(request);
  if (!principal) return reply.code(401).send({ error: "authentication_required" });
  if (!principal.vault_ids.includes(params.vaultId)) return reply.code(404).send({ error: "vault_not_found" });
  const required = requiredDeviceScope(request.method, request.url);
  if (!required || !principal.scopes.includes(required)) return reply.code(403).send({ error: "insufficient_scope", required_scope: required });
  const vault = await query("SELECT 1 FROM vaults WHERE id=$1 AND owner_id=$2", [params.vaultId, principal.owner_id]);
  if (!vault.rowCount) return reply.code(404).send({ error: "vault_not_found" });
}

export async function hasCurrentVaultReadAccess(request: FastifyRequest, vaultId: string) {
  const session = await getOwnerSession(request);
  if (session) {
    if (session.auth_level !== "passkey") return false;
    const vault = await query("SELECT 1 FROM vaults WHERE id=$1 AND owner_id=$2", [vaultId, session.owner_id]);
    return Boolean(vault.rowCount);
  }
  const principal = await getBearerPrincipal(request);
  if (!principal || !principal.vault_ids.includes(vaultId) || !principal.scopes.includes("sync:read")) return false;
  const vault = await query("SELECT 1 FROM vaults WHERE id=$1 AND owner_id=$2", [vaultId, principal.owner_id]);
  return Boolean(vault.rowCount);
}

export async function syncDeviceMatchesRequest(request: FastifyRequest, deviceId: string) {
  const session=await getOwnerSession(request);
  if(session)return session.auth_level==="passkey";
  const principal=await getBearerPrincipal(request);
  return principal?.kind==="device"&&principal.id===deviceId;
}

export async function requireOwner(request: FastifyRequest, reply: FastifyReply) {
  const session = await getOwnerSession(request);
  if (!session) return reply.code(401).send({ error: "authentication_required" });
  if (session.auth_level !== "passkey") return reply.code(403).send({ error: "recovery_session_restricted" });
}

const asIso=(value:Date|string)=>new Date(value).toISOString();
const ifMatchRevision=(value:string|string[]|undefined)=>{const raw=Array.isArray(value)?value[0]:value,match=raw?.match(/^(?:W\/)?"?(\d+)"?$/);return match?Number(match[1]):null;};
async function loadDeviceCachePolicy(ownerId:string,deviceId:string){const device=(await query<Record<string,any>>("SELECT id FROM devices WHERE id=$1 AND owner_id=$2 AND revoked_at IS NULL",[deviceId,ownerId])).rows[0];if(!device)return null;const [policyResult,purgeResult]=await Promise.all([query<Record<string,any>>("SELECT * FROM device_cache_policies WHERE device_id=$1",[deviceId]),query<Record<string,any>>("SELECT * FROM device_cache_purge_requests WHERE device_id=$1 ORDER BY requested_at DESC,id DESC LIMIT 1",[deviceId])]);const row=policyResult.rows[0],purge=purgeResult.rows[0];return deviceCachePolicySchema.parse({deviceId,mode:row?.trusted?"trusted_persistent":"session_only",trusted:row?.trusted??false,selectedVaultIds:row?.selected_vault_ids??[],cacheLimits:row?.cache_limits??{maxBytes:536_870_912,maxItems:10_000},expireAfterSeconds:row?.expire_after_seconds??null,clearOnLogout:row?.clear_on_logout??true,reportedState:row?.reported_state??{status:"unknown",cachedVaultIds:[],byteCount:null,itemCount:null,reportedAt:null},latestPurge:purge?{id:purge.id,status:purge.status,requestedAt:asIso(purge.requested_at),acknowledgedAt:purge.acknowledged_at?asIso(purge.acknowledged_at):null}:null,revision:row?.revision??0,createdAt:row?.created_at?asIso(row.created_at):null,updatedAt:row?.updated_at?asIso(row.updated_at):null});}

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post("/api/v1/auth/bootstrap/options", async (request, reply) => {
    const input = bootstrapOptionsSchema.parse(request.body);
    if (!config.BOOTSTRAP_SECRET) return reply.code(503).send({ error: "bootstrap_not_configured" });
    if (!secretMatches(input.bootstrap_secret)) return reply.code(403).send({ error: "invalid_bootstrap_secret" });
    const existing = await query("SELECT 1 FROM owners LIMIT 1");
    if (existing.rowCount) return reply.code(409).send({ error: "owner_already_initialized" });

    const challengeId = randomUUID();
    const ownerId = randomUUID();
    const options = await generateRegistrationOptions({
      rpName: "Sorta Omega",
      rpID,
      userName: "owner",
      userDisplayName: input.owner_label,
      userID: new TextEncoder().encode(ownerId),
      attestationType: "none",
      authenticatorSelection: { residentKey: "required", userVerification: "required" }
    });
    const expiresAt = new Date(Date.now() + challengeLifetimeMs);
    await query(
      "INSERT INTO auth_challenges(id, kind, challenge, pending_owner_id, owner_label, expires_at) VALUES ($1, 'bootstrap', $2, $3, $4, $5)",
      [challengeId, options.challenge, ownerId, input.owner_label, expiresAt]
    );
    return { challenge_id: challengeId, public_key_options: options, expires_at: expiresAt.toISOString() };
  });

  app.post("/api/v1/auth/bootstrap/verify", async (request, reply) => {
    const input = bootstrapVerifySchema.parse(request.body);
    const challenge = await query<{
      challenge: string; pending_owner_id: string; owner_label: string; expires_at: Date;
    }>(
      "SELECT challenge, pending_owner_id, owner_label, expires_at FROM auth_challenges WHERE id = $1 AND kind = 'bootstrap' AND consumed_at IS NULL",
      [input.challenge_id]
    );
    const pending = challenge.rows[0];
    if (!pending || pending.expires_at.getTime() <= Date.now()) return reply.code(410).send({ error: "challenge_expired" });
    const existing = await query("SELECT 1 FROM owners LIMIT 1");
    if (existing.rowCount) return reply.code(409).send({ error: "owner_already_initialized" });

    const verification = await verifyRegistrationResponse({
      response: input.credential,
      expectedChallenge: pending.challenge,
      expectedOrigin: config.APP_ORIGIN,
      expectedRPID: rpID,
      requireUserVerification: true
    });
    if (!verification.verified) return reply.code(400).send({ error: "passkey_verification_failed" });

    const info = verification.registrationInfo;
    const recoveryCodes = makeRecoveryCodes();
    const sessionId = randomUUID();
    const sessionToken = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + sessionLifetimeSeconds * 1000);

    await transaction(async (client) => {
      const consumed = await client.query(
        "UPDATE auth_challenges SET consumed_at = now() WHERE id = $1 AND consumed_at IS NULL RETURNING id",
        [input.challenge_id]
      );
      if (!consumed.rowCount) throw new Error("challenge_already_consumed");
      await client.query("INSERT INTO owners(id, label) VALUES ($1, $2)", [pending.pending_owner_id, pending.owner_label]);
      await client.query(
        "INSERT INTO passkeys(id, owner_id, public_key, counter, device_type, backed_up, transports) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)",
        [info.credential.id, pending.pending_owner_id, Buffer.from(info.credential.publicKey), info.credential.counter, info.credentialDeviceType, info.credentialBackedUp, JSON.stringify(input.credential.response.transports ?? [])]
      );
      await client.query("UPDATE vaults SET owner_id = $1 WHERE owner_id IS NULL", [pending.pending_owner_id]);
      for (const code of recoveryCodes) {
        await client.query("INSERT INTO recovery_codes(owner_id, code_hash) VALUES ($1, $2)", [pending.pending_owner_id, digest(code)]);
      }
      await client.query(
        "INSERT INTO sessions(id, owner_id, token_hash, auth_level, expires_at) VALUES ($1, $2, $3, 'passkey', $4)",
        [sessionId, pending.pending_owner_id, digest(sessionToken), expiresAt]
      );
    });
    setSessionCookie(reply, sessionToken);
    return reply.code(201).send({
      owner: { id: pending.pending_owner_id, label: pending.owner_label },
      recovery_codes_once: recoveryCodes,
      session: sessionResponse({ id: sessionId, owner_id: pending.pending_owner_id, expires_at: expiresAt, auth_level: "passkey", created_at: new Date() })
    });
  });

  app.post("/api/v1/auth/login/options", async (_request, reply) => {
    const passkeys = await query<{ id: string; transports: string[] }>("SELECT id, transports FROM passkeys ORDER BY created_at");
    if (!passkeys.rowCount) return reply.code(409).send({ error: "bootstrap_required" });
    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: passkeys.rows.map((item) => ({ id: item.id, transports: item.transports })),
      userVerification: "required"
    });
    const challengeId = randomUUID();
    const expiresAt = new Date(Date.now() + challengeLifetimeMs);
    await query(
      "INSERT INTO auth_challenges(id, kind, challenge, expires_at) VALUES ($1, 'login', $2, $3)",
      [challengeId, options.challenge, expiresAt]
    );
    return { challenge_id: challengeId, public_key_options: options, expires_at: expiresAt.toISOString() };
  });

  app.post("/api/v1/auth/login/verify", async (request, reply) => {
    const input = loginVerifySchema.parse(request.body);
    const challenge = await query<{ challenge: string; expires_at: Date }>(
      "SELECT challenge, expires_at FROM auth_challenges WHERE id = $1 AND kind = 'login' AND consumed_at IS NULL",
      [input.challenge_id]
    );
    const pending = challenge.rows[0];
    if (!pending || pending.expires_at.getTime() <= Date.now()) return reply.code(410).send({ error: "challenge_expired" });
    const passkey = await query<{
      id: string; owner_id: string; public_key: Buffer; counter: string; transports: string[];
    }>("SELECT id, owner_id, public_key, counter::text, transports FROM passkeys WHERE id = $1", [input.credential.id]);
    const stored = passkey.rows[0];
    if (!stored) return reply.code(401).send({ error: "unknown_passkey" });
    const credential: WebAuthnCredential = {
      id: stored.id,
      publicKey: new Uint8Array(stored.public_key),
      counter: Number(stored.counter),
      transports: stored.transports
    };
    const verification = await verifyAuthenticationResponse({
      response: input.credential,
      expectedChallenge: pending.challenge,
      expectedOrigin: config.APP_ORIGIN,
      expectedRPID: rpID,
      credential,
      requireUserVerification: true
    });
    if (!verification.verified) return reply.code(401).send({ error: "passkey_verification_failed" });
    await transaction(async (client) => {
      const consumed = await client.query("UPDATE auth_challenges SET consumed_at = now() WHERE id = $1 AND consumed_at IS NULL RETURNING id", [input.challenge_id]);
      if (!consumed.rowCount) throw new Error("challenge_already_consumed");
      await client.query("UPDATE passkeys SET counter = $2, last_used_at = now() WHERE id = $1", [stored.id, verification.authenticationInfo.newCounter]);
    });
    const session = await createSession(stored.owner_id, "passkey");
    setSessionCookie(reply, session.token);
    return sessionResponse(session.row);
  });

  app.get("/api/v1/auth/session", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    return sessionResponse(session);
  });

  app.post("/api/v1/auth/logout", async (request, reply) => {
    const token = request.cookies[cookieName];
    if (token) await query("UPDATE sessions SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL", [digest(token)]);
    reply.clearCookie(cookieName, { path: "/", secure: secureCookie, sameSite: "strict" });
    return reply.code(204).send();
  });

  app.post("/api/v1/auth/recovery", async (request, reply) => {
    if (recoveryRateLimited(request.ip)) return reply.code(429).send({ error: "recovery_rate_limited" });
    const input = recoverySchema.parse(request.body);
    const sessionId = randomUUID();
    const sessionToken = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 15 * 60_000);
    const ownerId = await transaction(async (client) => {
      const consumed = await client.query<{ owner_id: string }>(
        `UPDATE recovery_codes SET consumed_at = now()
         WHERE id = (SELECT id FROM recovery_codes WHERE code_hash = $1 AND consumed_at IS NULL FOR UPDATE SKIP LOCKED LIMIT 1)
         RETURNING owner_id`,
        [digest(input.recovery_code)]
      );
      if (!consumed.rows[0]) return null;
      await client.query(
        "INSERT INTO sessions(id, owner_id, token_hash, auth_level, expires_at) VALUES ($1, $2, $3, 'recovery', $4)",
        [sessionId, consumed.rows[0].owner_id, digest(sessionToken), expiresAt]
      );
      return consumed.rows[0].owner_id;
    });
    if (!ownerId) return reply.code(401).send({ error: "invalid_or_used_recovery_code" });
    recoveryAttempts.delete(request.ip);
    setSessionCookie(reply, sessionToken);
    return { id: sessionId, expires_at: expiresAt.toISOString(), allowed_actions: ["list_passkeys", "register_passkey"] };
  });

  app.get("/api/v1/auth/passkeys", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    const passkeys = await query("SELECT id, label, device_type, backed_up, created_at, last_used_at FROM passkeys WHERE owner_id = $1 ORDER BY created_at", [session.owner_id]);
    return { items: passkeys.rows.map(passkeySummary) };
  });

  app.post("/api/v1/auth/passkeys/options", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    if (session.auth_level !== "recovery" && !hasRecentStrongAuthentication(session)) return reply.code(403).send({ error: "recent_strong_authentication_required" });
    const input = passkeyOptionsInputSchema.parse(request.body);
    const [owner, existing] = await Promise.all([
      query<{ label: string }>("SELECT label FROM owners WHERE id = $1", [session.owner_id]),
      query<{ id: string; transports: string[] }>("SELECT id, transports FROM passkeys WHERE owner_id = $1", [session.owner_id])
    ]);
    const options = await generateRegistrationOptions({
      rpName: "Sorta Omega",
      rpID,
      userName: "owner",
      userDisplayName: owner.rows[0]?.label ?? "Owner",
      userID: new TextEncoder().encode(session.owner_id),
      attestationType: "none",
      excludeCredentials: existing.rows.map((item) => ({ id: item.id, transports: item.transports })),
      authenticatorSelection: { residentKey: "required", userVerification: "required" }
    });
    const challengeId = randomUUID();
    const expiresAt = new Date(Date.now() + challengeLifetimeMs);
    await query(
      "INSERT INTO auth_challenges(id, kind, challenge, pending_owner_id, passkey_label, expires_at) VALUES ($1, 'register_passkey', $2, $3, $4, $5)",
      [challengeId, options.challenge, session.owner_id, input.label, expiresAt]
    );
    return { challenge_id: challengeId, public_key_options: options, expires_at: expiresAt.toISOString() };
  });

  app.post("/api/v1/auth/passkeys/verify", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    if (session.auth_level !== "recovery" && !hasRecentStrongAuthentication(session)) return reply.code(403).send({ error: "recent_strong_authentication_required" });
    const input = bootstrapVerifySchema.parse(request.body);
    const challenge = await query<{ challenge: string; pending_owner_id: string; passkey_label: string; expires_at: Date }>(
      "SELECT challenge, pending_owner_id, passkey_label, expires_at FROM auth_challenges WHERE id = $1 AND kind = 'register_passkey' AND consumed_at IS NULL",
      [input.challenge_id]
    );
    const pending = challenge.rows[0];
    if (!pending || pending.pending_owner_id !== session.owner_id || pending.expires_at.getTime() <= Date.now()) return reply.code(410).send({ error: "challenge_expired" });
    const verification = await verifyRegistrationResponse({
      response: input.credential,
      expectedChallenge: pending.challenge,
      expectedOrigin: config.APP_ORIGIN,
      expectedRPID: rpID,
      requireUserVerification: true
    });
    if (!verification.verified) return reply.code(400).send({ error: "passkey_verification_failed" });
    const info = verification.registrationInfo;
    const inserted = await transaction(async (client) => {
      const consumed = await client.query("UPDATE auth_challenges SET consumed_at = now() WHERE id = $1 AND consumed_at IS NULL RETURNING id", [input.challenge_id]);
      if (!consumed.rowCount) throw new Error("challenge_already_consumed");
      const result = await client.query(
        `INSERT INTO passkeys(id, owner_id, public_key, counter, device_type, backed_up, transports, label)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
         RETURNING id, label, device_type, backed_up, created_at, last_used_at`,
        [info.credential.id, session.owner_id, Buffer.from(info.credential.publicKey), info.credential.counter, info.credentialDeviceType, info.credentialBackedUp, JSON.stringify(input.credential.response.transports ?? []), pending.passkey_label]
      );
      return result.rows[0];
    });
    if (session.auth_level === "recovery") {
      await query("UPDATE sessions SET revoked_at = now() WHERE id = $1", [session.id]);
      const replacement = await createSession(session.owner_id, "passkey");
      setSessionCookie(reply, replacement.token);
    }
    return reply.code(201).send(passkeySummary(inserted));
  });

  app.delete("/api/v1/auth/passkeys/:passkeyId", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    if (!hasRecentStrongAuthentication(session)) return reply.code(403).send({ error: "recent_strong_authentication_required" });
    const { passkeyId } = request.params as { passkeyId: string };
    const outcome = await transaction(async (client) => {
      const passkeys = await client.query<{ count: string }>("SELECT count(*)::text AS count FROM passkeys WHERE owner_id = $1", [session.owner_id]);
      const recovery = await client.query<{ count: string }>("SELECT count(*)::text AS count FROM recovery_codes WHERE owner_id = $1 AND consumed_at IS NULL", [session.owner_id]);
      if (Number(passkeys.rows[0]?.count ?? 0) <= 1 && Number(recovery.rows[0]?.count ?? 0) === 0) return "last_path" as const;
      const deleted = await client.query("DELETE FROM passkeys WHERE id = $1 AND owner_id = $2 RETURNING id", [passkeyId, session.owner_id]);
      return deleted.rowCount ? "deleted" as const : "missing" as const;
    });
    if (outcome === "last_path") return reply.code(409).send({ error: "last_sign_in_path" });
    if (outcome === "missing") return reply.code(404).send({ error: "passkey_not_found" });
    return reply.code(204).send();
  });

  app.post("/api/v1/auth/recovery-codes/rotate", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    if (!hasRecentStrongAuthentication(session)) return reply.code(403).send({ error: "recent_strong_authentication_required" });
    const codes = makeRecoveryCodes();
    await transaction(async (client) => {
      await client.query("UPDATE recovery_codes SET consumed_at = now() WHERE owner_id = $1 AND consumed_at IS NULL", [session.owner_id]);
      for (const code of codes) await client.query("INSERT INTO recovery_codes(owner_id, code_hash) VALUES ($1, $2)", [session.owner_id, digest(code)]);
    });
    return { codes_once: codes };
  });

  app.get("/api/v1/auth/sessions", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    if (session.auth_level !== "passkey") return reply.code(403).send({ error: "recovery_session_restricted" });
    const sessions = await query(
      `SELECT id, auth_level, created_at, last_seen_at, expires_at FROM sessions
       WHERE owner_id = $1 AND revoked_at IS NULL AND expires_at > now()
       ORDER BY last_seen_at DESC`,
      [session.owner_id]
    );
    return { items: sessions.rows.map((row) => ({
      id: row.id,
      auth_level: row.auth_level,
      created_at: row.created_at.toISOString(),
      last_seen_at: row.last_seen_at.toISOString(),
      expires_at: row.expires_at.toISOString(),
      current: row.id === session.id
    })) };
  });

  app.delete("/api/v1/auth/sessions/:sessionId", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    if (session.auth_level !== "passkey") return reply.code(403).send({ error: "recovery_session_restricted" });
    const { sessionId } = request.params as { sessionId: string };
    const revoked = await query("UPDATE sessions SET revoked_at = now() WHERE id = $1 AND owner_id = $2 AND revoked_at IS NULL RETURNING id", [sessionId, session.owner_id]);
    if (!revoked.rowCount) return reply.code(404).send({ error: "session_not_found" });
    if (sessionId === session.id) reply.clearCookie(cookieName, { path: "/", secure: secureCookie, sameSite: "strict" });
    return reply.code(204).send();
  });

  app.post("/api/v1/device-pairings", async (request, reply) => {
    if (pairingRateLimited(request.ip)) return reply.code(429).send({ error: "pairing_rate_limited" });
    const input = createDevicePairingSchema.parse(request.body);
    const pairingId = randomUUID();
    const deviceCode = createAccessSecret("sdp");
    const userCode = createUserCode();
    const expiresAt = new Date(Date.now() + pairingLifetimeMs);
    await query(
      `INSERT INTO device_pairings(id,device_name,requested_role,client_public_key,device_code_hash,user_code_hash,expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [pairingId, input.device_name, input.requested_role, input.client_public_key, hashAccessSecret(deviceCode), hashAccessSecret(normalizeUserCode(userCode)), expiresAt]
    );
    return reply.code(201).send({ pairing_id: pairingId, device_code_once: deviceCode, user_code: userCode, expires_at: expiresAt.toISOString() });
  });

  app.post("/api/v1/device-pairings/:pairingId/approve", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    if (!hasRecentStrongAuthentication(session)) return reply.code(403).send({ error: "recent_strong_authentication_required" });
    const { pairingId } = request.params as { pairingId: string };
    z.string().uuid().parse(pairingId);
    const input = approveDevicePairingSchema.parse(request.body);
    if (!validDeviceScopes(input.scopes)) return reply.code(400).send({ error: "invalid_or_duplicate_device_scope" });
    if (input.approved_role === "worker") return reply.code(409).send({ error: "worker_pairing_requires_worker_provisioning" });
    const userCodeHash = hashAccessSecret(normalizeUserCode(input.user_code));
    const result = await transaction(async (client) => {
      const pending = await client.query<Record<string, any>>("SELECT * FROM device_pairings WHERE id=$1 FOR UPDATE", [pairingId]);
      const row = pending.rows[0];
      if (!row) return { error: "pairing_not_found", status: 404 } as const;
      if (row.status !== "pending") return { error: "pairing_not_pending", status: 409 } as const;
      if (row.expires_at.getTime() <= Date.now()) {
        await client.query("UPDATE device_pairings SET status='expired' WHERE id=$1", [pairingId]);
        return { error: "pairing_expired", status: 410 } as const;
      }
      if (row.user_code_hash.length !== userCodeHash.length || !timingSafeEqual(row.user_code_hash, userCodeHash)) return { error: "pairing_code_invalid", status: 403 } as const;
      if (row.requested_role !== input.approved_role) return { error: "pairing_role_mismatch", status: 409 } as const;
      const vaultIds = [...new Set(input.vault_ids)];
      const vaults = await client.query("SELECT id FROM vaults WHERE owner_id=$1 AND id=ANY($2::uuid[])", [session.owner_id, vaultIds]);
      if (vaults.rowCount !== vaultIds.length) return { error: "pairing_vault_not_owned", status: 400 } as const;
      await client.query(
        `UPDATE device_pairings SET owner_id=$2,approved_role=$3,approved_vault_ids=$4::uuid[],approved_scopes=$5::text[],status='approved',approved_at=now()
         WHERE id=$1`,
        [pairingId, session.owner_id, input.approved_role, vaultIds, input.scopes]
      );
      return { expiresAt: row.expires_at as Date };
    });
    if ("error" in result) return reply.code(result.status as 400 | 401 | 403 | 404 | 409 | 410).send({ error: result.error });
    return { status: "approved", expires_at: result.expiresAt.toISOString() };
  });

  app.post("/api/v1/device-pairings/:pairingId/exchange", async (request, reply) => {
    const { pairingId } = request.params as { pairingId: string };
    z.string().uuid().parse(pairingId);
    const input = exchangeDevicePairingSchema.parse(request.body);
    const suppliedHash = hashAccessSecret(input.device_code);
    const accessToken = createAccessSecret("sda");
    const refreshToken = createAccessSecret("sdr");
    const accessExpiresAt = new Date(Date.now() + accessTokenLifetimeMs);
    const refreshExpiresAt = new Date(Date.now() + refreshTokenLifetimeMs);
    const outcome = await transaction(async (client) => {
      const pending = await client.query<Record<string, any>>("SELECT * FROM device_pairings WHERE id=$1 FOR UPDATE", [pairingId]);
      const row = pending.rows[0];
      if (!row || row.device_code_hash.length !== suppliedHash.length || !timingSafeEqual(row.device_code_hash, suppliedHash)) return { error: "pairing_secret_invalid", status: 401 } as const;
      if (row.expires_at.getTime() <= Date.now()) {
        await client.query("UPDATE device_pairings SET status='expired' WHERE id=$1 AND status<>'exchanged'", [pairingId]);
        return { error: "pairing_expired", status: 410 } as const;
      }
      if (row.status === "pending") return { pending: true } as const;
      if (row.status !== "approved" || !row.owner_id || !row.approved_role) return { error: "pairing_not_exchangeable", status: 409 } as const;
      const device = await client.query<{ id: string }>(
        `INSERT INTO devices(owner_id,name,role,vault_ids,scopes,public_key)
         VALUES ($1,$2,$3,$4::uuid[],$5::text[],$6) RETURNING id`,
        [row.owner_id, row.device_name, row.approved_role, row.approved_vault_ids, row.approved_scopes, row.client_public_key]
      );
      const deviceId = device.rows[0].id;
      const familyId = randomUUID();
      await client.query("INSERT INTO device_access_tokens(device_id,token_hash,expires_at) VALUES ($1,$2,$3)", [deviceId, hashAccessSecret(accessToken), accessExpiresAt]);
      await client.query("INSERT INTO device_refresh_tokens(device_id,family_id,token_hash,expires_at) VALUES ($1,$2,$3,$4)", [deviceId, familyId, hashAccessSecret(refreshToken), refreshExpiresAt]);
      await client.query("UPDATE device_pairings SET status='exchanged',exchanged_at=now() WHERE id=$1", [pairingId]);
      return { deviceId, vaultIds: row.approved_vault_ids as string[], scopes: row.approved_scopes as string[] };
    });
    if ("error" in outcome) return reply.code(outcome.status as 400 | 401 | 403 | 404 | 409 | 410).send({ error: outcome.error });
    if ("pending" in outcome) return reply.code(202).send({ status: "pending", retry_after_seconds: 5 });
    pairingAttempts.delete(request.ip);
    return {
      device_id: outcome.deviceId, access_token: accessToken, refresh_token: refreshToken,
      expires_at: accessExpiresAt.toISOString(), refresh_expires_at: refreshExpiresAt.toISOString(),
      vault_ids: outcome.vaultIds, scopes: outcome.scopes
    };
  });

  app.post("/api/v1/auth/token/refresh", async (request, reply) => {
    const input = refreshNativeTokenSchema.parse(request.body);
    const suppliedHash = hashAccessSecret(input.refresh_token);
    const accessToken = createAccessSecret("sda");
    const refreshToken = createAccessSecret("sdr");
    const accessExpiresAt = new Date(Date.now() + accessTokenLifetimeMs);
    const refreshExpiresAt = new Date(Date.now() + refreshTokenLifetimeMs);
    const result = await transaction(async (client) => {
      const found = await client.query<Record<string, any>>(
        `SELECT r.*,d.owner_id,d.vault_ids,d.scopes,d.revoked_at AS device_revoked_at
         FROM device_refresh_tokens r JOIN devices d ON d.id=r.device_id WHERE r.token_hash=$1 FOR UPDATE OF r,d`,
        [suppliedHash]
      );
      const row = found.rows[0];
      if (!row || row.token_hash.length !== suppliedHash.length || !timingSafeEqual(row.token_hash, suppliedHash)) return { error: "refresh_token_invalid", status: 401 } as const;
      const decision = refreshTokenDecision({ usedAt: row.used_at, revokedAt: row.revoked_at, deviceRevokedAt: row.device_revoked_at, expiresAt: row.expires_at });
      if (decision === "replay") {
        await client.query("UPDATE devices SET compromised_at=COALESCE(compromised_at,now()),revoked_at=COALESCE(revoked_at,now()) WHERE id=$1", [row.device_id]);
        await client.query("UPDATE device_refresh_tokens SET revoked_at=COALESCE(revoked_at,now()) WHERE family_id=$1", [row.family_id]);
        await client.query("UPDATE device_access_tokens SET revoked_at=COALESCE(revoked_at,now()) WHERE device_id=$1", [row.device_id]);
        return { error: "refresh_token_replay_detected_device_revoked", status: 401 } as const;
      }
      if (decision === "device_revoked") return { error: "device_revoked", status: 401 } as const;
      if (decision === "expired") {
        await client.query("UPDATE device_refresh_tokens SET revoked_at=now() WHERE id=$1", [row.id]);
        return { error: "refresh_token_expired", status: 401 } as const;
      }
      const nextRefreshId = randomUUID();
      await client.query("INSERT INTO device_access_tokens(device_id,token_hash,expires_at) VALUES ($1,$2,$3)", [row.device_id, hashAccessSecret(accessToken), accessExpiresAt]);
      await client.query("INSERT INTO device_refresh_tokens(id,device_id,family_id,token_hash,expires_at) VALUES ($1,$2,$3,$4,$5)", [nextRefreshId, row.device_id, row.family_id, hashAccessSecret(refreshToken), refreshExpiresAt]);
      await client.query("UPDATE device_refresh_tokens SET used_at=now(),rotated_to_id=$2 WHERE id=$1", [row.id, nextRefreshId]);
      await client.query("UPDATE devices SET last_seen_at=now() WHERE id=$1", [row.device_id]);
      return { deviceId: row.device_id as string, vaultIds: row.vault_ids as string[], scopes: row.scopes as string[] };
    });
    if ("error" in result) return reply.code(result.status as 400 | 401 | 403 | 404 | 409 | 410).send({ error: result.error });
    return {
      device_id: result.deviceId, access_token: accessToken, refresh_token: refreshToken,
      expires_at: accessExpiresAt.toISOString(), refresh_expires_at: refreshExpiresAt.toISOString(),
      vault_ids: result.vaultIds, scopes: result.scopes
    };
  });

  app.get("/api/v1/devices", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    if (session.auth_level !== "passkey") return reply.code(403).send({ error: "recovery_session_restricted" });
    const devices = await query<Record<string, any>>(
      `SELECT id,name,role,vault_ids,scopes,last_seen_at,compromised_at,created_at FROM devices
       WHERE owner_id=$1 AND revoked_at IS NULL ORDER BY created_at DESC`, [session.owner_id]
    );
    return { items: devices.rows.map(row => ({ id: row.id, name: row.name, role: row.role, vault_ids: row.vault_ids, scopes: row.scopes, last_seen_at: row.last_seen_at?.toISOString() ?? null, compromised_at: row.compromised_at?.toISOString() ?? null, created_at: row.created_at.toISOString() })) };
  });

  app.get("/api/v1/devices/:deviceId/cache-policy",async(request,reply)=>{const session=await getOwnerSession(request);if(!session)return reply.code(401).send({error:"authentication_required"});if(session.auth_level!=="passkey")return reply.code(403).send({error:"recovery_session_restricted"});const {deviceId}=request.params as {deviceId:string};z.string().uuid().parse(deviceId);const policy=await loadDeviceCachePolicy(session.owner_id,deviceId);if(!policy)return reply.code(404).send({error:"device_not_found"});return policy;});

  app.put("/api/v1/devices/:deviceId/cache-policy",async(request,reply)=>{const session=await getOwnerSession(request);if(!session)return reply.code(401).send({error:"authentication_required"});if(!hasRecentStrongAuthentication(session))return reply.code(403).send({error:"recent_strong_authentication_required"});const {deviceId}=request.params as {deviceId:string};z.string().uuid().parse(deviceId);const expectedRevision=ifMatchRevision(request.headers["if-match"]);if(expectedRevision===null)return reply.code(428).send({error:"if_match_required"});const input=setDeviceCachePolicySchema.parse(request.body);const outcome=await transaction(async client=>{const device=(await client.query<Record<string,any>>("SELECT * FROM devices WHERE id=$1 AND owner_id=$2 AND revoked_at IS NULL FOR UPDATE",[deviceId,session.owner_id])).rows[0];if(!device)return"device_not_found" as const;if(device.role!=="client")return"device_cache_policy_requires_client_device" as const;const current=(await client.query<Record<string,any>>("SELECT * FROM device_cache_policies WHERE device_id=$1 FOR UPDATE",[deviceId])).rows[0];if((current?.revision??0)!==expectedRevision)return"stale_device_cache_policy" as const;const selected=[...new Set(input.selectedVaultIds)];if(selected.some(vaultId=>!device.vault_ids.includes(vaultId)))return"cache_vault_not_granted_to_device" as const;if(selected.length){const eligible=await client.query("SELECT id FROM vaults WHERE owner_id=$1 AND id=ANY($2::uuid[]) AND storage_mode='host_synced'",[session.owner_id,selected]);if(eligible.rowCount!==selected.length)return"cache_vault_not_owned_or_host_synced" as const;}const values=[deviceId,input.trusted,selected,JSON.stringify(input.cacheLimits),input.expireAfterSeconds,input.clearOnLogout];const priorSelected=(current?.selected_vault_ids??[]) as string[],removed=priorSelected.filter(id=>!selected.includes(id));if(current)await client.query("UPDATE device_cache_policies SET trusted=$2,selected_vault_ids=$3::uuid[],cache_limits=$4::jsonb,expire_after_seconds=$5,clear_on_logout=$6,revision=revision+1,updated_at=now() WHERE device_id=$1",values);else await client.query("INSERT INTO device_cache_policies(device_id,trusted,selected_vault_ids,cache_limits,expire_after_seconds,clear_on_logout) VALUES ($1,$2,$3::uuid[],$4::jsonb,$5,$6)",values);if(removed.length)await client.query("INSERT INTO device_cache_purge_requests(device_id,selected_vault_ids,request_reason) VALUES ($1,$2::uuid[],'cache_policy_scope_removed')",[deviceId,removed]);return"updated" as const;});if(outcome!=="updated")return reply.code(outcome==="device_not_found"?404:409).send({error:outcome});return await loadDeviceCachePolicy(session.owner_id,deviceId);});

  app.post("/api/v1/devices/:deviceId/cache-purge",async(request,reply)=>{const session=await getOwnerSession(request);if(!session)return reply.code(401).send({error:"authentication_required"});if(!hasRecentStrongAuthentication(session))return reply.code(403).send({error:"recent_strong_authentication_required"});const {deviceId}=request.params as {deviceId:string};z.string().uuid().parse(deviceId);const input=requestDeviceCachePurgeSchema.parse(request.body);const created=await transaction(async client=>{const device=(await client.query<Record<string,any>>("SELECT id,vault_ids FROM devices WHERE id=$1 AND owner_id=$2 AND revoked_at IS NULL FOR UPDATE",[deviceId,session.owner_id])).rows[0];if(!device)return null;if(input.selectedVaultIds.some(vaultId=>!device.vault_ids.includes(vaultId)))return"cache_vault_not_granted_to_device" as const;const row=(await client.query<Record<string,any>>("INSERT INTO device_cache_purge_requests(device_id,selected_vault_ids,request_reason) VALUES ($1,$2::uuid[],$3) RETURNING *",[deviceId,input.selectedVaultIds,input.requestReason])).rows[0];await client.query("UPDATE device_cache_policies SET selected_vault_ids=ARRAY(SELECT unnest(selected_vault_ids) EXCEPT SELECT unnest($2::uuid[])),trusted=CASE WHEN cardinality(ARRAY(SELECT unnest(selected_vault_ids) EXCEPT SELECT unnest($2::uuid[])))=0 THEN false ELSE trusted END,revision=revision+1,updated_at=now() WHERE device_id=$1",[deviceId,input.selectedVaultIds]);return row;});if(!created)return reply.code(404).send({error:"device_not_found"});if(typeof created==="string")return reply.code(409).send({error:created});return reply.code(202).send(cachePurgeRequestSchema.parse({id:created.id,deviceId:created.device_id,selectedVaultIds:created.selected_vault_ids,requestReason:created.request_reason,status:created.status,requestedAt:asIso(created.requested_at),acknowledgedAt:null,offlineErasureCertified:false}));});

  app.delete("/api/v1/devices/:deviceId", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    if (!hasRecentStrongAuthentication(session)) return reply.code(403).send({ error: "recent_strong_authentication_required" });
    const { deviceId } = request.params as { deviceId: string };
    z.string().uuid().parse(deviceId);
    const revoked = await transaction(async client => {
      const device = await client.query("UPDATE devices SET revoked_at=now() WHERE id=$1 AND owner_id=$2 AND revoked_at IS NULL RETURNING id", [deviceId, session.owner_id]);
      if (!device.rowCount) return false;
      await client.query("UPDATE device_access_tokens SET revoked_at=COALESCE(revoked_at,now()) WHERE device_id=$1", [deviceId]);
      await client.query("UPDATE device_refresh_tokens SET revoked_at=COALESCE(revoked_at,now()) WHERE device_id=$1", [deviceId]);
      return true;
    });
    if (!revoked) return reply.code(404).send({ error: "device_not_found" });
    return reply.code(204).send();
  });

  app.get("/api/v1/tokens", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    if (session.auth_level !== "passkey") return reply.code(403).send({ error: "recovery_session_restricted" });
    const tokens = await query<Record<string, any>>(
      `SELECT id,label,vault_ids,scopes,expires_at,last_used_at,created_at FROM api_tokens
       WHERE owner_id=$1 AND revoked_at IS NULL AND expires_at>now() ORDER BY created_at DESC`, [session.owner_id]
    );
    return { items: tokens.rows.map(row => ({ id: row.id, label: row.label, vault_ids: row.vault_ids, scopes: row.scopes, expires_at: row.expires_at.toISOString(), last_used_at: row.last_used_at?.toISOString() ?? null, created_at: row.created_at.toISOString() })) };
  });

  app.post("/api/v1/tokens", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    if (!hasRecentStrongAuthentication(session)) return reply.code(403).send({ error: "recent_strong_authentication_required" });
    const input = createApiTokenSchema.parse(request.body);
    if (!validDeviceScopes(input.scopes)) return reply.code(400).send({ error: "invalid_or_duplicate_api_token_scope" });
    const expiration = new Date(input.expires_at);
    if (expiration.getTime() < Date.now() + 5 * 60_000 || expiration.getTime() > Date.now() + 366 * 24 * 60 * 60_000) return reply.code(400).send({ error: "api_token_expiration_out_of_range" });
    const vaultIds = [...new Set(input.vault_ids)];
    const vaults = await query("SELECT id FROM vaults WHERE owner_id=$1 AND id=ANY($2::uuid[])", [session.owner_id, vaultIds]);
    if (vaults.rowCount !== vaultIds.length) return reply.code(400).send({ error: "api_token_vault_not_owned" });
    const secret = createAccessSecret("sat");
    const created = await query<Record<string, any>>(
      `INSERT INTO api_tokens(owner_id,label,token_hash,vault_ids,scopes,expires_at)
       VALUES ($1,$2,$3,$4::uuid[],$5::text[],$6) RETURNING id,label,vault_ids,scopes,expires_at,last_used_at,created_at`,
      [session.owner_id, input.label, hashAccessSecret(secret), vaultIds, input.scopes, expiration]
    );
    const row = created.rows[0];
    return reply.code(201).send({ id: row.id, label: row.label, vault_ids: row.vault_ids, scopes: row.scopes, expires_at: row.expires_at.toISOString(), last_used_at: null, created_at: row.created_at.toISOString(), secret_once: secret });
  });

  app.delete("/api/v1/tokens/:tokenId", async (request, reply) => {
    const session = await getOwnerSession(request);
    if (!session) return reply.code(401).send({ error: "authentication_required" });
    if (session.auth_level !== "passkey") return reply.code(403).send({ error: "recovery_session_restricted" });
    const { tokenId } = request.params as { tokenId: string };
    z.string().uuid().parse(tokenId);
    const revoked = await query("UPDATE api_tokens SET revoked_at=now() WHERE id=$1 AND owner_id=$2 AND revoked_at IS NULL RETURNING id", [tokenId, session.owner_id]);
    if (!revoked.rowCount) return reply.code(404).send({ error: "api_token_not_found" });
    return reply.code(204).send();
  });
}
