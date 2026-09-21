import { describe, expect, it } from "vitest";
import { summarizeAttendance } from "./attendance-summary.js";

describe("attendance summary", () => {
  const rows = [
    { normalizedStatus: "present" as const, excusalStatus: "not_applicable" as const, duration: 60, units: "minutes" as const, sourceAnchorIds: ["a"] },
    { normalizedStatus: "absent" as const, excusalStatus: "excused" as const, duration: 45, units: "minutes" as const, sourceAnchorIds: ["b"] },
    { normalizedStatus: "unknown" as const, excusalStatus: "unknown" as const, duration: null, units: null, sourceAnchorIds: [] }
  ];
  it("exposes denominator, excusal and unknown coverage", () => {
    expect(summarizeAttendance(rows, "minutes")).toEqual({ counts: { present: 60, absent_excused: 45 }, denominator: 105, coverage: { recordCount: 3, knownCount: 2, unknownCount: 1 }, excludedUnknowns: 1, sourceAnchorIds: ["a", "b"] });
  });
  it("never treats missing records as present", () => { expect(summarizeAttendance([], "lessons").denominator).toBe(0); });
});
