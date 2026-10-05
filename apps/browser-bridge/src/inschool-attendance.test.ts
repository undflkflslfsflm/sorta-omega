import { describe, expect, it } from "vitest";
import { attendanceDataRowCount } from "./inschool-attendance.js";

describe("InSchool attendance coverage", () => {
  it("subtracts the table's two header rows from its ARIA row count", () => {
    expect(attendanceDataRowCount(15, 2)).toBe(13);
  });

  it("rejects missing or impossible row counts", () => {
    expect(attendanceDataRowCount(0, 2)).toBeNull();
    expect(attendanceDataRowCount(Number.NaN, 2)).toBeNull();
    expect(attendanceDataRowCount(15, 0)).toBeNull();
  });
});
