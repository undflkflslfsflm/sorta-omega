import { describe, expect, it } from "vitest";
import { groupBrainNotes, groupImportedOriginals, importedSourceLocation, isAutomaticSourceNote } from "./brain-note-groups";

describe("Brain note grouping", () => {
  it("keeps owner captures in the primary view", () => {
    expect(isAutomaticSourceNote({ sourceId: null, body: "Source: Teams class channel post\nMy own note" })).toBe(false);
    expect(isAutomaticSourceNote({ sourceId: "source-1", body: "A captured thought" })).toBe(false);
  });

  it("groups automatic Teams posts and imported files without losing their order", () => {
    const notes = [
      { sourceId: "source-1", body: "Source: Teams class channel post\nClass: Maths", title: "post" },
      { sourceId: "source-2", body: "A captured thought", title: "thought" },
      { sourceId: "source-3", body: "Imported from silent-4090: Downloads/README.md", title: "file" }
    ];
    const groups = groupBrainNotes(notes);
    expect(groups.personal.map(note => note.title)).toEqual(["thought"]);
    expect(groups.imported.map(note => note.title)).toEqual(["post", "file"]);
  });
});

describe("imported original grouping", () => {
  it("shows one material for byte-identical originals while retaining both source locations", () => {
    const notes = [
      { sourceId: "a", body: "Imported from 4090: Teams/Maths/Shared/chapter.pptx\n\nSlides", title: "chapter", originalSha256: "a".repeat(64) },
      { sourceId: "b", body: "Imported from 4090: Teams/Maths/Posts/chapter.pptx\n\nSlides", title: "chapter", originalSha256: "a".repeat(64) },
      { sourceId: "c", body: "Imported from 4090: Teams/Maths/Shared/other.pptx", title: "other", originalSha256: "b".repeat(64) }
    ];
    const groups = groupImportedOriginals(notes);
    expect(groups).toHaveLength(2);
    expect(groups[0]).toEqual(notes.slice(0, 2));
    expect(importedSourceLocation(groups[0][1])).toBe("4090: Teams/Maths/Posts/chapter.pptx");
  });

  it("never collapses records without a verified original hash", () => {
    const notes = [
      { sourceId: "a", body: "Source: Teams class channel post\nSame text", title: "post", originalSha256: null },
      { sourceId: "b", body: "Source: Teams class channel post\nSame text", title: "post" }
    ];
    expect(groupImportedOriginals(notes)).toEqual([[notes[0]], [notes[1]]]);
  });
});
