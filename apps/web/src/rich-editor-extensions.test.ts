import { getSchema } from "@tiptap/core";
import * as Y from "yjs";
import { describe,expect,it } from "vitest";
import { richEditorExtensions } from "./rich-editor-extensions";

describe("shared editor schema",()=>{
  it("uses the same block and mark schema for legacy and shared documents",()=>{
    const doc=new Y.Doc();doc.getXmlFragment("prosemirror");
    const legacy=getSchema(richEditorExtensions()),rich=getSchema(richEditorExtensions(doc));
    expect(Object.keys(rich.nodes)).toEqual(Object.keys(legacy.nodes));
    expect(Object.keys(rich.marks)).toEqual(Object.keys(legacy.marks));
    for(const name of ["callout","taskList","taskItem","table","tableRow","tableCell"])expect(rich.nodes[name]).toBeDefined();
    const extensions=richEditorExtensions(doc);
    expect(extensions.find(extension=>extension.name==="starterKit")?.options.undoRedo).toBe(false);
    expect(extensions.find(extension=>extension.name==="collaboration")?.options.field).toBe("prosemirror");
    doc.destroy();
  });
  it("does not initialize a missing shared document",()=>{
    const doc=new Y.Doc();expect(()=>richEditorExtensions(doc)).toThrow("migration");
    expect(doc.share.has("prosemirror")).toBe(false);doc.destroy();
  });
});
