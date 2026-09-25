import type { InSchoolSnapshot } from "./school-snapshot.js";

export function schoolImportPreview(snapshot: InSchoolSnapshot) {
  const counts: Record<string, number> = { subject: 0, course: 0, lesson: 0, assignment: 0, assessment: 0, material: 0, attendance: 0, grade: 0 };
  const sample: Array<{ kind: "subject" | "course" | "lesson" | "attendance" | "grade"; externalId: string; title: string }> = [];
  for (const record of snapshot.records) {
    counts[record.kind]++;
    if (sample.length < 20) sample.push({
      kind: record.kind,
      externalId: record.externalId,
      title: record.kind === "attendance" ? `${record.date} · ${record.rawStatus}` : record.kind === "grade" ? `${record.date} · ${record.rawGrade} (${record.scale})` : record.title
    });
  }
  return { counts, sample };
}

export function schoolSnapshotOutsidePeriod(snapshot: InSchoolSnapshot, period: { from: string; to: string }): boolean {
  const dateFor = (instant: string) => new Intl.DateTimeFormat("en-CA", { timeZone: snapshot.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(instant));
  return snapshot.records.some(record => {
    const date = record.kind === "lesson" ? dateFor(record.startsAt) : record.kind === "attendance" || record.kind === "grade" ? record.date : null;
    return date !== null && (date < period.from || date > period.to);
  });
}
