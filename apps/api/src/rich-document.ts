import * as Y from "yjs";
import { yXmlFragmentToProsemirrorJSON } from "y-prosemirror";
import { editorDocumentSchema, type EditorNodeInput } from "@sorta/contracts";

// Reserved for the versioned rich-text migration; legacy notes are not implicitly converted.
export const richDocumentFragmentName = "prosemirror";

function sharedChildren(nodes: EditorNodeInput[]): Array<Y.XmlElement<any> | Y.XmlText> {
  const children: Array<Y.XmlElement<any> | Y.XmlText> = [];
  let text: Y.XmlText | null = null;
  let textOffset = 0;
  for (const node of nodes) {
    if (node.type === "text") {
      if (!text) { text = new Y.XmlText(); textOffset = 0; children.push(text); }
      // Preliminarily constructed Y types do not expose their integrated length yet.
      const attributes = Object.fromEntries((node.marks ?? []).map(mark => [mark.type, mark.attrs ?? {}]));
      text.applyDelta([...(textOffset ? [{ retain: textOffset }] : []), { insert: node.text ?? "", attributes }]);
      textOffset += (node.text ?? "").length;
    } else {
      text = null;
      // ProseMirror attributes include numbers, booleans and arrays, unlike DOM attributes.
      // Their allowed shapes have already been checked by editorDocumentSchema.
      const element = new Y.XmlElement<any>(node.type);
      for (const [key, value] of Object.entries(node.attrs ?? {})) element.setAttribute(key, value);
      element.insert(0, sharedChildren(node.content ?? []));
      children.push(element);
    }
  }
  return children;
}

export function initializeRichDocument(document: Y.Doc, input: unknown): boolean {
  if (document.share.has(richDocumentFragmentName)) return false;
  const editor = editorDocumentSchema.parse(input);
  const children = sharedChildren(editor.content);
  document.transact(() => {
    document.getXmlFragment(richDocumentFragmentName).insert(0, children);
  }, "rich-document-migration");
  return true;
}

export function readRichDocument(document: Y.Doc) {
  if (!document.share.has(richDocumentFragmentName)) throw new Error("rich_document_not_initialized");
  const json = yXmlFragmentToProsemirrorJSON(document.getXmlFragment(richDocumentFragmentName));
  return editorDocumentSchema.parse(json);
}

// Whole-document owner edits require the caller's existing revision fence.
export function replaceRichDocument(document: Y.Doc, input: unknown) {
  if (!document.share.has(richDocumentFragmentName)) throw new Error("rich_document_not_initialized");
  const editor = editorDocumentSchema.parse(input);
  const children = sharedChildren(editor.content);
  const fragment = document.getXmlFragment(richDocumentFragmentName);
  document.transact(() => {
    fragment.delete(0, fragment.length);
    fragment.insert(0, children);
  }, "owner");
}
