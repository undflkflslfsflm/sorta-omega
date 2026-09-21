import { describe, expect, it } from "vitest";
import { nextReviewAt } from "./flashcard-review.js";

describe("versioned flashcard review policy", () => {
  it("uses deterministic bounded intervals", () => {
    expect(nextReviewAt("2026-09-19T10:00:00.000Z", "again", 8)).toBe("2026-09-19T10:10:00.000Z");
    expect(nextReviewAt("2026-09-19T10:00:00.000Z", "good", 0)).toBe("2026-09-20T10:00:00.000Z");
    expect(nextReviewAt("2026-09-19T10:00:00.000Z", "easy", 2)).toBe("2026-10-03T10:00:00.000Z");
  });

  it("rejects invalid chronology inputs", () => {
    expect(() => nextReviewAt("not-a-date", "good", 0)).toThrow("invalid_review_input");
    expect(() => nextReviewAt("2026-09-19T10:00:00.000Z", "good", -1)).toThrow("invalid_review_input");
  });
});
