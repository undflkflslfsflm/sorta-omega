import path from "node:path";

export const UPLOAD_PART_SIZE = 4 * 1024 * 1024;
export const MAX_UPLOAD_BYTES = 2_147_483_648;
const canonicalId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const canonicalHash = /^[0-9a-f]{64}$/;

export type PartRange = { start: number; end: number; total: number };
export type ResponseRange = { start: number; end: number };

export function parseUploadPartRange(value: string | undefined, total: number, partNumber: number, bodyLength: number, partSize = UPLOAD_PART_SIZE): PartRange | null {
  const match = value?.match(/^bytes (\d+)-(\d+)\/(\d+)$/);
  if (!match) return null;
  const start = Number(match[1]), end = Number(match[2]), declaredTotal = Number(match[3]);
  if (![start, end, declaredTotal].every(Number.isSafeInteger) || declaredTotal !== total || start !== (partNumber - 1) * partSize) return null;
  if (start < 0 || end < start || end >= total || end - start + 1 !== bodyLength || bodyLength < 1 || bodyLength > partSize) return null;
  if (end < total - 1 && bodyLength !== partSize) return null;
  if (partNumber > Math.ceil(total / partSize)) return null;
  return { start, end, total };
}

export function parseResponseRange(value: string | undefined, total: number): ResponseRange | null | "invalid" {
  if (!value) return null;
  const match = value.match(/^bytes=(\d*)-(\d*)$/);
  if (!match || (!match[1] && !match[2]) || total < 1) return "invalid";
  let start: number, end: number;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix < 1) return "invalid";
    start = Math.max(0, total - suffix); end = total - 1;
  } else {
    start = Number(match[1]); end = match[2] ? Number(match[2]) : total - 1;
  }
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || start >= total) return "invalid";
  return { start, end: Math.min(end, total - 1) };
}

export function uploadDirectory(root: string, vaultId: string, uploadId: string) {
  if (!canonicalId.test(vaultId) || !canonicalId.test(uploadId)) throw new Error("invalid_storage_identifier");
  return path.join(path.resolve(root), "uploads", vaultId, uploadId);
}

export function uploadPartPath(root: string, vaultId: string, uploadId: string, partNumber: number) {
  if (!Number.isInteger(partNumber) || partNumber < 1 || partNumber > 512) throw new Error("invalid_part_number");
  return path.join(uploadDirectory(root, vaultId, uploadId), `${partNumber}.part`);
}

export function blobPath(root: string, sha256: string) {
  if (!canonicalHash.test(sha256)) throw new Error("invalid_blob_hash");
  return path.join(path.resolve(root), "blobs", sha256.slice(0, 2), sha256);
}

export function responseMediaType(mediaType: string) {
  if (["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mediaType)) return mediaType;
  if (["text/plain", "text/markdown", "text/csv"].includes(mediaType)) return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

export function contentDisposition(filename: string, download: boolean, mediaType: string) {
  const inlineSafe = responseMediaType(mediaType) !== "application/octet-stream";
  const mode = download || !inlineSafe ? "attachment" : "inline";
  const fallback = filename.normalize("NFKD").replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_").slice(0, 120) || "download";
  return `${mode}; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(filename).replace(/'/g, "%27")}`;
}
