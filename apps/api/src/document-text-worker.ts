import { parentPort, workerData } from "node:worker_threads";
import JSZip from "jszip";
import type { Readable } from "node:stream";

type ExtractionInput = { bytes: Uint8Array; kind: "pdf" | "docx" | "pptx" };
type ExtractionResult = { text: string | null; complete: boolean; reason: string | null };

const maxCharacters = 1_000_000;

function xmlText(value: string) {
  return value.replace(/&(?:#(x[0-9a-f]+|\d+)|amp|lt|gt|quot|apos);/gi, (entity, number: string | undefined) => {
    if (number) {
      const code = number[0]?.toLowerCase() === "x" ? Number.parseInt(number.slice(1), 16) : Number.parseInt(number, 10);
      return Number.isInteger(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
    }
    return ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'" } as Record<string, string>)[entity.toLowerCase()] ?? entity;
  });
}

function slideText(xml: string) {
  const paragraphs: string[] = [];
  for (const paragraph of xml.matchAll(/<a:p(?:\s[^>]*)?>([\s\S]*?)<\/a:p>/g)) {
    const pieces = [...paragraph[1].matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>|<a:br\s*\/?\s*>/g)]
      .map(match => match[1] === undefined ? "\n" : xmlText(match[1]));
    const line = pieces.join("").trim();
    if (line) paragraphs.push(line);
  }
  return paragraphs.join("\n");
}

async function boundedZipText(file: JSZip.JSZipObject, maxBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let length = 0;
    const stream = file.nodeStream("nodebuffer") as Readable;
    stream.on("data", (chunk: Buffer) => {
      length += chunk.length;
      if (length > maxBytes) { stream.destroy(new Error("pptx_xml_limit")); return; }
      chunks.push(chunk);
    });
    stream.once("error", reject);
    stream.once("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

async function extractPptx(bytes: Uint8Array): Promise<ExtractionResult> {
  const archive = await JSZip.loadAsync(Buffer.from(bytes), { checkCRC32: false, createFolders: false });
  const names = Object.keys(archive.files);
  if (names.length > 5_000) return { text: null, complete: false, reason: "document_limit" };
  const kinds = [
    { pattern: /^ppt\/slides\/slide([1-9]\d*)\.xml$/, label: "Slide", limit: 200 },
    { pattern: /^ppt\/notesSlides\/notesSlide([1-9]\d*)\.xml$/, label: "Speaker notes", limit: 200 }
  ];
  const parts: string[] = [];
  let length = 0;
  let complete = true;
  for (const kind of kinds) {
    const entries = names.flatMap(name => {
      const match = kind.pattern.exec(name);
      return match ? [{ name, number: Number(match[1]) }] : [];
    }).sort((a, b) => a.number - b.number);
    if (entries.length > kind.limit) complete = false;
    for (const entry of entries.slice(0, kind.limit)) {
      const file = archive.file(entry.name);
      if (!file) continue;
      let content: string;
      try { content = await boundedZipText(file, 2_000_000); }
      catch { complete = false; continue; }
      const text = slideText(content);
      if (!text) continue;
      const block = `${kind.label} ${entry.number}\n${text}`;
      if (length + block.length > maxCharacters) { complete = false; break; }
      parts.push(block);
      length += block.length + 2;
    }
  }
  const text = parts.join("\n\n").trim();
  return text ? { text, complete, reason: complete ? null : "slide_or_text_limit" } : { text: null, complete: false, reason: "no_embedded_text" };
}

export async function extractRichDocument(input: ExtractionInput): Promise<ExtractionResult> {
  if (input.kind === "pptx") return extractPptx(input.bytes);
  if (input.kind === "docx") {
    const mammoth = (await import("mammoth")).default;
    const result = await mammoth.extractRawText({ buffer: Buffer.from(input.bytes) });
    const text = result.value.trim();
    if (!text) return { text: null, complete: false, reason: "no_embedded_text" };
    return { text: text.slice(0, maxCharacters), complete: text.length <= maxCharacters, reason: text.length > maxCharacters ? "text_limit" : null };
  }
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loading = getDocument({ data: new Uint8Array(input.bytes), disableAutoFetch: true, disableStream: true, useSystemFonts: false });
  try {
    const document = await loading.promise;
    const parts: string[] = [];
    let length = 0;
    const pageLimit = Math.min(document.numPages, 100);
    for (let index = 1; index <= pageLimit; index++) {
      const page = await document.getPage(index);
      const content = await page.getTextContent();
      const line = content.items.map(item => "str" in item ? item.str : "").filter(Boolean).join(" ");
      length += line.length + 1;
      parts.push(line);
      page.cleanup();
      if (length > maxCharacters) break;
    }
    const text = parts.join("\n").trim();
    if (!text) return { text: null, complete: false, reason: "no_embedded_text" };
    const complete = document.numPages <= pageLimit && length <= maxCharacters;
    return { text: text.slice(0, maxCharacters), complete, reason: complete ? null : "page_or_text_limit" };
  } finally { await loading.destroy(); }
}

const port = parentPort;
if (port) {
  void extractRichDocument(workerData as ExtractionInput)
    .then(result => port.postMessage(result))
    .catch(() => port.postMessage({ text: null, complete: false, reason: "parse_failed" } satisfies ExtractionResult));
}
