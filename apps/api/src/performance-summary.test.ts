import { describe, expect, it } from "vitest";
import { summarizeGrades } from "./performance-summary.js";

describe("performance summary", () => {
  it("does not average incomparable scales or unknown weights", () => {
    const groups = summarizeGrades([{ gradeValue: "5", gradeScale: "1-6", officialWeight: null }, { gradeValue: "A", gradeScale: "A-F", officialWeight: 1 }]);
    expect(groups).toHaveLength(2); expect(groups.every(group => group.weightedNumericMean === null)).toBe(true);
  });
  it("computes only an explicitly weighted numeric mean within one scale", () => {
    expect(summarizeGrades([{ gradeValue: "4", gradeScale: "1-6", officialWeight: .25 }, { gradeValue: "6", gradeScale: "1-6", officialWeight: .75 }])[0].weightedNumericMean).toBe(5.5);
  });
});
