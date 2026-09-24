import { createHash } from "node:crypto";
import type { PoolClient } from "pg";
import type { InSchoolSnapshot } from "./school-snapshot.js";

type Kind = "subject" | "course" | "lesson" | "attendance" | "grade";
type Action = "created" | "updated" | "linked" | "unchanged" | "stale";
export type SchoolSnapshotApplyCounts = Record<Kind, Record<Action, number>>;

function emptyCounts(): SchoolSnapshotApplyCounts {
  const actions = () => ({ created: 0, updated: 0, linked: 0, unchanged: 0, stale: 0 });
  return { subject: actions(), course: actions(), lesson: actions(), attendance: actions(), grade: actions() };
}

function hashRecord(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export async function applyInSchoolSnapshot(client: PoolClient, vaultId: string, snapshot: InSchoolSnapshot): Promise<SchoolSnapshotApplyCounts> {
  await client.query("SELECT pg_advisory_xact_lock(hashtext($1),hashtext($2))", [vaultId, snapshot.source_origin]);
  const counts = emptyCounts();
  const subjectIds = new Map<string, string>(), courseIds = new Map<string, string>(), lessonIds = new Map<string, string>();
  const timestamp = Date.parse(snapshot.source_timestamp);

  async function existing(kind: Kind, externalId: string) {
    const result = await client.query("SELECT * FROM school_snapshot_links WHERE vault_id=$1 AND source_origin=$2 AND record_kind=$3 AND external_id=$4", [vaultId, snapshot.source_origin, kind, externalId]);
    return result.rows[0] ?? null;
  }
  async function saveLink(kind: Kind, externalId: string, id: string, record: unknown, contentHash: string) {
    await client.query(`INSERT INTO school_snapshot_links(vault_id,source_origin,record_kind,external_id,subject_id,course_id,lesson_id,attendance_id,grade_id,content_hash,source_record,source_timestamp)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12)
      ON CONFLICT(vault_id,source_origin,record_kind,external_id) DO UPDATE SET
      content_hash=excluded.content_hash,source_record=excluded.source_record,source_timestamp=excluded.source_timestamp,last_seen_at=now()`,
    [vaultId, snapshot.source_origin, kind, externalId, kind === "subject" ? id : null, kind === "course" ? id : null, kind === "lesson" ? id : null, kind === "attendance" ? id : null, kind === "grade" ? id : null, contentHash, JSON.stringify(record), snapshot.source_timestamp]);
  }
  async function linkedRow(table: "school_subjects" | "school_courses" | "school_lessons" | "attendance_records" | "performance_grades", id: string) {
    const result = await client.query(`SELECT * FROM ${table} WHERE vault_id=$1 AND id=$2 AND archived_at IS NULL FOR UPDATE`, [vaultId, id]);
    if (!result.rows[0]) throw new Error("school_snapshot_linked_record_unavailable");
    return result.rows[0];
  }

  for (const record of snapshot.records.filter(item => item.kind === "subject")) {
    const hash = hashRecord(record), link = await existing("subject", record.externalId);
    if (link && new Date(link.source_timestamp).getTime() > timestamp) { subjectIds.set(record.externalId, link.subject_id); counts.subject.stale++; continue; }
    let id: string;
    if (link) {
      const row = await linkedRow("school_subjects", link.subject_id);
      id = row.id;
      if (link.content_hash === hash) counts.subject.unchanged++;
      else if (row.origin === "provider") {
        await client.query("UPDATE school_subjects SET name=$3,code=$4,revision=revision+1,updated_at=now() WHERE vault_id=$1 AND id=$2", [vaultId, id, record.title, record.code]);
        counts.subject.updated++;
      } else counts.subject.linked++;
    } else {
      const match = await client.query("SELECT id FROM school_subjects WHERE vault_id=$1 AND lower(name)=lower($2) AND archived_at IS NULL", [vaultId, record.title]);
      if (match.rows[0]) { id = match.rows[0].id; counts.subject.linked++; }
      else {
        const created = await client.query("INSERT INTO school_subjects(vault_id,name,code,origin) VALUES ($1,$2,$3,'provider') RETURNING id", [vaultId, record.title, record.code]);
        id = created.rows[0].id; counts.subject.created++;
      }
    }
    await saveLink("subject", record.externalId, id, record, hash);
    subjectIds.set(record.externalId, id);
  }

  for (const record of snapshot.records.filter(item => item.kind === "course")) {
    const subjectId = subjectIds.get(record.subjectExternalId);
    if (!subjectId) throw new Error("school_snapshot_course_subject_unavailable");
    const hash = hashRecord(record), link = await existing("course", record.externalId);
    if (link && new Date(link.source_timestamp).getTime() > timestamp) { courseIds.set(record.externalId, link.course_id); counts.course.stale++; continue; }
    let id: string;
    if (link) {
      const row = await linkedRow("school_courses", link.course_id);
      id = row.id;
      if (link.content_hash === hash) counts.course.unchanged++;
      else if (row.origin === "provider") {
        await client.query("UPDATE school_courses SET subject_id=$3,name=$4,revision=revision+1,updated_at=now() WHERE vault_id=$1 AND id=$2", [vaultId, id, subjectId, record.title]);
        counts.course.updated++;
      } else counts.course.linked++;
    } else {
      const match = await client.query("SELECT id FROM school_courses WHERE vault_id=$1 AND subject_id=$2 AND lower(name)=lower($3) AND academic_period IS NULL AND archived_at IS NULL", [vaultId, subjectId, record.title]);
      if (match.rows[0]) { id = match.rows[0].id; counts.course.linked++; }
      else {
        const created = await client.query("INSERT INTO school_courses(vault_id,subject_id,name,origin) VALUES ($1,$2,$3,'provider') RETURNING id", [vaultId, subjectId, record.title]);
        id = created.rows[0].id; counts.course.created++;
      }
    }
    await saveLink("course", record.externalId, id, record, hash);
    courseIds.set(record.externalId, id);
  }

  for (const record of snapshot.records.filter(item => item.kind === "lesson")) {
    const courseId = courseIds.get(record.courseExternalId);
    if (!courseId) throw new Error("school_snapshot_lesson_course_unavailable");
    const hash = hashRecord(record), link = await existing("lesson", record.externalId);
    if (link && new Date(link.source_timestamp).getTime() > timestamp) { lessonIds.set(record.externalId, link.lesson_id); counts.lesson.stale++; continue; }
    const timeSpec = JSON.stringify({ kind: "exact", startsAt: record.startsAt, endsAt: record.endsAt, timezone: record.timezone });
    let id: string;
    if (link) {
      const row = await linkedRow("school_lessons", link.lesson_id);
      id = row.id;
      if (link.content_hash === hash) counts.lesson.unchanged++;
      else if (row.origin === "provider") {
        await client.query("UPDATE school_lessons SET course_id=$3,time_spec=$4::jsonb,room=$5,revision=revision+1,updated_at=now() WHERE vault_id=$1 AND id=$2", [vaultId, id, courseId, timeSpec, record.room]);
        counts.lesson.updated++;
      } else counts.lesson.linked++;
    } else {
      const match = await client.query("SELECT id FROM school_lessons WHERE vault_id=$1 AND course_id=$2 AND time_spec->>'startsAt'=$3 AND time_spec->>'endsAt'=$4 AND archived_at IS NULL", [vaultId, courseId, record.startsAt, record.endsAt]);
      if (match.rows[0]) { id = match.rows[0].id; counts.lesson.linked++; }
      else {
        const created = await client.query("INSERT INTO school_lessons(vault_id,course_id,time_spec,room,origin) VALUES ($1,$2,$3::jsonb,$4,'provider') RETURNING id", [vaultId, courseId, timeSpec, record.room]);
        id = created.rows[0].id; counts.lesson.created++;
      }
    }
    await saveLink("lesson", record.externalId, id, record, hash);
    lessonIds.set(record.externalId, id);
  }
  for (const record of snapshot.records.filter(item => item.kind === "attendance")) {
    const courseId = courseIds.get(record.courseExternalId);
    if (!courseId) throw new Error("school_snapshot_attendance_course_unavailable");
    const lessonId = record.lessonExternalId ? lessonIds.get(record.lessonExternalId) : null;
    if (record.lessonExternalId && !lessonId) throw new Error("school_snapshot_attendance_lesson_unavailable");
    const hash = hashRecord(record), link = await existing("attendance", record.externalId);
    if (link && new Date(link.source_timestamp).getTime() > timestamp) { counts.attendance.stale++; continue; }
    const timeSpec = JSON.stringify({ kind: "date_only", date: record.date, timezone: "Europe/Oslo" });
    let id: string;
    if (link) {
      const row = await linkedRow("attendance_records", link.attendance_id);
      id = row.id;
      if (link.content_hash === hash) counts.attendance.unchanged++;
      else if (row.origin === "provider") {
        await client.query("UPDATE attendance_records SET course_id=$3,lesson_id=$4,record_date=$5,time_spec=$6::jsonb,raw_status=$7,normalized_status=$8,excusal_status=$9,duration=$10,units=$11,revision=revision+1,updated_at=now() WHERE vault_id=$1 AND id=$2", [vaultId,id,courseId,lessonId,record.date,timeSpec,record.rawStatus,record.normalizedStatus,record.excusalStatus,record.duration,record.units]);
        counts.attendance.updated++;
      } else counts.attendance.linked++;
    } else {
      const created = await client.query("INSERT INTO attendance_records(vault_id,course_id,lesson_id,record_date,time_spec,raw_status,normalized_status,excusal_status,duration,units,origin) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9,$10,'provider') RETURNING id", [vaultId,courseId,lessonId,record.date,timeSpec,record.rawStatus,record.normalizedStatus,record.excusalStatus,record.duration,record.units]);
      id = created.rows[0].id; counts.attendance.created++;
    }
    await saveLink("attendance", record.externalId, id, record, hash);
  }
  for (const record of snapshot.records.filter(item => item.kind === "grade")) {
    const courseId = courseIds.get(record.courseExternalId);
    if (!courseId) throw new Error("school_snapshot_grade_course_unavailable");
    const hash = hashRecord(record), link = await existing("grade", record.externalId);
    if (link && new Date(link.source_timestamp).getTime() > timestamp) { counts.grade.stale++; continue; }
    let id: string;
    if (link) {
      const row = await linkedRow("performance_grades", link.grade_id);
      id = row.id;
      if (link.content_hash === hash) counts.grade.unchanged++;
      else if (row.origin === "provider") {
        await client.query("UPDATE performance_grades SET course_id=$3,grade_value=$4,grade_scale=$5,grade_date=$6,official_weight=$7,revision=revision+1,updated_at=now() WHERE vault_id=$1 AND id=$2", [vaultId,id,courseId,record.rawGrade,record.scale,record.date,record.officialWeight]);
        counts.grade.updated++;
      } else counts.grade.linked++;
    } else {
      const created = await client.query("INSERT INTO performance_grades(vault_id,course_id,grade_value,grade_scale,grade_date,official_weight,origin,record_kind) VALUES ($1,$2,$3,$4,$5,$6,'provider','official') RETURNING id", [vaultId,courseId,record.rawGrade,record.scale,record.date,record.officialWeight]);
      id = created.rows[0].id; counts.grade.created++;
    }
    await saveLink("grade", record.externalId, id, record, hash);
  }
  return counts;
}
