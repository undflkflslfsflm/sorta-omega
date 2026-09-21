import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { appendDocumentText, createDocumentState, editorDocumentToMarkdown, mergeDocumentUpdate, readDocumentText, readEditorDocument, replaceDocumentText, replaceEditorDocument, toEditorJson } from "./note-document.js";

describe("canonical note documents", () => {
  it("keeps an explicitly cleared document empty even with an old text fallback", () => {
    const cleared = replaceDocumentText(createDocumentState("Old private text"), "");
    expect(readDocumentText(cleared, "Old private text")).toBe("");
    expect(readEditorDocument(cleared, "Old private text")).toEqual(toEditorJson(""));
    const appended = appendDocumentText(cleared, "New text", "Old private text");
    expect(appended.text.trim()).toBe("New text");
  });

  it("keeps a cleared legacy Yjs document empty after reload", () => {
    const legacy = new Y.Doc();
    legacy.getText("content").insert(0, "Deleted text");
    legacy.getText("content").delete(0, 12);
    const state = Buffer.from(Y.encodeStateAsUpdate(legacy));
    expect(readDocumentText(state, "Deleted text")).toBe("");
    expect(readEditorDocument(state, "Deleted text")).toEqual(toEditorJson(""));
  });

  it("uses fallback text only when no canonical snapshot exists", () => {
    expect(readDocumentText(null, "Legacy body")).toBe("Legacy body");
    expect(readEditorDocument(null, "Legacy body")).toEqual(toEditorJson("Legacy body"));
  });

  it("round-trips text through a Yjs update", () => {
    const state = createDocumentState("Original promise");
    expect(readDocumentText(state)).toBe("Original promise");
  });

  it("replaces and appends without losing the canonical state", () => {
    const initial = createDocumentState("Bring the book");
    const replaced = replaceDocumentText(initial, "Bring the economics book");
    const appended = appendDocumentText(replaced, "Return it after the meeting");
    expect(appended.text).toBe("Bring the economics book\n\nReturn it after the meeting");
    expect(readDocumentText(appended.state)).toBe(appended.text);
  });

  it("projects text into an editor document", () => {
    expect(toEditorJson("One\n\nTwo")).toEqual({
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "One" }] },
        { type: "paragraph", content: [{ type: "text", text: "Two" }] }
      ]
    });
  });

  it("stores rich editor JSON inside the canonical Yjs state and derives text", () => {
    const rich = {
      type: "doc" as const,
      content: [
        { type: "heading" as const, attrs: { level: 2 }, content: [{ type: "text" as const, text: "Packing list" }] },
        { type: "taskList" as const, content: [{ type: "taskItem" as const, attrs: { checked: true }, content: [{ type: "paragraph" as const, content: [{ type: "text" as const, text: "Passport", marks: [{ type: "bold" as const }] }] }] }] }
      ]
    };
    const changed = replaceEditorDocument(createDocumentState("Old"), rich);
    expect(readEditorDocument(changed.state)).toEqual(rich);
    expect(changed.text).toBe("Packing list\n\n- [x] Passport");
    expect(editorDocumentToMarkdown(rich)).toContain("## Packing list");
    expect(editorDocumentToMarkdown(rich)).toContain("- [x] **Passport**");
  });

  it("upgrades a legacy text-only Yjs snapshot on the next rich edit", () => {
    const legacy = new Y.Doc();
    legacy.getText("content").insert(0, "Legacy note");
    const state = Buffer.from(Y.encodeStateAsUpdate(legacy));
    expect(readEditorDocument(state)).toEqual(toEditorJson("Legacy note"));
    const changed = replaceEditorDocument(state, toEditorJson("Edited note"));
    expect(readDocumentText(changed.state)).toBe("Edited note");
    expect(readEditorDocument(changed.state)).toEqual(toEditorJson("Edited note"));
  });

  it("persists bounded callouts and projects them to portable Markdown", () => {
    const callout = {
      type: "doc" as const,
      content: [{
        type: "callout" as const,
        attrs: { kind: "warning" },
        content: [{ type: "paragraph" as const, content: [{ type: "text" as const, text: "Bring the signed form" }] }]
      }]
    };
    const changed = replaceEditorDocument(createDocumentState("Old"), callout);
    expect(readEditorDocument(changed.state)).toEqual(callout);
    expect(changed.text).toBe("Bring the signed form");
    expect(editorDocumentToMarkdown(callout)).toBe("> [!WARNING]\n> Bring the signed form");
  });

  it("merges an incremental offline Yjs update into canonical state", () => {
    const state=createDocumentState("Draft");
    const baseline=new Y.Doc();Y.applyUpdate(baseline,state);
    const offline=new Y.Doc();Y.applyUpdate(offline,state);offline.getText("content").insert(5," updated offline");
    const update=Buffer.from(Y.encodeStateAsUpdate(offline,Y.encodeStateVector(baseline))).toString("base64");
    const merged=mergeDocumentUpdate(state,update,"Draft");
    expect(merged.text).toBe("Draft updated offline");
    expect(readDocumentText(merged.state)).toBe("Draft updated offline");
  });
});
