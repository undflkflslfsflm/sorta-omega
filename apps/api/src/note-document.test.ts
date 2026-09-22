import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { initializeRichDocument } from "./rich-document.js";
import { restoreDocumentRevision } from "./note-document.js";
import { appendDocumentText, createDocumentState, editorDocumentToMarkdown, mergeDocumentUpdate, migrateDocumentToRich, readDocumentText, readEditorDocument, replaceDocumentText, replaceEditorDocument, toEditorJson } from "./note-document.js";

describe("canonical note documents", () => {
  it("restores legacy content without downgrading a migrated document or rewinding history", () => {
    const historical=createDocumentState("Earlier");
    const migrated=migrateDocumentToRich(historical).state;
    const current=replaceDocumentText(migrated,"Current");
    const original=Buffer.from(current);
    const restored=restoreDocumentRevision(current,historical,"Current","Earlier");
    expect(restored.text).toBe("Earlier");
    const before=new Y.Doc(),after=new Y.Doc();
    Y.applyUpdate(before,current);Y.applyUpdate(after,restored.state);
    expect(after.share.has("prosemirror")).toBe(true);
    const clocks=Y.decodeStateVector(Y.encodeStateVector(after));
    for(const [client,clock] of Y.decodeStateVector(Y.encodeStateVector(before)))expect(clocks.get(client)).toBeGreaterThanOrEqual(clock);
    const replay=mergeDocumentUpdate(restored.state,current.toString("base64"));
    expect(replay.text).toBe("Earlier");
    expect(replay.state).toEqual(restored.state);
    Y.applyUpdate(before,restored.state);
    expect(readDocumentText(Y.encodeStateAsUpdate(before))).toBe("Earlier");
    expect(current).toEqual(original);
    expect(readDocumentText(historical)).toBe("Earlier");
    before.destroy();after.destroy();
  });

  it("restores rich formatting as new shared content and keeps text-only historical fallback", () => {
    const editor={type:"doc",content:[{type:"heading",attrs:{level:2},content:[{type:"text",text:"Title",marks:[{type:"bold",attrs:{}}]}]}]};
    const historical=replaceEditorDocument(migrateDocumentToRich(createDocumentState("Start")).state,editor).state;
    const current=replaceDocumentText(historical,"Later");
    const restored=restoreDocumentRevision(current,historical);
    expect(readEditorDocument(restored.state)).toEqual(editor);
    expect(editorDocumentToMarkdown(restored.document)).toBe("## **Title**");
    expect(restoreDocumentRevision(restored.state,null,"","Ancient text").text).toBe("Ancient text");
  });
  it("migrates once without changing prior snapshots or losing formatted content", () => {
    const editor = { type: "doc", content: [{ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Keep", marks: [{ type: "bold", attrs: {} }] }] }] };
    const legacy = replaceEditorDocument(createDocumentState("Old"), editor).state;
    const original = Buffer.from(legacy);
    const changed = migrateDocumentToRich(legacy);
    expect(changed.migrated).toBe(true);
    expect(readEditorDocument(changed.state)).toEqual(editor);
    expect(legacy).toEqual(original);
    const repeated = migrateDocumentToRich(changed.state);
    expect(repeated.migrated).toBe(false);
    expect(repeated.state).toEqual(changed.state);
  });

  it("fails migration rather than discarding divergent legacy content", () => {
    const doc = new Y.Doc();
    Y.applyUpdate(doc, createDocumentState("Original"));
    doc.getText("content").insert(0, "Unsynced ");
    expect(() => migrateDocumentToRich(Y.encodeStateAsUpdate(doc))).toThrow("legacy_document_projection_mismatch");
  });

  function richState() {
    const doc = new Y.Doc();
    Y.applyUpdate(doc, createDocumentState("Stale legacy projection"));
    initializeRichDocument(doc, toEditorJson("Hello"));
    return Buffer.from(Y.encodeStateAsUpdate(doc));
  }

  it("reads and replaces migrated fragments instead of stale legacy projections", () => {
    const state = richState();
    expect(readDocumentText(state)).toBe("Hello");
    expect(readEditorDocument(state)).toEqual(toEditorJson("Hello"));
    const replaced = replaceEditorDocument(state, toEditorJson("New"));
    expect(readDocumentText(replaced.state)).toBe("New");
    expect(readEditorDocument(replaced.state)).toEqual(toEditorJson("New"));
    expect(readDocumentText(replaceDocumentText(replaced.state, ""), "Stale")).toBe("");
  });

  it("merges concurrent rich formatting and text through the production merge path", () => {
    const state = richState();
    const textOf = (doc: Y.Doc) => (doc.getXmlFragment("prosemirror").get(0) as Y.XmlElement).get(0) as Y.XmlText;
    const bold = offlineUpdate(state, doc => textOf(doc).format(0, 5, { bold: {} }));
    const suffix = offlineUpdate(state, doc => textOf(doc).insert(5, " world", { italic: {} }));
    const first = mergeDocumentUpdate(mergeDocumentUpdate(state, bold).state, suffix);
    const second = mergeDocumentUpdate(mergeDocumentUpdate(state, suffix).state, bold);
    expect(first.document).toEqual(second.document);
    expect(first.text).toBe("Hello world");
    const inline = first.document.content[0].content!;
    expect(inline[0].marks).toContainEqual({ type: "bold", attrs: {} });
    // Concurrent formatting can extend across an insertion at its boundary.
    expect(inline[inline.length - 1].marks).toContainEqual({ type: "italic", attrs: {} });
    expect(readEditorDocument(first.state)).toEqual(first.document);
    expect(readDocumentText(first.state)).toBe(first.text);
    expect(mergeDocumentUpdate(first.state, bold).state).toEqual(first.state);
  });

  it("rejects legacy edits after migration without changing the input snapshot", () => {
    const state = richState();
    for (const update of [
      offlineUpdate(state, doc => doc.getText("content").insert(0, "Lost edit")),
      offlineUpdate(state, doc => doc.getMap("editor").set("document", JSON.stringify(toEditorJson("Lost edit"))))
    ]) expect(() => mergeDocumentUpdate(state, update)).toThrow("legacy_document_update_after_migration");
    expect(readDocumentText(state)).toBe("Hello");
  });

  it("does not let an offline update initialize the canonical rich fragment", () => {
    const state = createDocumentState("Legacy");
    const update = offlineUpdate(state, doc => { initializeRichDocument(doc, toEditorJson("Client migration")); });
    expect(() => mergeDocumentUpdate(state, update)).toThrow("rich_document_migration_required");
    expect(readDocumentText(state)).toBe("Legacy");
  });

  function offlineUpdate(state: Uint8Array, edit: (document: Y.Doc) => void) {
    const client = new Y.Doc();
    Y.applyUpdate(client, state);
    const vector = Y.encodeStateVector(client);
    edit(client);
    const update = Buffer.from(Y.encodeStateAsUpdate(client, vector)).toString("base64");
    client.destroy();
    return update;
  }

  it("converges concurrent text insertions in either delivery order", () => {
    const baseline = createDocumentState("Meeting");
    const alice = offlineUpdate(baseline, doc => doc.getText("content").insert(7, " with Alice"));
    const bob = offlineUpdate(baseline, doc => doc.getText("content").insert(7, " with Bob"));
    const aliceThenBob = mergeDocumentUpdate(mergeDocumentUpdate(baseline, alice).state, bob);
    const bobThenAlice = mergeDocumentUpdate(mergeDocumentUpdate(baseline, bob).state, alice);
    expect(aliceThenBob.text).toBe(bobThenAlice.text);
    expect(aliceThenBob.document).toEqual(bobThenAlice.document);
    expect(aliceThenBob.text).toContain("with Alice");
    expect(aliceThenBob.text).toContain("with Bob");
    const replay = mergeDocumentUpdate(aliceThenBob.state, alice);
    expect(replay.text).toBe(aliceThenBob.text);
    expect(replay.document).toEqual(aliceThenBob.document);
    expect(replay.state).toEqual(aliceThenBob.state);
  });

  it("keeps an offline clear empty across replay and reload with a stale fallback", () => {
    const baseline = createDocumentState("Remove this text");
    const update = offlineUpdate(baseline, doc => {
      const text = doc.getText("content");
      text.delete(0, text.length);
    });
    const cleared = mergeDocumentUpdate(baseline, update, "Remove this text");
    const replay = mergeDocumentUpdate(cleared.state, update, "Remove this text");
    expect(replay.text).toBe("");
    expect(readDocumentText(replay.state, "Remove this text")).toBe("");
    expect(readEditorDocument(replay.state, "Remove this text")).toEqual(toEditorJson(""));
    expect(replay.state).toEqual(cleared.state);
  });

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
