import { describe, expect, it } from "vitest";
import { isoWeekForDate } from "./calendar-week";

describe("Norwegian calendar week badge", () => {
  it("uses ISO weeks for the current school week", () => {
    expect(isoWeekForDate(new Date("2026-09-24T10:00:00Z"))).toBe(39);
  });
  it("handles ISO week-year boundaries", () => {
    expect(isoWeekForDate(new Date("2021-01-01T12:00:00Z"))).toBe(53);
    expect(isoWeekForDate(new Date("2024-12-30T12:00:00Z"))).toBe(1);
  });
  it("uses the Norwegian local date close to midnight", () => {
    expect(isoWeekForDate(new Date("2026-09-27T22:30:00Z"))).toBe(40);
  });
});
