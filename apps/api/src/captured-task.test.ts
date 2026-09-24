import { describe, expect, it } from "vitest";
import { explicitCapturedTaskTitle } from "./captured-task.js";

describe("explicit task capture", () => {
  it("recognizes deliberate Norwegian and English action commands", () => {
    expect(explicitCapturedTaskTitle("Husk å levere matteoppgaven\nNoe kontekst")).toBe("levere matteoppgaven");
    expect(explicitCapturedTaskTitle("TODO: return the book")).toBe("return the book");
    expect(explicitCapturedTaskTitle("Oppgave: Les kapittel 2")).toBe("Les kapittel 2");
  });

  it("does not silently turn an inferred or empty note into a task", () => {
    expect(explicitCapturedTaskTitle("I might return a book sometime")).toBeNull();
    expect(explicitCapturedTaskTitle("Task:")).toBeNull();
    expect(explicitCapturedTaskTitle("Some notes\nTODO: buried text")).toBeNull();
  });
});
