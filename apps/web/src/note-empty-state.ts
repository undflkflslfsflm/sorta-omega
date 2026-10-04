export type AttachmentLoadState = "loading" | "loaded" | "error";

export function emptyNoteMessage(state: AttachmentLoadState, attachmentCount: number, revision: number): string {
  if (state === "loading") return "No text in this note. Checking its original capture for files…";
  if (state === "error") return "No text in this note. Its original files could not be checked right now.";
  if (attachmentCount > 0) return "No text in this note. Its original attachments are shown above.";
  const explanation = revision > 1 ? ` Version ${revision} counts saved changes, not separate notes or files.` : "";
  return `No text or attached files in this note.${explanation}`;
}
