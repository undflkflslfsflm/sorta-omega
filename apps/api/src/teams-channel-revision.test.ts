import { describe, expect, it } from "vitest";
import { teamsChannelRevision } from "./teams-channel-revision.js";

describe("Teams channel import revisions", () => {
  const existing = { original_text: "Message", body: "Source: Teams class channel post\n\nMessage" };

  it("leaves identical source and note content unchanged", () => {
    expect(teamsChannelRevision(existing, { originalText: "Message", body: existing.body })).toEqual({ sourceChanged: false, noteChanged: false });
  });

  it("updates note provenance without rewriting the original source text", () => {
    expect(teamsChannelRevision(existing, { originalText: "Message", body: "Source: Teams class channel post\nMessage kind: reply\n\nMessage" })).toEqual({ sourceChanged: false, noteChanged: true });
  });

  it("updates both source and note when the message changes", () => {
    expect(teamsChannelRevision(existing, { originalText: "Edited message", body: "Source: Teams class channel post\n\nEdited message" })).toEqual({ sourceChanged: true, noteChanged: true });
  });
});
