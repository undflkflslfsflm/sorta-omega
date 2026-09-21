import path from "node:path";
import { describe, expect, it } from "vitest";
import { blobPath, contentDisposition, parseResponseRange, parseUploadPartRange, responseMediaType, uploadPartPath, UPLOAD_PART_SIZE } from "./upload-storage.js";
import { completeUploadSchema, createUploadSchema } from "@sorta/contracts";

describe("immutable upload storage", () => {
  it("bounds file metadata, media types, total size, and completion manifests", () => {
    expect(createUploadSchema.safeParse({ filename: "notes.pdf", mediaType: "application/pdf", byteLength: 123, sha256: "a".repeat(64) }).success).toBe(true);
    expect(createUploadSchema.safeParse({ filename: "page.html", mediaType: "text/html", byteLength: 123, sha256: "a".repeat(64) }).success).toBe(false);
    expect(createUploadSchema.safeParse({ filename: "bad\r\nname.txt", mediaType: "text/plain", byteLength: 1, sha256: "a".repeat(64) }).success).toBe(false);
    expect(completeUploadSchema.safeParse({ sha256: "a".repeat(64), partCount: 513 }).success).toBe(false);
  });
  it("accepts only exact non-overlapping numbered part ranges", () => {
    const total = UPLOAD_PART_SIZE + 3;
    expect(parseUploadPartRange(`bytes 0-${UPLOAD_PART_SIZE - 1}/${total}`, total, 1, UPLOAD_PART_SIZE)).toEqual({ start: 0, end: UPLOAD_PART_SIZE - 1, total });
    expect(parseUploadPartRange(`bytes ${UPLOAD_PART_SIZE}-${total - 1}/${total}`, total, 2, 3)).toEqual({ start: UPLOAD_PART_SIZE, end: total - 1, total });
    expect(parseUploadPartRange(`bytes 1-${UPLOAD_PART_SIZE}/${total}`, total, 1, UPLOAD_PART_SIZE)).toBeNull();
    expect(parseUploadPartRange(`bytes 0-2/${total}`, total, 1, 3)).toBeNull();
  });

  it("parses bounded single download ranges", () => {
    expect(parseResponseRange(undefined, 100)).toBeNull();
    expect(parseResponseRange("bytes=10-19", 100)).toEqual({ start: 10, end: 19 });
    expect(parseResponseRange("bytes=-10", 100)).toEqual({ start: 90, end: 99 });
    expect(parseResponseRange("bytes=90-999", 100)).toEqual({ start: 90, end: 99 });
    expect(parseResponseRange("bytes=101-", 100)).toBe("invalid");
    expect(parseResponseRange("bytes=0-1,4-5", 100)).toBe("invalid");
  });

  it("derives paths only from validated IDs and hashes", () => {
    const vault = "00000000-0000-4000-8000-000000000123", upload = "00000000-0000-4000-8000-000000000124";
    expect(uploadPartPath("storage", vault, upload, 1)).toBe(path.resolve("storage", "uploads", vault, upload, "1.part"));
    expect(() => uploadPartPath("storage", "../escape", upload, 1)).toThrow("invalid_storage_identifier");
    expect(blobPath("storage", "a".repeat(64))).toBe(path.resolve("storage", "blobs", "aa", "a".repeat(64)));
  });

  it("forces active or unknown formats to download with nosniff-compatible types", () => {
    expect(responseMediaType("text/html")).toBe("application/octet-stream");
    expect(contentDisposition("page.html", false, "text/html")).toContain("attachment");
    expect(contentDisposition("photo.jpg", false, "image/jpeg")).toContain("inline");
    expect(contentDisposition("résumé.pdf", true, "application/pdf")).not.toContain("\r");
  });
});
