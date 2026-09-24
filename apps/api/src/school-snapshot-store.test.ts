import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import type { PoolClient } from "pg";
import { inSchoolSnapshotSchema } from "./school-snapshot.js";
import { applyInSchoolSnapshot } from "./school-snapshot-store.js";

const subject = { kind: "subject", externalId: "subject:MAT", title: "Matematikk 2P", code: "MAT" } as const;
const course = { kind: "course", externalId: "course:42", title: "Matematikk 2P", subjectExternalId: subject.externalId, teachingGroupId: "42" } as const;
const lesson = { kind: "lesson", externalId: "lesson:123", title: "Matematikk 2P", courseExternalId: course.externalId, subjectExternalId: subject.externalId, startsAt: "2026-09-24T07:55:00.000Z", endsAt: "2026-09-24T08:40:00.000Z", timezone: "Europe/Oslo", room: "H370", teachers: null, lessonType: null, sourceEntityId: "123" } as const;
const attendance = { kind: "attendance", externalId: "absence:456", courseExternalId: course.externalId, lessonExternalId: lesson.externalId, date: "2026-09-24", rawStatus: "For sent", normalizedStatus: "late", excusalStatus: "unknown", duration: 10, units: "minutes" } as const;
const grade = { kind: "grade", externalId: "grade:789", courseExternalId: course.externalId, date: "2026-09-24", rawGrade: "5+", scale: "1-6", officialWeight: null } as const;
const timestamp = "2026-09-24T12:00:00.000Z";
const snapshot = inSchoolSnapshotSchema.parse({ version: "omega_school_json_v1", source_timestamp: timestamp, source_origin: "https://mailand.inschool.visma.no", timezone: "Europe/Oslo", records: [subject, course, lesson, attendance, grade] });
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

describe("school snapshot sensitive record storage", () => {
  it("creates source-linked attendance and grades once, then leaves identical replay unchanged", async () => {
    const links = new Map<string, Record<string, unknown>>([
      ["subject:subject:MAT", { subject_id: "subject-id", content_hash: hash(subject), source_timestamp: timestamp }],
      ["course:course:42", { course_id: "course-id", content_hash: hash(course), source_timestamp: timestamp }],
      ["lesson:lesson:123", { lesson_id: "lesson-id", content_hash: hash(lesson), source_timestamp: timestamp }]
    ]);
    const rows = new Map<string, Record<string, unknown>>([
      ["subject-id", { id: "subject-id", origin: "provider" }],
      ["course-id", { id: "course-id", origin: "provider" }],
      ["lesson-id", { id: "lesson-id", origin: "provider" }]
    ]);
    const inserts: string[] = [];
    let nextId = 0;
    const client = { query: async (sql: string, values: unknown[] = []) => {
      if (sql.includes("pg_advisory_xact_lock")) return { rows: [] };
      if (sql.startsWith("SELECT * FROM school_snapshot_links")) return { rows: links.has(`${values[2]}:${values[3]}`) ? [links.get(`${values[2]}:${values[3]}`)] : [] };
      if (sql.startsWith("SELECT * FROM school_") || sql.startsWith("SELECT * FROM attendance_records") || sql.startsWith("SELECT * FROM performance_grades")) return { rows: rows.has(String(values[1])) ? [rows.get(String(values[1]))] : [] };
      if (sql.startsWith("INSERT INTO attendance_records") || sql.startsWith("INSERT INTO performance_grades")) {
        inserts.push(sql); const id = `new-${++nextId}`; rows.set(id, { id, origin: "provider" }); return { rows: [{ id }] };
      }
      if (sql.startsWith("INSERT INTO school_snapshot_links")) {
        const kind = String(values[2]), externalId = String(values[3]);
        links.set(`${kind}:${externalId}`, { content_hash: values[9], source_timestamp: values[11], [`${kind}_id`]: values[kind === "attendance" ? 7 : kind === "grade" ? 8 : kind === "lesson" ? 6 : kind === "course" ? 5 : 4] });
        return { rows: [] };
      }
      throw new Error(`Unexpected query: ${sql}`);
    } } as unknown as PoolClient;
    const first = await applyInSchoolSnapshot(client, "vault-id", snapshot);
    expect(first.attendance.created).toBe(1);
    expect(first.grade.created).toBe(1);
    expect(inserts).toHaveLength(2);
    const second = await applyInSchoolSnapshot(client, "vault-id", snapshot);
    expect(second.attendance.unchanged).toBe(1);
    expect(second.grade.unchanged).toBe(1);
    expect(inserts).toHaveLength(2);
  });
});
