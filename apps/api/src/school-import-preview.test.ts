import { describe, expect, it } from "vitest";
import { inSchoolSnapshotSchema } from "./school-snapshot.js";
import { schoolImportPreview, schoolSnapshotOutsidePeriod } from "./school-import-preview.js";
import { schoolImportApplyResultSchema, schoolImportPreviewResultSchema } from "@sorta/contracts";

describe("InSchool import preview", () => {
  it("counts typed attendance and grades without requiring a fictitious title", () => {
    const snapshot = inSchoolSnapshotSchema.parse({ version: "omega_school_json_v1", source_timestamp: "2026-09-24T12:00:00.000Z", source_origin: "https://mailand.inschool.visma.no", timezone: "Europe/Oslo", records: [
      { kind: "subject", externalId: "s", title: "Matematikk", code: null },
      { kind: "course", externalId: "c", title: "Matematikk 2P", subjectExternalId: "s", teachingGroupId: null },
      { kind: "attendance", externalId: "a", courseExternalId: "c", lessonExternalId: null, date: "2026-09-24", rawStatus: "For sent", normalizedStatus: "late", excusalStatus: "unknown", duration: null, units: null },
      { kind: "grade", externalId: "g", courseExternalId: "c", date: "2026-09-24", rawGrade: "5+", scale: "1-6", officialWeight: null }
    ] });
    const preview = schoolImportPreview(snapshot);
    expect(preview.counts).toMatchObject({ subject: 1, course: 1, attendance: 1, grade: 1 });
    expect(preview.sample.find(item => item.kind === "attendance")?.title).toContain("For sent");
    expect(preview.sample.find(item => item.kind === "grade")?.title).toContain("5+");
    expect(schoolImportPreviewResultSchema.safeParse({ type: "school_import_preview", detectedFormat: "omega_school_json_v1", sourceTimestamp: snapshot.source_timestamp, timezone: snapshot.timezone, period: null, ...preview, warnings: [], snapshotOnly: true, liveConnectionCreated: false, writesApplied: false }).success).toBe(true);
    expect(schoolSnapshotOutsidePeriod(snapshot, { from: "2026-09-23", to: "2026-09-23" })).toBe(true);
    expect(schoolSnapshotOutsidePeriod(snapshot, { from: "2026-09-24", to: "2026-09-24" })).toBe(false);
  });
  it("accepts all five canonical apply count categories", () => {
    const actions = { created: 0, updated: 0, linked: 0, unchanged: 0, stale: 0 };
    const base = { type: "school_import_apply", previewJobId: "00000000-0000-4000-8000-000000000123", sourceTimestamp: "2026-09-24T12:00:00.000Z", snapshotOnly: true, liveConnectionCreated: false, writesApplied: true, limitations: [] };
    expect(schoolImportApplyResultSchema.safeParse({ ...base, counts: { subject: actions, course: actions, lesson: actions, attendance: actions, grade: actions } }).success).toBe(true);
    const historic = schoolImportApplyResultSchema.parse({ ...base, counts: { subject: actions, course: actions, lesson: actions } });
    expect(historic.counts.attendance).toEqual(actions);
    expect(historic.counts.grade).toEqual(actions);
  });
});
