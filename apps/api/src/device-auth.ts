import { createHash, randomBytes } from "node:crypto";

export const deviceScopes = [
  "vault:read",
  "export:read",
  "sync:read",
  "sync:write",
  "capture:write",
  "notes:write",
  "tasks:write",
  "calendar:write",
  "school:write",
  "study:write",
  "profile:write",
  "integrations:write",
  "ai:run",
  "jobs:write"
] as const;

export type DeviceScope = typeof deviceScopes[number];

export function hashAccessSecret(value: string) {
  return createHash("sha256").update(value).digest();
}

export function createAccessSecret(prefix: "sda" | "sdr" | "sat" | "sdp") {
  return `${prefix}_${randomBytes(32).toString("base64url")}`;
}

export function normalizeUserCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function createUserCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  const raw = Array.from(bytes, byte => alphabet[byte % alphabet.length]).join("");
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

export function bearerSecret(header: string | undefined) {
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice(7);
  return /^(?:sda|sat)_[A-Za-z0-9_-]{40,64}$/.test(token) ? token : null;
}

export function validDeviceScopes(scopes: readonly string[]): scopes is DeviceScope[] {
  return scopes.length > 0 && scopes.length === new Set(scopes).size && scopes.every(scope => (deviceScopes as readonly string[]).includes(scope));
}

export function requiredDeviceScope(method: string, url: string): DeviceScope | null {
  if (/\/exports(?:[/?]|$)/.test(url)) return "export:read";
  if (method === "GET" && (/\/sync\/(?:pull|snapshots|ws)(?:[/?]|$)/.test(url) || /\/events(?:[/?]|$)/.test(url))) return "sync:read";
  if (method === "GET") return "vault:read";
  if (/\/(?:search|calendar\/free-busy|calendar\/conflicts)(?:[/?]|$)/.test(url)) return "vault:read";
  if (/\/sync\/snapshots(?:[/?]|$)/.test(url)) return "sync:read";
  if (/\/sync\/push(?:[/?]|$)/.test(url)) return "sync:write";
  if (/\/(?:captures|url-captures|uploads)(?:[/?]|$)/.test(url)) return "capture:write";
  if (/\/transcripts\/[^/?]+\/analysis(?:[/?]|$)/.test(url)) return "ai:run";
  if (/\/generations(?:[/?]|$)/.test(url)) return "ai:run";
  if (/\/transcripts\/[^/?]+\/lesson-association(?:[/?]|$)/.test(url)) return "school:write";
  if (/\/transcripts(?:[/?]|$)/.test(url)) return "notes:write";
  if (/\/ideas\/[^/?]+\/promotion-preview(?:[/?]|$)/.test(url)) return "notes:write";
  if (/\/performance\/recommendations(?:[/?]|$)/.test(url)) return "ai:run";
  if (/\/(?:notes|imports|labels|collections|rules|routing-rules|relationships|resurfacing|ai-operations)(?:[/?]|$)/.test(url)) return "notes:write";
  if (/\/(?:tasks|reminders|notifications|execution-sessions)(?:[/?]|$)/.test(url)) return "tasks:write";
  if (/\/(?:calendar|calendar-export|calendar-import-preview|calendars|calendar-events|calendar-view|calendar-entities|calendar-policies|calendar-decisions|calendar-provider-actions|events|entities|commitments|prep-items|scheduler|proposals|provider-calendar-actions)(?:[/?]|$)/.test(url)) return "calendar:write";
  if (/\/people(?:[/?]|$)/.test(url)) return "calendar:write";
  if (/\/(?:school|subjects|courses|assignments|lessons|assessments|attendance|performance)(?:[/?]|$)/.test(url)) return "school:write";
  if (/\/(?:study|knowledge-gaps|flashcards?|momentum)(?:[/?]|$)/.test(url)) return "study:write";
  if (/\/(?:projects|ideas|goals|memories|personal-profile|personal-data|interests|insights)(?:[/?]|$)/.test(url)) return "profile:write";
  if (method === "PATCH" && /^\/api\/v1\/vaults\/[^/?]+\/?$/.test(url)) return "profile:write";
  if (method === "POST" && /^\/api\/v1\/vaults\/[^/?]+\/purge(?:[/?]|$)/.test(url)) return "profile:write";
  if (/\/(?:integrations|connections|source-objects)(?:[/?]|$)/.test(url)) return "integrations:write";
  if (/\/(?:chats|ai(?:\/[^/?]+)*|index\/rebuild|tool-runs|tool-policies|commands)(?:[/?]|$)/.test(url)) return "ai:run";
  if (/\/jobs(?:[/?]|$)/.test(url)) return "jobs:write";
  return null;
}

export function refreshTokenDecision(input: { usedAt: Date | null; revokedAt: Date | null; deviceRevokedAt: Date | null; expiresAt: Date }, now = new Date()) {
  if (input.usedAt || input.revokedAt) return "replay" as const;
  if (input.deviceRevokedAt) return "device_revoked" as const;
  if (input.expiresAt.getTime() <= now.getTime()) return "expired" as const;
  return "rotate" as const;
}
