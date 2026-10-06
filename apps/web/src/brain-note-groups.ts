import type { Note } from "@sorta/contracts";

type SourceNote = Pick<Note, "body" | "sourceId">;

export function isAutomaticSourceNote(note: SourceNote): boolean {
  if (!note.sourceId) return false;
  return note.body.startsWith("Source: Teams class channel post\n") || note.body.startsWith("Source: Teams chat\n") || note.body.startsWith("Imported from ");
}

export function groupBrainNotes<T extends SourceNote>(notes: T[]): { personal: T[]; imported: T[] } {
  const personal: T[] = [];
  const imported: T[] = [];
  for (const note of notes) (isAutomaticSourceNote(note) ? imported : personal).push(note);
  return { personal, imported };
}

export function groupImportedOriginals<T extends SourceNote & { originalSha256?: string | null }>(notes: T[]): T[][] {
  const groups: T[][] = [];
  const byHash = new Map<string, T[]>();
  for (const note of notes) {
    const hash = note.originalSha256;
    if (!hash) { groups.push([note]); continue; }
    const existing = byHash.get(hash);
    if (existing) existing.push(note);
    else { const group = [note]; byHash.set(hash, group); groups.push(group); }
  }
  return groups;
}

export function importedSourceLocation(note: SourceNote & { title: string }): string {
  const firstLine = note.body.split("\n", 1)[0];
  return firstLine.startsWith("Imported from ") ? firstLine.slice("Imported from ".length) : note.title;
}

export function notePreviewContent(note: SourceNote): string {
  if (!isAutomaticSourceNote(note) || !note.body.startsWith("Imported from ")) return note.body;
  const separator = note.body.indexOf("\n\n");
  return separator < 0 ? note.body : note.body.slice(separator + 2);
}
