import { describe, expect, it } from "vitest";
import { calendarSourceStaleness, validateCalendarViewRange } from "./calendar-view.js";

describe("calendar view projection", () => {
  it("bounds each visual mode instead of accepting an unbounded recurrence expansion", () => {
    expect(() => validateCalendarViewRange({ from: "2026-09-01T00:00:00.000Z", to: "2026-12-01T00:00:00.000Z", timezone: "Europe/Oslo", view: "month" })).toThrow("calendar_view_range_too_large");
    expect(validateCalendarViewRange({ from: "2026-09-01T00:00:00.000Z", to: "2026-10-13T00:00:00.000Z", timezone: "Europe/Oslo", view: "month" }).view).toBe("month");
  });

  it("reports provider freshness without inventing successful synchronization", () => {
    const now = Date.parse("2026-09-19T12:00:00.000Z");
    expect(calendarSourceStaleness({ state: "authentication_required", lastSuccessAt: null }, now)).toBe("connection_authentication_required");
    expect(calendarSourceStaleness({ state: "connected", lastSuccessAt: "2026-09-17T12:00:00.000Z" }, now)).toBe("last_success_over_24_hours_ago");
    expect(calendarSourceStaleness({ state: "connected", lastSuccessAt: "2026-09-19T11:00:00.000Z" }, now)).toBeNull();
  });
});
