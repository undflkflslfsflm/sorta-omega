import { describe, expect, it } from "vitest";
import { prepStatusTransition } from "./prep-item.js";

describe("private preparation status", () => {
  it.each(["needed", "packed", "dismissed", "completed"] as const)("never fulfills a commitment when moved to %s", (status) => {
    expect(prepStatusTransition("needed", status).commitmentEffect).toBe("none");
  });

  it("suppresses only an explicit dismissal", () => {
    expect(prepStatusTransition("needed", "dismissed").suppressFutureSuggestion).toBe(true);
    expect(prepStatusTransition("needed", "packed").suppressFutureSuggestion).toBe(false);
  });
});
