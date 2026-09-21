import { describe, expect, it } from "vitest";
import { decodeSyncCursor, encodeSyncCursor, syncAckCursor, syncCursorDecision, syncOperationReplayDecision } from "./sync-feed.js";

describe("durable sync cursor", () => {
  const vaultId = "00000000-0000-4000-8000-000000000123";

  it("round-trips an opaque cursor and binds it to one vault", () => {
    const cursor = encodeSyncCursor({ vaultId, eventId: "42" });
    expect(decodeSyncCursor(cursor, vaultId).eventId).toBe("42");
    expect(() => decodeSyncCursor(cursor, "00000000-0000-4000-8000-000000000124")).toThrow("sync_cursor_vault_mismatch");
  });

  it("requires a snapshot for pruned history and rejects future cursors", () => {
    expect(syncCursorDecision({ suppliedEventId: "4", retentionFloorEventId: "5", latestEventId: "20" })).toBe("snapshot_required");
    expect(syncCursorDecision({ suppliedEventId: "21", retentionFloorEventId: "5", latestEventId: "20" })).toBe("cursor_ahead");
    expect(syncCursorDecision({ suppliedEventId: "5", retentionFloorEventId: "5", latestEventId: "20" })).toBe("pull");
  });

  it("replays only the identical payload for a device operation ID", () => {
    expect(syncOperationReplayDecision(null,"hash-a")).toBe("apply");
    expect(syncOperationReplayDecision("hash-a","hash-a")).toBe("replay");
    expect(syncOperationReplayDecision("hash-a","hash-b")).toBe("operation_id_reused");
  });

  it("does not advance past unseen remote events when acknowledging a push",()=>{
    const cursor=encodeSyncCursor({vaultId,eventId:"42"});
    expect(syncAckCursor(cursor)).toBe(cursor);
  });
});
