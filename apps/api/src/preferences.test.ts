import { describe, expect, it } from "vitest";
import { createVaultSchema, preferencesSchema, systemStatusSchema, updatePreferencesSchema, updateVaultSchema, vaultSchema } from "@sorta/contracts";

describe("owner preferences and system status contracts", () => {
  it("accepts only bounded declarative preference changes", () => {
    expect(updatePreferencesSchema.safeParse({
      expectedRevision: 1,
      patch: {
        locale: "nb-NO",
        timezone: "Europe/Oslo",
        notificationChannels: ["in_app", "windows_native"],
        defaultPersonalDataSync: "manual"
      }
    }).success).toBe(true);
    expect(updatePreferencesSchema.safeParse({ expectedRevision: 1, patch: {} }).success).toBe(false);
    expect(updatePreferencesSchema.safeParse({ expectedRevision: 1, patch: { timezone: "Not/A-Timezone" } }).success).toBe(false);
    expect(updatePreferencesSchema.safeParse({ expectedRevision: 1, patch: { executable: "powershell.exe" } }).success).toBe(false);
  });

  it("rejects duplicate channels and unknown sensitive school categories", () => {
    const base = {
      locale: "nb-NO", timezone: "Europe/Oslo", notificationChannels: ["in_app"],
      protectFocusTime: true, defaultFocusMinutes: 45, profileInferenceEnabled: false,
      expandedDataEgressEnabled: false, defaultPersonalDataSync: "off",
      sensitiveSchoolCategories: ["attendance", "performance"], revision: 1,
      updatedAt: "2026-09-20T12:00:00.000Z"
    };
    expect(preferencesSchema.safeParse(base).success).toBe(true);
    expect(preferencesSchema.safeParse({ ...base, notificationChannels: ["in_app", "in_app"] }).success).toBe(false);
    expect(preferencesSchema.safeParse({ ...base, sensitiveSchoolCategories: ["passwords"] }).success).toBe(false);
  });

  it("keeps unavailable backup state explicit instead of claiming success", () => {
    const status = systemStatusSchema.parse({
      storage: { database: "available", databaseBytes: 1024, vaultCount: 1 },
      sync: { activeDevices: 0, latestEventId: "0", retentionFloorEventId: "0" },
      workers: { enrolled: 0, online: 0, lastSeenAt: null },
      backup: { status: "not_configured", lastVerifiedAt: null, limitation: "No backup configured." },
      versions: { api: "1.0.0", schema: 47, clientMinimum: "0.1.0" },
      checkedAt: "2026-09-20T12:00:00.000Z"
    });
    expect(status.backup.status).toBe("not_configured");
  });

  it("separates vault metadata edits from remote-authorization policy", () => {
    expect(createVaultSchema.safeParse({ name: "School", locale: "nb-NO", timezone: "Europe/Oslo" }).success).toBe(true);
    expect(createVaultSchema.safeParse({ name: "School", locale: "nb-NO", timezone: "invalid" }).success).toBe(false);
    expect(updateVaultSchema.safeParse({ expectedRevision: 1, patch: { name: "Study" } }).success).toBe(true);
    expect(updateVaultSchema.safeParse({ expectedRevision: 1, patch: { remoteAuthorized: false } }).success).toBe(false);
    expect(vaultSchema.safeParse({ id: "00000000-0000-4000-8000-000000000123", name: "Study", locale: "nb-NO", timezone: "Europe/Oslo", storageMode: "host_synced", remoteAuthorized: true, revision: 1, createdAt: "2026-09-20T12:00:00.000Z", updatedAt: "2026-09-20T12:00:00.000Z" }).success).toBe(true);
  });
});
