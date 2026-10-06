import JSZip from "jszip";
import type { Readable } from "node:stream";

type ExtractionResult = { text: string | null; complete: boolean; reason: string | null };
const maxCharacters = 1_000_000;
const maxSheets = 100;
const maxCells = 100_000;

function decodeXml(value: string): string {
  return value.replace(/&(?:#(x[0-9a-f]+|\d+)|amp|lt|gt|quot|apos);/gi, (entity, numeric: string | undefined) => {
    if (numeric) {
      const point = numeric[0]?.toLowerCase() === "x" ? Number.parseInt(numeric.slice(1), 16) : Number.parseInt(numeric, 10);
      return Number.isInteger(point) && point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
    }
    return ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'" } as Record<string, string>)[entity.toLowerCase()] ?? entity;
  });
}

function attribute(tag: string, name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const value = new RegExp(`(?:^|\\s)${escaped}="([^"]*)"`).exec(tag)?.[1];
  return value === undefined ? null : decodeXml(value);
}

async function boundedText(file: JSZip.JSZipObject, limit: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let length = 0;
    const stream = file.nodeStream("nodebuffer") as Readable;
    stream.on("data", (chunk: Buffer) => {
      length += chunk.length;
      if (length > limit) { stream.destroy(new Error("xlsx_xml_limit")); return; }
      chunks.push(chunk);
    });
    stream.once("error", reject);
    stream.once("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

function textNodes(xml: string): string {
  return [...xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map(match => decodeXml(match[1])).join("");
}

export async function extractXlsxText(bytes: Uint8Array): Promise<ExtractionResult> {
  const archive = await JSZip.loadAsync(Buffer.from(bytes), { checkCRC32: false, createFolders: false });
  const names = Object.keys(archive.files);
  if (names.length > 5_000 || !archive.file("xl/workbook.xml")) return { text: null, complete: false, reason: "document_limit_or_invalid_workbook" };
  let complete = true;
  if (names.some(name => /^xl\/(?:comments\d*\.xml|threadedComments\/|tables\/|pivotTables\/|externalLinks\/|connections\.xml)/i.test(name))) complete = false;
  const shared: string[] = [];
  const sharedFile = archive.file("xl/sharedStrings.xml");
  if (sharedFile) {
    try {
      const xml = await boundedText(sharedFile, 16_000_000);
      for (const item of xml.matchAll(/<si(?:\s[^>]*)?>([\s\S]*?)<\/si>/g)) {
        if (shared.length >= maxCells) { complete = false; break; }
        shared.push(textNodes(item[1]));
      }
    } catch { complete = false; }
  }
  const workbook = await boundedText(archive.file("xl/workbook.xml")!, 2_000_000).catch(() => "");
  const relationFile = archive.file("xl/_rels/workbook.xml.rels");
  const relations = relationFile ? await boundedText(relationFile, 2_000_000).catch(() => "") : "";
  if (!workbook || !relations) complete = false;
  const sheetNames = new Map<string, string>();
  const targets = new Map<string, string>();
  for (const tag of relations.match(/<Relationship\b[^>]*\/?\s*>/g) ?? []) {
    const id = attribute(tag, "Id"), target = attribute(tag, "Target");
    if (id && target) targets.set(id, target);
  }
  for (const tag of workbook.match(/<sheet\b[^>]*\/?\s*>/g) ?? []) {
    const id = attribute(tag, "r:id"), name = attribute(tag, "name"), target = id ? targets.get(id) : null;
    if (!name || !target) { complete = false; continue; }
    const normalized = target.replace(/^\/?xl\//, "").replace(/^\/?/, "xl/");
    if (/^xl\/worksheets\/[^/]+\.xml$/.test(normalized)) sheetNames.set(normalized, name);
    else complete = false;
  }
  const sheets = names.filter(name => /^xl\/worksheets\/[^/]+\.xml$/.test(name)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (sheets.length > maxSheets) complete = false;
  const lines: string[] = [];
  let cells = 0, textCells = 0, length = 0;
  for (const [index, name] of sheets.slice(0, maxSheets).entries()) {
    const heading = `Sheet ${index + 1}: ${sheetNames.get(name) ?? name.split("/").at(-1)}`;
    if (length + heading.length > maxCharacters) { complete = false; break; }
    lines.push(heading); length += heading.length + 1;
    let xml: string;
    try { xml = await boundedText(archive.file(name)!, 8_000_000); }
    catch { complete = false; continue; }
    if (/<hyperlink\b|<drawing\b|<legacyDrawing\b/.test(xml)) complete = false;
    for (const cell of xml.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      cells++;
      if (cells > maxCells) { complete = false; break; }
      const address = attribute(cell[1], "r"), type = attribute(cell[1], "t"), body = cell[2] ?? "";
      if (!address || !/^[A-Z]{1,3}[1-9]\d{0,6}$/.test(address)) { complete = false; continue; }
      const raw = /<v(?:\s[^>]*)?>([\s\S]*?)<\/v>/.exec(body)?.[1];
      const formula = /<f(?:\s[^>]*)?>([\s\S]*?)<\/f>/.exec(body)?.[1];
      let value = type === "inlineStr" ? textNodes(body) : raw === undefined ? "" : decodeXml(raw);
      if (type === "s") {
        const position = Number(value);
        if (!Number.isSafeInteger(position) || position < 0 || position >= shared.length) { complete = false; continue; }
        value = shared[position];
      } else if (type === "b" && value) value = value === "1" ? "TRUE" : "FALSE";
      if (!type && attribute(cell[1], "s") !== null && /^-?\d+(?:\.\d+)?$/.test(value)) complete = false;
      if (formula) {
        const expression = decodeXml(formula);
        value = value ? `${value} (saved formula result; =${expression})` : `Formula =${expression} (saved result unavailable)`;
        if (raw === undefined) complete = false;
      }
      if (!value.trim()) continue;
      const line = `${address}: ${value.trim().replace(/\s+/g, " ")}`;
      if (length + line.length + 1 > maxCharacters) { complete = false; break; }
      lines.push(line); textCells++; length += line.length + 1;
    }
    if (cells > maxCells || length >= maxCharacters) break;
    lines.push(""); length++;
  }
  const text = textCells ? lines.join("\n").trim() : "";
  return text ? { text, complete, reason: complete ? null : "workbook_feature_or_text_limit" } : { text: null, complete: false, reason: "no_embedded_text" };
}
