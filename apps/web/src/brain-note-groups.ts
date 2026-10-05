import type { Note } from "@sorta/contracts";

type SourceNote = Pick<Note, "body" | "sourceId">;

export function isAutomaticSourceNote(note: SourceNote): boolean {
  if (!note.sourceId) return false;
  return note.body.startsWith("Source: Teams class channel post\n") || note.body.startsWith("Imported from ");
}

export function groupBrainNotes<T extends SourceNote>(notes: T[]): { personal: T[]; imported: T[] } {
  const personal: T[] = [];
  const imported: T[] = [];
  for (const note of notes) (isAutomaticSourceNote(note) ? imported : personal).push(note);
  return { personal, imported };
}
