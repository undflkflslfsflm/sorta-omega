import { z } from "zod";

const id = z.string().uuid();
const item = z.object({
  classExternalId: id,
  assignmentExternalId: id,
  title: z.string().trim().min(1).max(500),
  courseTitle: z.string().trim().min(1).max(500),
  dueSummary: z.string().max(500),
  instructions: z.string().max(100_000),
  metadataText: z.string().max(8_000),
  pointsText: z.string().max(8_000),
  cardText: z.string().min(1).max(8_000),
  linkedFileNames: z.array(z.string().trim().min(1).max(500)).max(100),
  detailUrl: z.string().url(),
  listSection: z.enum(["upcoming", "past_due", "completed"]).optional(),
  detailState: z.enum(["available", "not_assigned"]).optional(),
}).strict().superRefine((record, context) => {
  const canonical = `https://assignments.edu.cloud.microsoft/classes/${record.classExternalId}/assignments/${record.assignmentExternalId}`;
  if (record.detailUrl !== canonical) context.addIssue({ code: "custom", path: ["detailUrl"], message: "Assignment link does not match its identities" });
});

export const teamsAssignmentSnapshotSchema = z.object({
  version: z.literal("omega_teams_assignments_json_v1"),
  source_timestamp: z.string().datetime(),
  source_origin: z.literal("https://assignments.edu.cloud.microsoft"),
  coverage: z.object({
    listRoute: z.literal("/classes/all/list"),
    visibleCardCount: z.number().int().min(1).max(500),
    capturedDetailCount: z.number().int().min(1).max(500),
    complete: z.boolean(),
    limitation: z.string().max(2_000).nullable(),
  }).strict(),
  records: z.array(item).min(1).max(500),
}).strict().superRefine((snapshot, context) => {
  if (snapshot.coverage.visibleCardCount !== snapshot.records.length || snapshot.coverage.capturedDetailCount !== snapshot.records.length) context.addIssue({ code: "custom", path: ["coverage"], message: "Snapshot count mismatch" });
  const seen = new Set<string>();
  const classTitles = new Map<string, string>();
  snapshot.records.forEach((record, index) => {
    const key = `${record.classExternalId}:${record.assignmentExternalId}`;
    if (seen.has(key)) context.addIssue({ code: "custom", path: ["records", index], message: "Duplicate assignment identity" });
    seen.add(key);
    const previousTitle = classTitles.get(record.classExternalId);
    if (previousTitle !== undefined && previousTitle !== record.courseTitle) context.addIssue({ code: "custom", path: ["records", index, "courseTitle"], message: "Conflicting title for class identity" });
    classTitles.set(record.classExternalId, record.courseTitle);
  });
});

export type TeamsAssignmentSnapshot = z.infer<typeof teamsAssignmentSnapshotSchema>;
