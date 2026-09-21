import { describe, expect, it } from "vitest";
import { buildExcerpt } from "./search.js";

describe("lexical result excerpts", () => {
  it("centers a bounded excerpt around a matching term", () => {
    const text = `${"intro ".repeat(50)}economics book promise ${"tail ".repeat(50)}`;
    const excerpt = buildExcerpt(text, "economics", 90);
    expect(excerpt).toContain("economics");
    expect(excerpt.length).toBeLessThanOrEqual(92);
  });

  it("never injects search-result markup", () => {
    expect(buildExcerpt("<script>alert(1)</script> source", "source")).toBe("<script>alert(1)</script> source");
  });
});
