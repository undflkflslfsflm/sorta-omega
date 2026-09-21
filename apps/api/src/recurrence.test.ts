import { describe, expect, it } from "vitest";
import { expandOccurrences } from "./recurrence.js";

describe("calendar recurrence", () => {
  it("retains a non-recurring event that overlaps the beginning of a requested horizon", () => {
    const items = expandOccurrences({ eventId: "00000000-0000-4000-8000-000000000111", title: "Already running", startsAt: "2026-09-19T08:30:00.000Z", endsAt: "2026-09-19T10:30:00.000Z", recurrence: null, from: "2026-09-19T09:00:00.000Z", to: "2026-09-19T11:00:00.000Z" });
    expect(items).toHaveLength(1); expect(items[0].startsAt).toBe("2026-09-19T08:30:00.000Z");
  });
  it("keeps a weekly Europe/Oslo wall time across daylight saving", () => {
    const items = expandOccurrences({
      eventId: "event", title: "Class", startsAt: "2026-03-23T08:00:00.000Z", endsAt: "2026-03-23T09:00:00.000Z",
      recurrence: { frequency: "weekly", interval: 1, timezone: "Europe/Oslo", count: 3 },
      from: "2026-03-20T00:00:00.000Z", to: "2026-04-10T00:00:00.000Z"
    });
    expect(items.map((item) => item.startsAt)).toEqual(["2026-03-23T08:00:00.000Z", "2026-03-30T07:00:00.000Z", "2026-04-06T07:00:00.000Z"]);
  });

  it("applies a single cancellation without rewriting the series", () => {
    const items = expandOccurrences({
      eventId: "event", title: "Class", startsAt: "2026-03-23T08:00:00.000Z", endsAt: "2026-03-23T09:00:00.000Z",
      recurrence: { frequency: "weekly", interval: 1, timezone: "Europe/Oslo", count: 2 },
      exceptions: [{ id: "exception", originalStartsAt: "2026-03-30T07:00:00.000Z", cancelled: true }],
      from: "2026-03-20T00:00:00.000Z", to: "2026-04-10T00:00:00.000Z"
    });
    expect(items).toHaveLength(1);
  });

  it("rejects unbounded display ranges", () => {
    expect(() => expandOccurrences({ eventId: "event", title: "Class", startsAt: "2026-01-01T09:00:00.000Z", endsAt: "2026-01-01T10:00:00.000Z", recurrence: null, from: "2026-01-01T00:00:00.000Z", to: "2028-01-01T00:00:00.000Z" })).toThrow("occurrence_range_too_large");
  });
});
