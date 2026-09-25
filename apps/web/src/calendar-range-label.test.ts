import { describe, expect, it } from "vitest";
import { calendarRangeLabel } from "./calendar-range-label";

describe("Norwegian calendar range labels", () => {
  it("shows the last included day, not the midnight-exclusive next day", () => {
    expect(calendarRangeLabel("2026-09-20T22:00:00.000Z", "2026-09-27T22:00:00.000Z", "Europe/Oslo")).toBe("21.–27.09.2026");
  });
  it("handles a one-day view and a daylight-saving boundary", () => {
    expect(calendarRangeLabel("2026-09-23T22:00:00.000Z", "2026-09-24T22:00:00.000Z", "Europe/Oslo")).toBe("24.09.2026");
    expect(calendarRangeLabel("2026-10-24T22:00:00.000Z", "2026-10-25T23:00:00.000Z", "Europe/Oslo")).toBe("25.10.2026");
  });
});
