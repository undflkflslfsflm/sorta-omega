import { describe, expect, it } from "vitest";
import { buildTar, serializeMinimalCalendar } from "./export-artifact.js";

describe("privacy-minimal calendar export", () => {
  it("emits stable UTC VEVENTs and escapes public titles", () => {
    const value = serializeMinimalCalendar({
      name: "My, calendar",
      generatedAt: "2026-09-20T12:00:00.000Z",
      occurrences: [{ id: "event:2026-09-21T08:00:00.000Z", eventId: "11111111-1111-4111-8111-111111111111", title: "Math; review\nRoom 4", startsAt: "2026-09-21T08:00:00.000Z", endsAt: "2026-09-21T09:00:00.000Z" }],
    });
    expect(value).toContain("DTSTART:20260921T080000Z");
    expect(value).toContain("SUMMARY:Math\\; review\\nRoom 4");
    expect(value).toContain("X-WR-CALNAME:My\\, calendar");
    expect(value).not.toMatch(/DESCRIPTION|ATTENDEE|VALARM|prep|commitment/i);
  });

  it("builds a deterministic tar envelope", () => {
    const first = buildTar([{ name: "manifest.json", content: Buffer.from("{}") }]);
    const second = buildTar([{ name: "manifest.json", content: Buffer.from("{}") }]);
    expect(first.equals(second)).toBe(true);
    expect(first.length % 512).toBe(0);
    expect(first.subarray(0, 13).toString()).toBe("manifest.json");
  });
});
