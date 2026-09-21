import { createHash } from "node:crypto";

export type AnchoredChunk = { sequence: number; text: string; startOffset: number; endOffset: number; contentHash: string };

export function chunkText(text: string, maxChars = 1_800, overlapChars = 180): AnchoredChunk[] {
  if (!Number.isInteger(maxChars) || maxChars < 200) throw new Error("max_chars_too_small");
  if (!Number.isInteger(overlapChars) || overlapChars < 0 || overlapChars >= maxChars / 2) throw new Error("invalid_chunk_overlap");
  if (!text.trim()) return [];
  const chunks: AnchoredChunk[] = [];
  let start = 0;
  while (start < text.length) {
    while (start < text.length && /\s/.test(text[start])) start += 1;
    if (start >= text.length) break;
    let end = Math.min(text.length, start + maxChars);
    if (end < text.length) {
      const minimumBreak = start + Math.floor(maxChars * 0.6);
      const paragraphBreak = text.lastIndexOf("\n\n", end);
      const lineBreak = text.lastIndexOf("\n", end);
      const wordBreak = text.lastIndexOf(" ", end);
      const chosen = paragraphBreak >= minimumBreak ? paragraphBreak : lineBreak >= minimumBreak ? lineBreak : wordBreak >= minimumBreak ? wordBreak : end;
      end = chosen;
    }
    while (end > start && /\s/.test(text[end - 1])) end -= 1;
    if (end <= start) end = Math.min(text.length, start + maxChars);
    const content = text.slice(start, end);
    chunks.push({
      sequence: chunks.length,
      text: content,
      startOffset: start,
      endOffset: end,
      contentHash: createHash("sha256").update(content).digest("hex")
    });
    if (end >= text.length) break;
    const next = Math.max(start + 1, end - overlapChars);
    start = next;
  }
  return chunks;
}
