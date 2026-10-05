import { describe, expect, it } from "vitest";
import { decodeNotesCursor, encodeNotesCursor } from "./notes-cursor.js";

describe("notes cursor", () => {
  it("preserves microsecond timestamp precision and id tie-breaker", () => {
    const cursor = { updatedAt: "2026-10-05T08:15:00.123456Z", id: "00000000-0000-4000-8000-000000000123" };
    expect(decodeNotesCursor(encodeNotesCursor(cursor))).toEqual(cursor);
  });

  it("rejects malformed cursors", () => {
    expect(() => decodeNotesCursor("not-a-cursor")).toThrow();
  });
});
