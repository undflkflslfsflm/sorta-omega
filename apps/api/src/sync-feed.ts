import { z } from "zod";

const cursorPayloadSchema = z.object({ version: z.literal(1), vaultId: z.string().uuid(), eventId: z.string().regex(/^\d+$/) }).strict();

export type SyncCursorPayload = z.infer<typeof cursorPayloadSchema>;

export function encodeSyncCursor(value: Omit<SyncCursorPayload, "version">) {
  return Buffer.from(JSON.stringify(cursorPayloadSchema.parse({ version: 1, ...value }))).toString("base64url");
}

export function decodeSyncCursor(value: string, expectedVaultId: string) {
  const parsed = cursorPayloadSchema.parse(JSON.parse(Buffer.from(value, "base64url").toString("utf8")));
  if (parsed.vaultId !== expectedVaultId) throw new Error("sync_cursor_vault_mismatch");
  return parsed;
}

export function syncCursorDecision(input: { suppliedEventId: string; retentionFloorEventId: string; latestEventId: string }) {
  if (BigInt(input.suppliedEventId) < BigInt(input.retentionFloorEventId)) return "snapshot_required" as const;
  if (BigInt(input.suppliedEventId) > BigInt(input.latestEventId)) return "cursor_ahead" as const;
  return "pull" as const;
}

export function syncOperationReplayDecision(existingPayloadHash: string | null, suppliedPayloadHash: string) {
  if (existingPayloadHash === null) return "apply" as const;
  return existingPayloadHash === suppliedPayloadHash ? "replay" as const : "operation_id_reused" as const;
}

export function syncAckCursor(suppliedCursor: string) {
  return suppliedCursor;
}
