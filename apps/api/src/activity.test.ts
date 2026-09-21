import { describe, expect, it } from "vitest";
import { decodeActivityCursor, encodeActivityCursor } from "./activity.js";

describe("activity cursor", () => {
  it("round-trips the time and tie-breaking source id", () => {
    const value = { createdAt: "2026-09-18T12:30:00.000Z", id: "00000000-0000-4000-8000-000000000123" };
    expect(decodeActivityCursor(encodeActivityCursor(value))).toEqual(value);
  });

  it("rejects malformed and untyped cursors", () => {
    expect(() => decodeActivityCursor("not-a-cursor")).toThrow();
    expect(() => decodeActivityCursor(Buffer.from(JSON.stringify({ createdAt: "yesterday", id: "nope" })).toString("base64url"))).toThrow();
  });
});
