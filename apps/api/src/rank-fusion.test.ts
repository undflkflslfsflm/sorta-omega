import { describe, expect, it } from "vitest";
import { reciprocalRankFusion } from "./rank-fusion.js";

describe("reciprocal rank fusion", () => {
  it("boosts agreement and keeps one result per typed record", () => {
    const sharedLexical = { kind: "note", id: "one", searchable_text: "lexical" };
    const sharedSemantic = { kind: "note", id: "one", searchable_text: "best semantic passage" };
    const results = reciprocalRankFusion(
      [sharedLexical, { kind: "task", id: "two", searchable_text: "task" }],
      [sharedSemantic, { kind: "note", id: "three", searchable_text: "other" }], 10
    );
    expect(results.map((item) => `${item.kind}:${item.id}`)).toEqual(["note:one", "task:two", "note:three"]);
    expect(results[0].searchable_text).toBe("best semantic passage");
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  it("respects the final bound", () => {
    expect(reciprocalRankFusion([{ kind: "note", id: "one", searchable_text: "one" }], [{ kind: "note", id: "two", searchable_text: "two" }], 1)).toHaveLength(1);
  });
});
