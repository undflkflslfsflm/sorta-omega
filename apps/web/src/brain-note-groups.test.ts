import { describe, expect, it } from "vitest";
import { groupBrainNotes, isAutomaticSourceNote } from "./brain-note-groups";

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
