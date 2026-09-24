import { describe, expect, it } from "vitest";
import { parseNorwegianDateTime } from "./norwegian-date-time";

describe("Norwegian date and time entry", () => {
  it("parses day before month in local time", () => {
    const result = parseNorwegianDateTime("24.09.2026 14:30");
    expect(result?.getFullYear()).toBe(2026);
    expect(result?.getMonth()).toBe(8);
    expect(result?.getDate()).toBe(24);
    expect(result?.getHours()).toBe(14);
    expect(result?.getMinutes()).toBe(30);
  });

  it("rejects US dates and overflow", () => {
    expect(parseNorwegianDateTime("09/24/2026 14:30")).toBeNull();
    expect(parseNorwegianDateTime("31.02.2026 14:30")).toBeNull();
    expect(parseNorwegianDateTime("24.09.2026 25:30")).toBeNull();
  });
});
