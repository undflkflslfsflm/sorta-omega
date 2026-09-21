import { describe, expect, it } from "vitest";
import { httpOperations } from "@sorta/contracts";
import { bearerSecret, normalizeUserCode, refreshTokenDecision, requiredDeviceScope, validDeviceScopes } from "./device-auth.js";

describe("device access policy", () => {
  it("accepts only prefixed high-entropy bearer access tokens", () => {
    const token = `sda_${"a".repeat(43)}`;
    expect(bearerSecret(`Bearer ${token}`)).toBe(token);
    expect(bearerSecret(`Bearer sdr_${"a".repeat(43)}`)).toBeNull();
    expect(bearerSecret("Basic secret")).toBeNull();
  });

  it("normalizes the owner-visible pairing code without weakening its hash binding", () => {
    expect(normalizeUserCode("ab2d-ef7h")).toBe("AB2DEF7H");
  });

  it("rejects unknown, duplicate and empty grants", () => {
    expect(validDeviceScopes(["vault:read", "capture:write"])).toBe(true);
    expect(validDeviceScopes(["vault:read", "vault:read"])).toBe(false);
    expect(validDeviceScopes(["*"])).toBe(false);
    expect(validDeviceScopes([])).toBe(false);
  });

  it("maps every mutation to a finite least-privilege scope and denies unknown families", () => {
    expect(requiredDeviceScope("GET", "/api/v1/vaults/id/notes")).toBe("vault:read");
    expect(requiredDeviceScope("GET", "/api/v1/vaults/id/sync/pull")).toBe("sync:read");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/captures")).toBe("capture:write");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/url-captures")).toBe("capture:write");
    expect(requiredDeviceScope("PATCH", "/api/v1/vaults/id/tasks/task")).toBe("tasks:write");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/execution-sessions/session/transition")).toBe("tasks:write");
    expect(requiredDeviceScope("PATCH", "/api/v1/vaults/id/momentum/preferences")).toBe("study:write");
    expect(requiredDeviceScope("PATCH", "/api/v1/vaults/id")).toBe("profile:write");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/sync/snapshots")).toBe("sync:read");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/sync/push")).toBe("sync:write");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/events")).toBe("calendar:write");
    expect(requiredDeviceScope("PUT", "/api/v1/vaults/id/calendar-policies")).toBe("calendar:write");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/calendar-export")).toBe("calendar:write");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/calendar-import-preview")).toBe("calendar:write");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/ideas/idea/promotion-preview")).toBe("notes:write");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/ideas/idea/project-proposal")).toBe("profile:write");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/generations")).toBe("ai:run");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/performance/recommendations")).toBe("ai:run");
    expect(requiredDeviceScope("POST", "/api/v1/vaults/id/exports")).toBe("export:read");
    expect(requiredDeviceScope("GET", "/api/v1/vaults/id/exports/id/download")).toBe("export:read");
    expect(requiredDeviceScope("DELETE", "/api/v1/vaults/id/unclassified/new-route")).toBeNull();
  });

  it("classifies every implemented vault route so additions cannot inherit accidental bearer access", () => {
    const missing = httpOperations
      .filter(operation => operation.path.startsWith("/api/v1/vaults/"))
      .filter(operation => requiredDeviceScope(operation.method.toUpperCase(), operation.path) === null)
      .map(operation => `${operation.method} ${operation.path}`);
    expect(missing).toEqual([]);
  });

  it("treats reuse of a rotated refresh token as replay before any new token is issued", () => {
    const future = new Date("2027-01-01T00:00:00.000Z");
    const now = new Date("2026-09-20T00:00:00.000Z");
    expect(refreshTokenDecision({ usedAt: now, revokedAt: null, deviceRevokedAt: null, expiresAt: future }, now)).toBe("replay");
    expect(refreshTokenDecision({ usedAt: null, revokedAt: null, deviceRevokedAt: null, expiresAt: future }, now)).toBe("rotate");
    expect(refreshTokenDecision({ usedAt: null, revokedAt: null, deviceRevokedAt: null, expiresAt: now }, now)).toBe("expired");
  });
});
