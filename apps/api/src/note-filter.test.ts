import { describe, expect, it } from "vitest";
import { compileNoteFilter } from "./note-filter.js";

describe("finite collection filters", () => {
  it("compiles only typed clauses with bound parameters", () => {
    const compiled = compileNoteFilter({ operator: "and", conditions: [{ type: "classification", value: "idea" }, { type: "text_contains", value: "school') OR true --" }] });
    expect(compiled.sql).toContain("$2"); expect(compiled.sql).toContain("$3");
    expect(compiled.sql).not.toContain("OR true");
    expect(compiled.values).toEqual(["idea", "school') OR true --"]);
  });

  it("uses a true predicate for the bounded empty system view", () => {
    expect(compileNoteFilter({ operator: "and", conditions: [] })).toEqual({ sql: "true", values: [] });
  });
});
