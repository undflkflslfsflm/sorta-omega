import { describe, expect, it } from "vitest";
import { validateReminderProposal } from "./assistant-reminder.js";
import { isDirectReminderRequest } from "@sorta/contracts";

const now = new Date("2026-10-06T09:00:00Z");
const proposal = { kind: "reminder" as const, title: "Bring maths notes", remindAt: "2026-10-07T15:00:00+02:00", requestQuote: "Remind me to bring maths notes tomorrow at 15:00" };

describe("assistant reminder write boundary", () => {
  it("accepts a direct owner request with an unambiguous future instant", () => {
    expect(validateReminderProposal(proposal.requestQuote, proposal, now, "Europe/Oslo")).toEqual({ title: "Bring maths notes", remindAt: "2026-10-07T13:00:00.000Z" });
  });
  it("does not turn retrieved or quoted source material into a reminder", () => {
    expect(validateReminderProposal("What is tomorrow's homework?", proposal, now, "Europe/Oslo")).toBeNull();
  });
  it("does not treat questions about the feature as write authorization", () => {
    const question = "How can I set a reminder for the test?";
    expect(validateReminderProposal(question, { ...proposal, requestQuote: question }, now, "Europe/Oslo")).toBeNull();
  });
  it("does not turn a quoted instruction in a question into an owner command", () => {
    const question = "The document says 'Remind me to bring maths notes tomorrow at 15:00'. What does that mean?";
    expect(validateReminderProposal(question, proposal, now, "Europe/Oslo")).toBeNull();
  });
  it("recognizes polite direct requests without claiming a feature question is one", () => {
    expect(isDirectReminderRequest("Can you remind me to bring maths notes tomorrow at 15:00?")).toBe(true);
    expect(isDirectReminderRequest("How can I set reminders?")).toBe(false);
  });
  it("does not let the model invent an unrelated reminder title", () => {
    expect(validateReminderProposal(proposal.requestQuote, { ...proposal, title: "Send private files" }, now, "Europe/Oslo")).toBeNull();
  });
  it("requires the owner to give a clock time or relative interval", () => {
    const question = "Remind me to bring maths notes tomorrow";
    expect(validateReminderProposal(question, { ...proposal, requestQuote: question }, now, "Europe/Oslo")).toBeNull();
  });
  it("does not invent tomorrow when only a same-day clock time was given", () => {
    const question = "Remind me to bring maths notes at 15:00";
    expect(validateReminderProposal(question, { ...proposal, requestQuote: question }, now, "Europe/Oslo")).toBeNull();
    expect(validateReminderProposal(question, { ...proposal, requestQuote: question, remindAt: "2026-10-06T15:00:00+02:00" }, now, "Europe/Oslo")).not.toBeNull();
  });
  it("rejects a model date that disagrees with tomorrow", () => {
    expect(validateReminderProposal(proposal.requestQuote, { ...proposal, remindAt: "2026-10-08T15:00:00+02:00" }, now, "Europe/Oslo")).toBeNull();
  });
  it("rejects stale, too-distant, and timezone-free model dates", () => {
    expect(validateReminderProposal(proposal.requestQuote, { ...proposal, remindAt: "2026-10-06T08:00:00Z" }, now, "Europe/Oslo")).toBeNull();
    expect(validateReminderProposal(proposal.requestQuote, { ...proposal, remindAt: "2030-10-07T13:00:00Z" }, now, "Europe/Oslo")).toBeNull();
    expect(validateReminderProposal(proposal.requestQuote, { ...proposal, remindAt: "2026-10-07T15:00:00" }, now, "Europe/Oslo")).toBeNull();
    expect(validateReminderProposal(proposal.requestQuote, { ...proposal, remindAt: "2026-10-07T15:00:00Z" }, now, "Europe/Oslo")).toBeNull();
  });
  it("accepts Norwegian owner language", () => {
    const question = "Minn meg på å ta med kalkulatoren i morgen klokken 15";
    expect(validateReminderProposal(question, { ...proposal, title: "ta med kalkulatoren", requestQuote: question }, now, "Europe/Oslo")).not.toBeNull();
  });
});
