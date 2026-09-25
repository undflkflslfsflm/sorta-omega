import { parentPort, workerData } from "node:worker_threads";

type ExtractionInput = { bytes: Uint8Array; kind: "pdf" | "docx" };
type ExtractionResult = { text: string | null; complete: boolean; reason: string | null };

const maxCharacters = 1_000_000;

export async function extractRichDocument(input: ExtractionInput): Promise<ExtractionResult> {
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
