import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { initializeRichDocument, readRichDocument, richDocumentFragmentName } from "./rich-document.js";

describe("shared rich-text representation", () => {
  it("retains editor-generated table defaults and alignment through migration and reload", () => {
    const input={type:"doc",content:[{type:"table",content:[{type:"tableRow",content:[
      {type:"tableHeader",attrs:{colspan:1,rowspan:1,colwidth:null,align:"center"},content:[{type:"paragraph",content:[{type:"text",text:"Header"}]}]},
      {type:"tableCell",attrs:{colspan:1,rowspan:1,colwidth:[120],align:null},content:[{type:"paragraph",content:[{type:"text",text:"Cell"}]}]}
    ]}]}]};
    const doc=new Y.Doc();initializeRichDocument(doc,input);
    const reloaded=new Y.Doc();Y.applyUpdate(reloaded,Y.encodeStateAsUpdate(doc));
    expect(readRichDocument(reloaded)).toEqual(input);
    doc.destroy();reloaded.destroy();
  });
  it("initializes formatted blocks once and preserves adjacent marked text order", () => {
    const document = new Y.Doc();
    const input = { type:"doc", content:[
      {type:"heading",attrs:{level:2},content:[{type:"text",text:"First",marks:[{type:"bold",attrs:{}}]},{type:"text",text:" second",marks:[{type:"italic",attrs:{}}]}]},
      {type:"callout",attrs:{kind:"warning"},content:[{type:"paragraph",content:[{type:"text",text:"Keep this"}]}]},
      {type:"taskList",content:[{type:"taskItem",attrs:{checked:true},content:[{type:"paragraph",content:[{type:"text",text:"Done"}]}]}]}
    ]};
    expect(initializeRichDocument(document,input)).toBe(true);
    expect(readRichDocument(document)).toEqual(input);
    const before=Y.encodeStateAsUpdate(document);
    expect(initializeRichDocument(document,{type:"doc",content:[{type:"paragraph"}]})).toBe(false);
    expect(Y.encodeStateAsUpdate(document)).toEqual(before);
    const restored=new Y.Doc();Y.applyUpdate(restored,before);
    expect(readRichDocument(restored)).toEqual(input);
    document.destroy();restored.destroy();
  });
  it("merges concurrent formatted text without dropping marks", () => {
    const base = new Y.Doc();
    const paragraph = new Y.XmlElement("paragraph");
    const text = new Y.XmlText();
    paragraph.insert(0, [text]);
    base.getXmlFragment(richDocumentFragmentName).insert(0, [paragraph]);
    text.insert(0, "Hello");
    const initial = Y.encodeStateAsUpdate(base);
    const left = new Y.Doc(); const right = new Y.Doc();
    Y.applyUpdate(left, initial); Y.applyUpdate(right, initial);
    const leftText = (left.getXmlFragment(richDocumentFragmentName).get(0) as Y.XmlElement).get(0) as Y.XmlText;
    const rightText = (right.getXmlFragment(richDocumentFragmentName).get(0) as Y.XmlElement).get(0) as Y.XmlText;
    leftText.format(0, 5, { bold: {} });
    rightText.insert(5, " world", { italic: {} });
    const a = Y.encodeStateAsUpdate(left); const b = Y.encodeStateAsUpdate(right);
    Y.applyUpdate(left, b); Y.applyUpdate(right, a);
    const expected = readRichDocument(left);
    expect(readRichDocument(right)).toEqual(expected);
    const inline = expected.content[0].content!;
    expect(inline.map(node => node.text).join("")).toBe("Hello world");
    expect(inline[0]).toMatchObject({ text: "Hello", marks: [{ type: "bold", attrs: {} }] });
    // Formatting may extend across the concurrent boundary insertion depending
    // on client ordering, but both replicas must preserve the italic mark.
    expect(inline[inline.length - 1].marks).toContainEqual({ type: "italic", attrs: {} });
    Y.applyUpdate(left, b);
    expect(readRichDocument(left)).toEqual(expected);
    base.destroy(); left.destroy(); right.destroy();
  });
  it("does not silently initialize a legacy document", () => {
    const document = new Y.Doc();
    document.getText("content").insert(0, "Legacy");
    expect(() => readRichDocument(document)).toThrow("rich_document_not_initialized");
    expect(document.share.has(richDocumentFragmentName)).toBe(false);
    document.destroy();
  });
});
