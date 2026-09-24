export function explicitCapturedTaskTitle(text: string): string | null {
  const firstLine = text.trim().split(/\r?\n/, 1)[0]?.trim() ?? "";
  const match = /^(?:todo|task|oppgave)\s*:\s*(.+)$|^husk\s+å\s+(.+)$/iu.exec(firstLine);
  const title = (match?.[1] ?? match?.[2] ?? "").trim();
  return title && title.length <= 500 ? title : null;
}
