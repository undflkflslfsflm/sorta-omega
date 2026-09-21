export type NoteClassification = "note" | "task" | "event" | "idea" | "reference" | "unknown";

export function applyClassificationResult(
  current: { classification: NoteClassification | null; suggestedTitle: string | null; classifiedRevision: number | null; locked: boolean },
  result: { classification: NoteClassification; suggestedTitle: string | null },
  sourceRevision: number
) {
  if (current.locked) return { classification: current.classification, suggestedTitle: current.suggestedTitle, classifiedRevision: current.classifiedRevision, applied: false };
  return { classification: result.classification, suggestedTitle: result.suggestedTitle, classifiedRevision: sourceRevision, applied: true };
}

export function classificationUndoConflict(
  current: { revision: number; classification: NoteClassification | null; classifiedRevision: number | null; organizationRevision: number; locked: boolean },
  operation: { sourceRevision: number; resultClassification: NoteClassification; effectOrganizationRevision: number | null },
  expectedCurrentRevision: number
) {
  if (current.revision !== expectedCurrentRevision) return "stale_note_revision" as const;
  if (operation.effectOrganizationRevision === null || current.organizationRevision !== operation.effectOrganizationRevision) return "operation_effects_changed" as const;
  if (current.locked || current.classifiedRevision !== operation.sourceRevision || current.classification !== operation.resultClassification) return "operation_effects_changed" as const;
  return null;
}
