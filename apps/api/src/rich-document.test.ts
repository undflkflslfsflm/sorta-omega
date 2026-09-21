import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { readRichDocument, richDocumentFragmentName } from "./rich-document.js";

describe("shared rich-text representation", () => {
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
    expect(expected.content[0].content).toEqual([
      { type: "text", text: "Hello", marks: [{ type: "bold", attrs: {} }] },
      { type: "text", text: " world", marks: [{ type: "italic", attrs: {} }] }
    ]);
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
