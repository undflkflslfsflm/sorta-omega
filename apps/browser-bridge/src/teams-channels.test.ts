import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { mergeRenderedPosts, teamsChannelPostNote } from "./teams-channels.js";

describe("Teams class-channel post identity", () => {
  const post = { chainId: "chain", messageId: "message", text: "Lesson details" };

  it("preserves previously imported General identity and title", () => {
    const id = createHash("sha256").update("teams-channel:Maths:chain:message").digest("hex");
    const note = teamsChannelPostNote("Maths", "General", post);
    expect(note.id).toBe(id);
    expect(note.title).toBe(`Teams · Maths · ${id.slice(0, 12)}`);
    expect(note.body).toContain("Channel: General\n");
    expect(teamsChannelPostNote("Maths", "Generelt", post)).toEqual(note);
  });

  it("keeps other channels distinct while retaining provenance", () => {
    const one = teamsChannelPostNote("Maths", "Revision", post);
    const two = teamsChannelPostNote("Maths", "Homework", post);
    expect(one.id).not.toBe(two.id);
    expect(one.id).not.toBe(teamsChannelPostNote("Maths", "General", post).id);
    expect(one.body).toContain("Channel: Revision\n");
    expect(one.path).toBe(`teams/channels/${one.id}.json`);
  });

  it("rejects missing identities and oversized content", () => {
    expect(() => teamsChannelPostNote("Maths", "General", { ...post, messageId: "" })).toThrow("teams_channel_post_identity_invalid");
    expect(() => teamsChannelPostNote("Maths", "General", { ...post, text: "x".repeat(1_000_000) })).toThrow("teams_channel_post_too_large");
  });

  it("retains identities found at different scroll positions and the fuller text", () => {
    const seen = new Map();
    mergeRenderedPosts(seen, [post, { chainId: "older", messageId: "older", text: "Old post" }]);
    mergeRenderedPosts(seen, [{ ...post, text: "Lesson details and more" }]);
    expect(seen.size).toBe(2);
    expect(seen.get("chain:message")?.text).toBe("Lesson details and more");
  });
});
