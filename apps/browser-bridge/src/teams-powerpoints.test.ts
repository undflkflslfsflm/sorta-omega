import { describe, expect, it } from "vitest";
import { postPresentationRelativePath, retryInvalidDownload, safeSegment } from "./teams-powerpoints.js";

describe("Teams PowerPoint path segments", () => {
  it("removes path separators without losing Norwegian names", () => {
    expect(safeSegment("Matematikk 2P / vår: prøve")).toBe("Matematikk 2P vår prøve");
    expect(safeSegment("Økonomistyring.pptx")).toBe("Økonomistyring.pptx");
  });

  it("rejects empty segments", () => {
    expect(() => safeSegment("../")).toThrow("teams_file_path_segment_invalid");
    expect(() => safeSegment("\u0000")).toThrow("teams_file_path_segment_invalid");
  });
});

describe("Teams PowerPoint download retry", () => {
  it("retries one invalid archive and returns the valid download", async () => {
    let attempts = 0;
    const result = await retryInvalidDownload(async () => {
      if (++attempts === 1) throw new Error("teams_powerpoint_archive_invalid");
      return "valid";
    });
    expect(result).toBe("valid");
    expect(attempts).toBe(2);
  });

  it("stops after a second invalid download", async () => {
    let attempts = 0;
    await expect(retryInvalidDownload(async () => {
      attempts++;
      throw new Error("teams_powerpoint_download_invalid");
    })).rejects.toThrow("teams_powerpoint_download_invalid");
    expect(attempts).toBe(2);
  });

  it("does not retry limits or changed rows", async () => {
    let attempts = 0;
    await expect(retryInvalidDownload(async () => {
      attempts++;
      throw new Error("teams_powerpoint_file_limit_exceeded:1");
    })).rejects.toThrow("teams_powerpoint_file_limit_exceeded:1");
    expect(attempts).toBe(1);
  });
});

describe("Teams post PowerPoint identity", () => {
  it("keeps Norwegian class names and stable post identity", () => {
    const first = postPresentationRelativePath("Økonomistyring", "chain", "message", "Prøve.pptx");
    expect(first).toMatch(/^Teams\/Økonomistyring\/General\/Posts\/[0-9a-f]{24}\/Prøve\.pptx$/);
    expect(postPresentationRelativePath("Økonomistyring", "chain", "message", "Prøve.pptx")).toBe(first);
    expect(postPresentationRelativePath("Økonomistyring", "chain", "message", "Prøve.pptx", 1)).toMatch(/\/2-Prøve\.pptx$/);
    expect(postPresentationRelativePath("Økonomistyring", "chain", "message", "Prøve.pptx", 0, "Kapittel 3")).toMatch(/^Teams\/Økonomistyring\/Kapittel 3\/Posts\/[0-9a-f]{24}\/Prøve\.pptx$/);
  });

  it("rejects missing identities and other file types", () => {
    expect(() => postPresentationRelativePath("Class", "", "message", "Slides.pptx")).toThrow("teams_post_powerpoint_identity_invalid");
    expect(() => postPresentationRelativePath("Class", "chain", "message", "File.docx")).toThrow("teams_post_powerpoint_name_invalid");
  });
});
