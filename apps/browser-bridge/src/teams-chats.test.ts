import { describe, expect, it } from "vitest";
import { mergeRenderedMessages, teamsChatNameFromRow, teamsChatNote } from "./teams-chats.js";

describe("Teams chat capture", () => {
  it("uses the conversation name, excluding date and message preview", () => {
    expect(teamsChatNameFromRow("Maths group\n10/6\nTeacher: Homework due Friday")).toBe("Maths group");
    expect(() => teamsChatNameFromRow("\n\n")).toThrow("teams_chat_name_missing_or_unbounded");
  });
  it("deduplicates messages by source identity and retains richer loaded text", () => {
    const seen = new Map();
    mergeRenderedMessages(seen, [{ id: "message-one", text: "Hello" }]);
    mergeRenderedMessages(seen, [{ id: "message-one", text: "Hello, full text" }, { id: "message-two", text: "Reply" }]);
    expect([...seen.values()]).toEqual([{ id: "message-one", text: "Hello, full text" }, { id: "message-two", text: "Reply" }]);
    expect(() => mergeRenderedMessages(seen, [{ id: "", text: "unknown" }])).toThrow("teams_chat_message_identity_missing");
  });

  it("uses a stable conversation identity without exposing raw message keys", () => {
    const first = teamsChatNote("private-conversation-key", "Study group", [{ id: "private-message-key", text: "Friday at 12" }]);
    const changed = teamsChatNote("private-conversation-key", "Study group", [{ id: "private-message-key", text: "Friday at 13" }]);
    expect(first.id).toBe(changed.id);
    expect(first.path).toBe(`teams/chats/${first.id}.json`);
    expect(first.body).not.toContain("private-message-key");
    expect(first.body).toContain("partial read-only snapshot");
    expect(() => teamsChatNote("key", "Name", [{ id: "id", text: "a".repeat(1_000_000) }])).toThrow("teams_chat_note_too_large");
  });
});
