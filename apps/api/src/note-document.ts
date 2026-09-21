import { editorDocumentSchema, type EditorMarkInput, type EditorNodeInput } from "@sorta/contracts";
import * as Y from "yjs";

const textName = "content";
const editorMapName = "editor";
const editorDocumentKey = "document";
type EditorDocument = ReturnType<typeof editorDocumentSchema.parse>;

function plainInline(node: EditorNodeInput): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  return (node.content ?? []).map(plainInline).join("");
}

function plainBlock(node: EditorNodeInput): string {
  const content = (node.content ?? []).map(plainBlock).join("");
  switch (node.type) {
    case "text": return node.text ?? "";
    case "hardBreak": return "\n";
    case "paragraph": case "heading": case "codeBlock": case "blockquote": case "callout": return `${content}\n\n`;
    case "listItem": return `- ${content.trim()}\n`;
    case "taskItem": return `- [${node.attrs?.checked ? "x" : " "}] ${content.trim()}\n`;
    case "tableCell": case "tableHeader": return `${content.trim()}\t`;
    case "tableRow": return `${content.trimEnd()}\n`;
    case "horizontalRule": return "---\n\n";
    default: return content;
  }
}

function markdownText(text: string, marks: EditorMarkInput[] = []): string {
  return marks.reduce((value, mark) => {
    if (mark.type === "bold") return `**${value}**`;
    if (mark.type === "italic") return `_${value}_`;
    if (mark.type === "strike") return `~~${value}~~`;
    if (mark.type === "code") return `\`${value}\``;
    if (mark.type === "link") return `[${value}](${String(mark.attrs?.href ?? "")})`;
    return value;
  }, text);
}

function markdownNode(node: EditorNodeInput): string {
  if (node.type === "text") return markdownText(node.text ?? "", node.marks);
  if (node.type === "hardBreak") return "  \n";
  const children = node.content ?? [];
  const content = children.map(markdownNode).join("");
  switch (node.type) {
    case "paragraph": return `${content}\n\n`;
    case "heading": return `${"#".repeat(Number(node.attrs?.level ?? 1))} ${content}\n\n`;
    case "blockquote": return `${content.trim().split("\n").map(line => `> ${line}`).join("\n")}\n\n`;
    case "callout": {
      const kind = String(node.attrs?.kind ?? "info").toUpperCase();
      return `> [!${kind}]\n${content.trim().split("\n").map(line => `> ${line}`).join("\n")}\n\n`;
    }
    case "codeBlock": return `\`\`\`${String(node.attrs?.language ?? "")}\n${plainInline(node)}\n\`\`\`\n\n`;
    case "listItem": return `- ${content.trim()}\n`;
    case "taskItem": return `- [${node.attrs?.checked ? "x" : " "}] ${content.trim()}\n`;
    case "orderedList": return `${children.map((child, childIndex) => `${childIndex + Number(node.attrs?.start ?? 1)}. ${markdownNode(child).replace(/^[-*]\s*/, "").trim()}\n`).join("")}\n`;
    case "bulletList": case "taskList": return `${content}\n`;
    case "horizontalRule": return "---\n\n";
    case "tableCell": case "tableHeader": return ` ${content.trim()} |`;
    case "tableRow": return `|${content}\n`;
    case "table": return `${content}\n`;
    default: return content;
  }
}

export function editorDocumentToText(document: EditorDocument): string {
  return document.content.map(plainBlock).join("").replace(/\n{3,}/g, "\n\n").trimEnd();
}

export function editorDocumentToMarkdown(document: EditorDocument): string {
  return document.content.map(markdownNode).join("").replace(/\n{3,}/g, "\n\n").trimEnd();
}

export function toEditorJson(text: string): EditorDocument {
  const content = text.length ? text.split(/\n{2,}/).map(block => {
    const lines = block.split("\n");
    const inline: EditorNodeInput[] = [];
    lines.forEach((line, index) => {
      if (line) inline.push({ type: "text", text: line });
      if (index < lines.length - 1) inline.push({ type: "hardBreak" });
    });
    return { type: "paragraph" as const, content: inline };
  }) : [{ type: "paragraph" as const }];
  return editorDocumentSchema.parse({ type: "doc", content });
}

