import { Worker } from "node:worker_threads";

export type DocumentText = { text: string | null; complete: boolean; reason: string | null };

const unavailable = (reason: string): DocumentText => ({ text: null, complete: false, reason });
const maxTextBytes = 2_000_000;
const maxRichDocumentBytes = 10_000_000;

function plainText(bytes: Uint8Array, mediaType: string): DocumentText {
  if (bytes.byteLength > maxTextBytes) return unavailable("text_limit");
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    if (text.includes("\0")) return unavailable("invalid_text");
    const clean = mediaType === "text/html"
      ? text.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
      : text.trim();
    return clean ? { text: clean, complete: true, reason: null } : unavailable("no_embedded_text");
  } catch { return unavailable("invalid_text"); }
}

function richKind(filename: string, mediaType: string): "pdf" | "docx" | null {
  const lowerName = filename.toLowerCase();
  if (mediaType === "application/pdf" || lowerName.endsWith(".pdf")) return "pdf";
  if (mediaType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || lowerName.endsWith(".docx")) return "docx";
  return null;
}

export async function extractDocumentText(bytes: Uint8Array, filename: string, rawMediaType: string): Promise<DocumentText> {
  const mediaType = rawMediaType.split(";", 1)[0].trim().toLowerCase();
  if (mediaType.startsWith("text/") || ["application/json", "application/xml", "application/javascript"].includes(mediaType)) return plainText(bytes, mediaType);
  const kind = richKind(filename, mediaType);
  if (!kind) return unavailable("unsupported_format");
  if (bytes.byteLength > maxRichDocumentBytes) return unavailable("document_limit");
  if (kind === "pdf" && !(bytes[0] === 37 && bytes[1] === 80 && bytes[2] === 68 && bytes[3] === 70)) return unavailable("invalid_document");
  if (kind === "docx" && !(bytes[0] === 80 && bytes[1] === 75)) return unavailable("invalid_document");

  const extension = import.meta.url.endsWith(".ts") ? ".ts" : ".js";
  const worker = new Worker(new URL(`./document-text-worker${extension}`, import.meta.url), {
    workerData: { bytes, kind },
    execArgv: extension === ".ts" ? ["--import", "tsx"] : [],
    resourceLimits: { maxOldGenerationSizeMb: 384, maxYoungGenerationSizeMb: 32, stackSizeMb: 4 }
  });
  return new Promise<DocumentText>(resolve => {
    let settled = false;
    const finish = (result: DocumentText) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      void worker.terminate();
      resolve(result);
    };
    const timer = setTimeout(() => finish(unavailable("extraction_timeout")), 15_000);
    worker.once("message", (result: DocumentText) => finish(result));
    worker.once("error", () => finish(unavailable("extraction_failed")));
    worker.once("exit", () => finish(unavailable("extraction_failed")));
  });
}
