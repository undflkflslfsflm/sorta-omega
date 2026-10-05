import { describe, expect, it } from "vitest";
import { safeSegment } from "./teams-powerpoints.js";

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
