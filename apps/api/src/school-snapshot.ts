import { z } from "zod";

const identifier = z.string().trim().min(1).max(500);
const title = z.string().trim().min(1).max(500);
const optionalLabel = z.string().trim().max(240).nullable();

const subject = z.object({
  kind: z.literal("subject"), externalId: identifier, title,
  code: z.string().trim().max(80).nullable()
}).strict();
const course = z.object({
  kind: z.literal("course"), externalId: identifier, title,
  subjectExternalId: identifier, teachingGroupId: optionalLabel
}).strict();
const lesson = z.object({
  kind: z.literal("lesson"), externalId: identifier, title,
  courseExternalId: identifier, subjectExternalId: identifier,
  startsAt: z.string().datetime(), endsAt: z.string().datetime(),
  timezone: z.literal("Europe/Oslo"), room: optionalLabel,
  teachers: optionalLabel, lessonType: optionalLabel, sourceEntityId: optionalLabel
}).strict();
const attendance = z.object({
  kind: z.literal("attendance"), externalId: identifier,
  courseExternalId: identifier, lessonExternalId: identifier.nullable(),
  date: z.string().date(), rawStatus: z.string().trim().min(1).max(240),
  normalizedStatus: z.enum(["present", "absent", "late", "unknown"]),
  excusalStatus: z.enum(["excused", "unexcused", "unknown", "not_applicable"]),
  duration: z.number().nonnegative().nullable(),
  units: z.enum(["minutes", "lessons", "source_defined"]).nullable()
}).strict();
const grade = z.object({
  kind: z.literal("grade"), externalId: identifier, courseExternalId: identifier,
  date: z.string().date(), rawGrade: z.string().trim().min(1).max(80),
  scale: z.string().trim().min(1).max(80), officialWeight: z.number().min(0).max(1).nullable()
}).strict();

export const inSchoolSnapshotSchema = z.object({
  version: z.literal("omega_school_json_v1"),
  source_timestamp: z.string().datetime(),
  source_origin: z.string().url(),
  timezone: z.literal("Europe/Oslo"),
  records: z.array(z.discriminatedUnion("kind", [subject, course, lesson, attendance, grade])).min(1).max(1000)
}).strict().superRefine((snapshot, context) => {
  let origin: URL;
  try { origin = new URL(snapshot.source_origin); }
  catch { context.addIssue({ code: "custom", path: ["source_origin"], message: "InSchool origin is invalid" }); return; }
  if (origin.protocol !== "https:" || !origin.hostname.endsWith(".inschool.visma.no") || origin.pathname !== "/" || origin.search || origin.hash || origin.username || origin.password || origin.port) {
    context.addIssue({ code: "custom", path: ["source_origin"], message: "Exact InSchool HTTPS origin required" });
  }
  const subjects = new Set(snapshot.records.filter(item => item.kind === "subject").map(item => item.externalId));
  const courses = new Map(snapshot.records.filter(item => item.kind === "course").map(item => [item.externalId, item.subjectExternalId]));
  const lessons = new Map(snapshot.records.filter(item => item.kind === "lesson").map(item => [item.externalId, item.courseExternalId]));
  const seen = new Set<string>();
  snapshot.records.forEach((item, index) => {
    const identity = `${item.kind}\0${item.externalId}`;
    if (seen.has(identity)) context.addIssue({ code: "custom", path: ["records", index, "externalId"], message: "Duplicate provider identity" });
    seen.add(identity);
    if (item.kind === "course" && !subjects.has(item.subjectExternalId)) context.addIssue({ code: "custom", path: ["records", index, "subjectExternalId"], message: "Course subject is missing" });
    if (item.kind === "lesson") {
      if (!courses.has(item.courseExternalId) || courses.get(item.courseExternalId) !== item.subjectExternalId) context.addIssue({ code: "custom", path: ["records", index, "courseExternalId"], message: "Lesson course is missing or mismatched" });
      const duration = Date.parse(item.endsAt) - Date.parse(item.startsAt);
      if (duration < 5 * 60_000 || duration > 10 * 60 * 60_000) context.addIssue({ code: "custom", path: ["records", index, "endsAt"], message: "Lesson duration is outside bounds" });
    }
    if (item.kind === "attendance") {
      if (!courses.has(item.courseExternalId)) context.addIssue({ code: "custom", path: ["records", index, "courseExternalId"], message: "Attendance course is missing" });
      if (item.lessonExternalId && lessons.get(item.lessonExternalId) !== item.courseExternalId) context.addIssue({ code: "custom", path: ["records", index, "lessonExternalId"], message: "Attendance lesson is missing or mismatched" });
      if ((item.duration === null) !== (item.units === null)) context.addIssue({ code: "custom", path: ["records", index, "duration"], message: "Attendance duration and units must travel together" });
    }
    if (item.kind === "grade" && !courses.has(item.courseExternalId)) context.addIssue({ code: "custom", path: ["records", index, "courseExternalId"], message: "Grade course is missing" });
  });
});

export type InSchoolSnapshot = z.infer<typeof inSchoolSnapshotSchema>;

export function parseInSchoolSnapshot(value: unknown): InSchoolSnapshot {
  const parsed = inSchoolSnapshotSchema.safeParse(value);
  if (!parsed.success) throw new Error("school_snapshot_invalid");
  return parsed.data;
}
