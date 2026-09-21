import { createHash } from "node:crypto";

export type MinimalCalendarOccurrence = {
  id: string;
  eventId: string;
  title: string;
  startsAt: string;
  endsAt: string;
};

function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

function icsInstant(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("invalid_ics_instant");
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function foldIcsLine(line: string) {
  const chunks: string[] = [];
  let current = "";
  for (const character of line) {
    if (Buffer.byteLength(current + character, "utf8") > 75) {
      chunks.push(current);
      current = ` ${character}`;
    } else current += character;
  }
  chunks.push(current);
  return chunks.join("\r\n");
}

/** Produces an occurrence-only, UTC calendar with no notes, attendees, alarms, or private overlays. */
export function serializeMinimalCalendar(input: {
  name: string;
  generatedAt: string;
  occurrences: readonly MinimalCalendarOccurrence[];
}) {
  const stamp = icsInstant(input.generatedAt);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sorta//Private Calendar Export//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText(input.name)}`,
  ];
  for (const occurrence of [...input.occurrences].sort((a, b) => a.startsAt.localeCompare(b.startsAt) || a.id.localeCompare(b.id))) {
    const stable = createHash("sha256").update(occurrence.id).digest("hex").slice(0, 32);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${stable}@sorta.local`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${icsInstant(occurrence.startsAt)}`,
      `DTEND:${icsInstant(occurrence.endsAt)}`,
      `SUMMARY:${escapeIcsText(occurrence.title)}`,
      `X-SORTA-EVENT-ID:${escapeIcsText(occurrence.eventId)}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}

export type TarEntry = { name: string; content: Buffer };

function tarHeader(name: string, size: number, modifiedAt: Date) {
  if (!/^[\x20-\x7e]+$/.test(name) || name.length > 100 || name.startsWith("/") || name.includes("..")) throw new Error("unsafe_tar_path");
  const header = Buffer.alloc(512);
  header.write(name, 0, 100, "utf8");
  header.write("0000600\0", 100, 8, "ascii");
  header.write("0000000\0", 108, 8, "ascii");
  header.write("0000000\0", 116, 8, "ascii");
  header.write(`${size.toString(8).padStart(11, "0")}\0`, 124, 12, "ascii");
  header.write(`${Math.floor(modifiedAt.getTime() / 1000).toString(8).padStart(11, "0")}\0`, 136, 12, "ascii");
  header.fill(0x20, 148, 156);
  header.write("0", 156, 1, "ascii");
  header.write("ustar\0", 257, 6, "ascii");
  header.write("00", 263, 2, "ascii");
  header.write("sorta", 265, 5, "ascii");
  header.write("sorta", 297, 5, "ascii");
  const checksum = [...header].reduce((sum, byte) => sum + byte, 0);
  header.write(`${checksum.toString(8).padStart(6, "0")}\0 `, 148, 8, "ascii");
  return header;
}

export function buildTar(entries: readonly TarEntry[], modifiedAt = new Date(0)) {
  const chunks: Buffer[] = [];
  for (const entry of entries) {
    chunks.push(tarHeader(entry.name, entry.content.length, modifiedAt), entry.content);
    const remainder = entry.content.length % 512;
    if (remainder) chunks.push(Buffer.alloc(512 - remainder));
  }
  chunks.push(Buffer.alloc(1024));
  return Buffer.concat(chunks);
}
