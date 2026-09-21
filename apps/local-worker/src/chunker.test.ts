import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { chunkText } from "./chunker.js";

describe("source-anchored chunker", () => {
  it("keeps exact offsets, stable hashes and bounded overlapping chunks", () => {
    const text = `${"Alpha beta gamma delta. ".repeat(30)}\n\n${"Second paragraph with exact evidence. ".repeat(28)}`;
    const first = chunkText(text, 400, 40);
    const second = chunkText(text, 400, 40);
    expect(second).toEqual(first);
    expect(first.length).toBeGreaterThan(2);
    for (const chunk of first) {
      expect(chunk.text).toBe(text.slice(chunk.startOffset, chunk.endOffset));
      expect(chunk.text.length).toBeLessThanOrEqual(400);
      expect(chunk.contentHash).toBe(createHash("sha256").update(chunk.text).digest("hex"));
    }
    for (let index = 1; index < first.length; index += 1) expect(first[index].startOffset).toBeLessThan(first[index - 1].endOffset);
  });

  it("returns no chunk for whitespace and rejects unsafe sizing", () => {
    expect(chunkText("  \n ")).toEqual([]);
    expect(() => chunkText("text", 100, 10)).toThrow("max_chars_too_small");
    expect(() => chunkText("text", 400, 220)).toThrow("invalid_chunk_overlap");
  });
});
