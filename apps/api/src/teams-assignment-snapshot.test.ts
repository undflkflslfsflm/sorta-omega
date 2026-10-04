import { describe, expect, it } from "vitest";
import { teamsAssignmentSnapshotSchema } from "./teams-assignment-snapshot.js";

const classExternalId = "9005638e-9d58-42a6-b86d-3b84392118af";
const assignmentExternalId = "b246365c-4860-4539-9195-b72b8bccc25a";
const record = {
  classExternalId,
  assignmentExternalId,
  title: "Exercise",
  courseTitle: "Matematikk 2P",
  dueSummary: "Tomorrow",
  instructions: "Read chapter 1",
  metadataText: "Due tomorrow at 11:59 PM",
  pointsText: "",
  cardText: "Exercise",
  linkedFileNames: [],
  detailUrl: `https://assignments.edu.cloud.microsoft/classes/${classExternalId}/assignments/${assignmentExternalId}`,
};
const snapshot = {
  version: "omega_teams_assignments_json_v1",
  source_timestamp: "2026-10-04T19:32:26.572Z",
  source_origin: "https://assignments.edu.cloud.microsoft",
  coverage: { listRoute: "/classes/all/list", visibleCardCount: 1, capturedDetailCount: 1, complete: false, limitation: "Visible cards only" },
  records: [record],
};

describe("Teams assignment snapshot validation", () => {
  it("accepts a bounded, internally consistent capture", () => {
    expect(teamsAssignmentSnapshotSchema.safeParse(snapshot).success).toBe(true);
  });
  it("rejects mismatched identity, duplicate records, and false counts", () => {
    expect(teamsAssignmentSnapshotSchema.safeParse({ ...snapshot, records: [{ ...record, detailUrl: "https://evil.invalid/" }] }).success).toBe(false);
    expect(teamsAssignmentSnapshotSchema.safeParse({ ...snapshot, records: [record, record] }).success).toBe(false);
    expect(teamsAssignmentSnapshotSchema.safeParse({ ...snapshot, coverage: { ...snapshot.coverage, visibleCardCount: 2 } }).success).toBe(false);
  });
  it("rejects conflicting titles for the same class", () => {
    const second = { ...record, assignmentExternalId: "915b7a95-14d9-4b32-a32f-71d1ebd55f5f", courseTitle: "Other class" };
    second.detailUrl = `https://assignments.edu.cloud.microsoft/classes/${classExternalId}/assignments/${second.assignmentExternalId}`;
    expect(teamsAssignmentSnapshotSchema.safeParse({ ...snapshot, coverage: { ...snapshot.coverage, visibleCardCount: 2, capturedDetailCount: 2 }, records: [record, second] }).success).toBe(false);
  });
});
