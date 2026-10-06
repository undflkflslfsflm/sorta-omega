import { describe, expect, it } from "vitest";
import { mergeTeamsChatBodies } from "./teams-chat-merge.js";

describe("Teams chat incremental import", () => {
  const header = "Source: Teams chat\nConversation: Maths\nPartial read-only snapshot";
  it("retains earlier messages when Teams renders a smaller later slice", () => {
    const older = `${header}\n\n[aaaaaaaaaaaaaaaa] First\n\n[bbbbbbbbbbbbbbbb] Second`;
    const smaller = `${header}\n\n[bbbbbbbbbbbbbbbb] Second`;
    expect(mergeTeamsChatBodies(older, smaller)).toBe(older);
  });
  it("adds unseen messages and keeps the richer text for known IDs", () => {
    const older = `${header}\n\n[aaaaaaaaaaaaaaaa] First`;
    const newer = `${header}\n\n[aaaaaaaaaaaaaaaa] First, edited\n\n[cccccccccccccccc] Third`;
    expect(mergeTeamsChatBodies(older, newer)).toContain("[aaaaaaaaaaaaaaaa] First, edited\n\n[cccccccccccccccc] Third");
  });
});
