import { describe, expect, it } from "vitest";
import { inSchoolSnapshotSchema } from "./school-snapshot.js";

const subject = { kind: "subject", externalId: "subject:MAT", title: "Matematikk 2P", code: "MAT" } as const;
const course = { kind: "course", externalId: "course:42", title: "Matematikk 2P", subjectExternalId: subject.externalId, teachingGroupId: "42" } as const;
const lesson = { kind: "lesson", externalId: "lesson:123", title: "Matematikk 2P", courseExternalId: course.externalId, subjectExternalId: subject.externalId, startsAt: "2026-09-24T07:55:00.000Z", endsAt: "2026-09-24T08:40:00.000Z", timezone: "Europe/Oslo", room: "H370", teachers: null, lessonType: null, sourceEntityId: "123" } as const;
const attendance = { kind: "attendance", externalId: "absence:456", courseExternalId: course.externalId, lessonExternalId: lesson.externalId, date: "2026-09-24", rawStatus: "For sent", normalizedStatus: "late", excusalStatus: "unknown", duration: 10, units: "minutes" } as const;
const grade = { kind: "grade", externalId: "grade:789", courseExternalId: course.externalId, date: "2026-09-24", rawGrade: "5+", scale: "1-6", officialWeight: null } as const;
const snapshot = { version: "omega_school_json_v1", source_timestamp: "2026-09-23T20:00:00.000Z", source_origin: "https://mailand.inschool.visma.no", timezone: "Europe/Oslo", records: [subject, course, lesson] } as const;

describe("InSchool snapshot gate", () => {
  it("accepts a referenced, bounded timetable snapshot", () => {
    expect(inSchoolSnapshotSchema.safeParse(snapshot).success).toBe(true);
  });
  it("rejects foreign origins and embedded credentials", () => {
    expect(inSchoolSnapshotSchema.safeParse({ ...snapshot, source_origin: "https://example.org" }).success).toBe(false);
    expect(inSchoolSnapshotSchema.safeParse({ ...snapshot, source_origin: "https://user:pass@mailand.inschool.visma.no" }).success).toBe(false);
  });
  it("rejects duplicate identities and dangling course references", () => {
    expect(inSchoolSnapshotSchema.safeParse({ ...snapshot, records: [subject, subject, course, lesson] }).success).toBe(false);
    expect(inSchoolSnapshotSchema.safeParse({ ...snapshot, records: [subject, course, { ...lesson, courseExternalId: "course:missing" }] }).success).toBe(false);
  });
  it("rejects impossible lessons and unexpected fields", () => {
    expect(inSchoolSnapshotSchema.safeParse({ ...snapshot, records: [subject, course, { ...lesson, endsAt: lesson.startsAt }] }).success).toBe(false);
    expect(inSchoolSnapshotSchema.safeParse({ ...snapshot, records: [subject, course, { ...lesson, cookie: "secret" }] }).success).toBe(false);
  });
  it("accepts exact provider attendance and grade facts without inventing weight or excusal", () => {
    expect(inSchoolSnapshotSchema.safeParse({ ...snapshot, records: [subject, course, lesson, attendance, grade] }).success).toBe(true);
  });
  it("rejects unlinked, ambiguous or malformed sensitive records", () => {
    const records = [subject, course, lesson, attendance, grade];
    expect(inSchoolSnapshotSchema.safeParse({ ...snapshot, records: [...records, { ...attendance, lessonExternalId: "lesson:other" }] }).success).toBe(false);
    expect(inSchoolSnapshotSchema.safeParse({ ...snapshot, records: [subject, course, lesson, { ...attendance, duration: null }, grade] }).success).toBe(false);
    expect(inSchoolSnapshotSchema.safeParse({ ...snapshot, records: [subject, course, lesson, { ...attendance, cookie: "secret" }, grade] }).success).toBe(false);
    expect(inSchoolSnapshotSchema.safeParse({ ...snapshot, records: [subject, course, lesson, attendance, { ...grade, officialWeight: 80 }] }).success).toBe(false);
    expect(inSchoolSnapshotSchema.safeParse({ ...snapshot, records: [subject, course, lesson, attendance, { ...grade, date: "2026-02-30" }] }).success).toBe(false);
  });
});
