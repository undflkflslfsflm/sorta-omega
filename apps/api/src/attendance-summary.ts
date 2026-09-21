export type AttendanceAggregation = "lessons" | "minutes" | "source_defined";
type Row = { normalizedStatus: "present" | "absent" | "late" | "unknown"; excusalStatus: "excused" | "unexcused" | "unknown" | "not_applicable"; duration: number | null; units: AttendanceAggregation | null; sourceAnchorIds: string[] };

export function summarizeAttendance(rows: Row[], aggregation: AttendanceAggregation) {
  const counts: Record<string, number> = {};
  const sourceAnchorIds = new Set<string>(); let denominator = 0; let knownCount = 0;
  for (const row of rows) {
    row.sourceAnchorIds.forEach(id => sourceAnchorIds.add(id));
    const amount = aggregation === "lessons" ? 1 : row.units === aggregation ? row.duration : null;
    if (row.normalizedStatus === "unknown" || amount === null) continue;
    knownCount += 1; denominator += amount;
    const key = row.normalizedStatus === "absent" ? `absent_${row.excusalStatus}` : row.normalizedStatus;
    counts[key] = (counts[key] ?? 0) + amount;
  }
  return { counts, denominator, coverage: { recordCount: rows.length, knownCount, unknownCount: rows.length - knownCount }, excludedUnknowns: rows.length - knownCount, sourceAnchorIds: [...sourceAnchorIds] };
}
