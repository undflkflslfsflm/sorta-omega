import { describe, expect, it } from "vitest";
import { attendanceDataRowCount, normalizedInSchoolAbsence } from "./inschool-attendance.js";

describe("InSchool attendance coverage", () => {
  it("subtracts the table's two header rows from its ARIA row count", () => {
    expect(attendanceDataRowCount(15, 2)).toBe(13);
  });

  it("rejects missing or impossible row counts", () => {
    expect(attendanceDataRowCount(0, 2)).toBeNull();
    expect(attendanceDataRowCount(Number.NaN, 2)).toBeNull();
    expect(attendanceDataRowCount(15, 0)).toBeNull();
  });

  it("does not mistake rights-based absence for lateness", () => {
    expect(normalizedInSchoolAbsence("R - Rettighetsfravær")).toBe("absent");
    expect(normalizedInSchoolAbsence("X - Udokumentert fravær")).toBe("absent");
    expect(normalizedInSchoolAbsence("Forsinket ankomst")).toBe("late");
    expect(normalizedInSchoolAbsence("! - Opplæring i andre fag")).toBe("unknown");
  });
});
