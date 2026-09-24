import { describe, expect, it } from "vitest";
import { captureBatchTitle, captureFileSelection, MAX_BROWSER_FILE_BYTES, MAX_CAPTURE_FILES, uploadCaptureBatch } from "./capture-batch";

describe("file dump selection", () => {
  it("accepts a batch and rejects oversized or empty files without dropping valid ones", () => {
    const result = captureFileSelection([{ name: "notes.pdf", size: 1024 }, { name: "empty.txt", size: 0 }, { name: "video.mp4", size: MAX_BROWSER_FILE_BYTES + 1 }]);
    expect(result.accepted.map(item => item.name)).toEqual(["notes.pdf"]);
    expect(result.rejected).toEqual([{ name: "empty.txt", reason: "empty" }, { name: "video.mp4", reason: "too_large" }]);
  });

  it("fails before upload when the server's attachment count limit would be exceeded", () => {
    expect(() => captureFileSelection(Array.from({ length: MAX_CAPTURE_FILES + 1 }, (_, index) => ({ name: `${index}.txt`, size: 1 })))).toThrow("capture_batch_file_limit");
  });

  it("uses a readable title only for multi-file captures", () => {
    expect(captureBatchTitle(["a.pdf"])).toBeUndefined();
    expect(captureBatchTitle(["a.pdf", "b.pdf"])).toMatch(/^2 files · \d{2}\.\d{2}\.\d{4}$/);
  });

  it("uploads files in order and reports a failed file without dropping the others", async () => {
    const seen: string[] = [];
    const result = await uploadCaptureBatch([{ name: "a" }, { name: "b" }, { name: "c" }], async file => {
      seen.push(file.name);
      if (file.name === "b") throw new Error("network failure");
      return `stored:${file.name}`;
    });
    expect(seen).toEqual(["a", "b", "c"]);
    expect(result).toEqual({ uploaded: ["stored:a", "stored:c"], failed: ["b"] });
  });
});
