import { describe, expect, it } from "vitest";
import { applyClassificationResult, classificationUndoConflict } from "./classification.js";

describe("classification corrections", () => {
  it("does not overwrite an owner-locked classification", () => {
    expect(applyClassificationResult({ classification: "reference", suggestedTitle: null, classifiedRevision: 2, locked: true }, { classification: "task", suggestedTitle: "Do this" }, 3)).toEqual({ classification: "reference", suggestedTitle: null, classifiedRevision: 2, applied: false });
  });

  it("applies a typed result when the field is unlocked", () => {
    expect(applyClassificationResult({ classification: null, suggestedTitle: null, classifiedRevision: null, locked: false }, { classification: "idea", suggestedTitle: "New idea" }, 3)).toEqual({ classification: "idea", suggestedTitle: "New idea", classifiedRevision: 3, applied: true });
  });
});

describe("classification undo", () => {
  const current = { revision: 3, classification: "task" as const, classifiedRevision: 3, organizationRevision: 7, locked: false };
  const operation = { sourceRevision: 3, resultClassification: "task" as const, effectOrganizationRevision: 7 };

  it("allows undo while the recorded effect is still current", () => {
    expect(classificationUndoConflict(current, operation, 3)).toBeNull();
  });

  it("rejects undo after any later organization change", () => {
    expect(classificationUndoConflict({ ...current, organizationRevision: 8 }, operation, 3)).toBe("operation_effects_changed");
  });

  it("rejects undo after an owner locks classification", () => {
    expect(classificationUndoConflict({ ...current, locked: true }, operation, 3)).toBe("operation_effects_changed");
  });

  it("rejects undo when note content has advanced", () => {
    expect(classificationUndoConflict({ ...current, revision: 4 }, operation, 3)).toBe("stale_note_revision");
  });
});
