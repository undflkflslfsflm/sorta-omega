import { describe, expect, it } from "vitest";
import { buildReminderIntentPrompt, reminderIntentValidator } from "./reminder-action.js";

describe("dedicated reminder interpretation", () => {
  it("uses only the owner's request and explicit timezone", () => {
    const prompt = buildReminderIntentPrompt("Minn meg på å ta med kalkulatoren i morgen klokken 15", "2026-10-06T09:00:00Z", "Europe/Oslo");
    expect(prompt).toContain("OWNER REQUEST:");
    expect(prompt).toContain("2026-10-06T09:00:00Z");
    expect(prompt).toContain("Europe/Oslo");
    expect(prompt).toContain("never invent one");
  });
  it("accepts clarification instead of an invented instant", () => {
    expect(reminderIntentValidator.parse({ proposedReminder: null }).proposedReminder).toBeNull();
  });
  it("accepts a structured proposal without granting it write authority", () => {
    const proposedReminder = {
      kind: "reminder",
      title: "ta med kalkulatoren",
      remindAt: "2026-10-07T15:00:00+02:00",
      requestQuote: "Minn meg på å ta med kalkulatoren i morgen klokken 15"
    };
    expect(reminderIntentValidator.parse({ proposedReminder }).proposedReminder).toEqual(proposedReminder);
    expect(() => reminderIntentValidator.parse({ proposedReminder: { ...proposedReminder, extra: "not allowed" } })).toThrow();
  });
});
