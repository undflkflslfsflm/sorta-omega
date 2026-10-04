import { describe, expect, it } from "vitest";
import { emptyNoteMessage } from "./note-empty-state";

describe("empty note explanation", () => {
  it("does not point to nonexistent attachments", () => {
    expect(emptyNoteMessage("loaded", 0, 3)).toBe("No text or attached files in this note. Version 3 counts saved changes, not separate notes or files.");
  });

  it("points to actual attachments above the preview", () => {
    expect(emptyNoteMessage("loaded", 2, 1)).toBe("No text in this note. Its original attachments are shown above.");
  });

  it("does not claim missing files before or after a failed lookup", () => {
    expect(emptyNoteMessage("loading", 0, 1)).toContain("Checking");
    expect(emptyNoteMessage("error", 0, 1)).toContain("could not be checked");
  });
});
