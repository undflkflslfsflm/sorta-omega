import { describe, expect, it } from "vitest";
import { commitmentPrepText, commitmentTransitionError, matchesEvent, type MatchableCommitment } from "./commitment-matcher.js";

const book: MatchableCommitment = {
  id: "commitment-1",
  status: "active",
  personEntityId: "hanako-person",
  objectLabel: "the borrowed economics book",
  conditionKind: "next_meeting_with_person"
};

describe("commitment matching", () => {
  it("matches the next meeting with the exact person identity", () => {
    expect(matchesEvent(book, ["hanako-person", "library-place"])).toBe(true);
    expect(commitmentPrepText(book)).toBe("Bring the borrowed economics book");
  });

  it("does not confuse a different person or a place with the same name", () => {
    expect(matchesEvent(book, ["ember-person"])).toBe(false);
    expect(matchesEvent(book, ["hanako-place"])).toBe(false);
  });

  it("does not resurface fulfilled commitments", () => {
    expect(matchesEvent({ ...book, status: "fulfilled" }, ["hanako-person"])).toBe(false);
  });

  it("requires action evidence for fulfillment and correction evidence for reopening", () => {
    expect(commitmentTransitionError("active", "fulfilled", "owner_confirmed_action")).toBeNull();
    expect(commitmentTransitionError("active", "fulfilled", "owner_correction")).toBe("fulfillment_requires_action_evidence");
    expect(commitmentTransitionError("fulfilled", "active", "owner_correction")).toBeNull();
    expect(commitmentTransitionError("fulfilled", "active", "owner_confirmed_action")).toBe("reopen_requires_owner_correction");
    expect(commitmentTransitionError("active", "superseded", "superseded_by_new_commitment")).toBeNull();
  });
});
