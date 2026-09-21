import * as Y from "yjs";
import { yXmlFragmentToProsemirrorJSON } from "y-prosemirror";
import { editorDocumentSchema } from "@sorta/contracts";

// Reserved for the versioned rich-text migration; legacy notes are not implicitly converted.
export const richDocumentFragmentName = "prosemirror";

export function readRichDocument(document: Y.Doc) {
  if (!document.share.has(richDocumentFragmentName)) throw new Error("rich_document_not_initialized");
  const json = yXmlFragmentToProsemirrorJSON(document.getXmlFragment(richDocumentFragmentName));
  return editorDocumentSchema.parse(json);
}