function applyEditorDocument(document: Y.Doc, editor: EditorDocument, text: string) {
  const sharedText = document.getText(textName);
  document.transact(() => {
    sharedText.delete(0, sharedText.length);
    sharedText.insert(0, text);
    document.getMap<string>(editorMapName).set(editorDocumentKey, JSON.stringify(editor));
  }, "owner");
}

function loadDocument(state: Uint8Array | Buffer | null, fallback = "") {
  const document = new Y.Doc();
  if (state?.length) Y.applyUpdate(document, new Uint8Array(state));
  else if (fallback) applyEditorDocument(document, toEditorJson(fallback), fallback);
  return document;
}

export function createDocumentState(text: string): Buffer {
  const document = new Y.Doc();
  applyEditorDocument(document, toEditorJson(text), text);
  return Buffer.from(Y.encodeStateAsUpdate(document));
}

export function readDocumentText(state: Uint8Array | Buffer | null, fallback = ""): string {
  if (!state?.length) return fallback;
  const document = loadDocument(state);
  return document.getText(textName).toString();
}

export function readEditorDocument(state: Uint8Array | Buffer | null, fallback = ""): EditorDocument {
  if (!state?.length) return toEditorJson(fallback);
  const document = loadDocument(state);
  const stored = document.getMap<string>(editorMapName).get(editorDocumentKey);
  if (stored) {
    try {
      const parsed = editorDocumentSchema.safeParse(JSON.parse(stored));
      if (parsed.success) return parsed.data;
    } catch { /* fall through to the legacy text projection */ }
  }
  return toEditorJson(document.getText(textName).toString());
}

export function replaceEditorDocument(state: Uint8Array | Buffer | null, input: unknown, fallback = ""): { state: Buffer; text: string; document: EditorDocument } {
  const editor = editorDocumentSchema.parse(input);
  const text = editorDocumentToText(editor);
  const document = loadDocument(state, fallback);
  applyEditorDocument(document, editor, text);
  return { state: Buffer.from(Y.encodeStateAsUpdate(document)), text, document: editor };
}

export function replaceDocumentText(state: Uint8Array | Buffer | null, text: string, fallback = ""): Buffer {
  return replaceEditorDocument(state, toEditorJson(text), fallback).state;
}

export function appendDocumentText(state: Uint8Array | Buffer | null, markdown: string, fallback = ""): { state: Buffer; text: string } {
  const current = readEditorDocument(state, fallback);
  const appended = toEditorJson(markdown);
  const editor = editorDocumentSchema.parse({ type: "doc", content: [...current.content, ...appended.content] });
  const changed = replaceEditorDocument(state, editor, fallback);
  return { state: changed.state, text: changed.text };
}

export function mergeDocumentUpdate(state: Uint8Array | Buffer | null, updateBase64: string, fallback = ""): { state: Buffer; text: string; document: EditorDocument } {
  const document = loadDocument(state, fallback);
  Y.applyUpdate(document, new Uint8Array(Buffer.from(updateBase64, "base64")), "offline-device");
  const text = document.getText(textName).toString();
  if (text.length > 200_000) throw new Error("merged_document_text_too_large");
  const stored = document.getMap<string>(editorMapName).get(editorDocumentKey);
  let editor = stored ? editorDocumentSchema.parse(JSON.parse(stored)) : toEditorJson(text);
  if (editorDocumentToText(editor) !== text) {
    editor = toEditorJson(text);
    document.getMap<string>(editorMapName).set(editorDocumentKey, JSON.stringify(editor));
  }
  const mergedState = Buffer.from(Y.encodeStateAsUpdate(document));
  if (mergedState.length > 2_000_000) throw new Error("merged_document_too_large");
  return { state: mergedState, text, document: editor };
}
