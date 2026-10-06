import { describe, expect, it } from "vitest";
import { validateAssignmentFileSnapshot } from "./teams-assignment-files.js";
import type { TeamsAssignmentSnapshot } from "./teams-assignments.js";

const record: TeamsAssignmentSnapshot["records"][number] = {
  classExternalId: "class-id", assignmentExternalId: "assignment-id", title: "Work", courseTitle: "Course", dueSummary: "", instructions: "", metadataText: "", pointsText: "", cardText: "", linkedFileNames: ["Slides.pptx"], detailUrl: "https://assignments.edu.cloud.microsoft/classes/class-id/assignments/assignment-id", listSection: "upcoming", detailState: "available",
};
const snapshot: TeamsAssignmentSnapshot = { version: "omega_teams_assignments_json_v1", source_timestamp: "2026-10-06T00:00:00.000Z", source_origin: "https://assignments.edu.cloud.microsoft", coverage: { listRoute: "/classes/all/list", visibleCardCount: 1, capturedDetailCount: 1, complete: false, limitation: null }, records: [record] };

describe("Teams assignment file snapshot", () => {
  it("accepts a bounded, canonical captured detail", () => {
    expect(() => validateAssignmentFileSnapshot(snapshot)).not.toThrow();
  });

  it("rejects duplicate identities and a changed detail origin", () => {
    expect(() => validateAssignmentFileSnapshot({ ...snapshot, records: [record, record] })).toThrow("teams_assignment_files_snapshot_duplicate");
    expect(() => validateAssignmentFileSnapshot({ ...snapshot, records: [{ ...record, detailUrl: "https://example.com/classes/class-id/assignments/assignment-id" }] })).toThrow("teams_assignment_files_snapshot_route_invalid");
  });

  it("rejects malformed resource names", () => {
    expect(() => validateAssignmentFileSnapshot({ ...snapshot, records: [{ ...record, linkedFileNames: [""] }] })).toThrow("teams_assignment_files_snapshot_record_invalid");
  });
});
