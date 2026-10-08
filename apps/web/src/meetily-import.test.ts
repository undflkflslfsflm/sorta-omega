import { describe, expect, it } from "vitest";
import { parseMeetilyRecording } from "./meetily-import";

const metadata = JSON.stringify({ meeting_id: "class-123", meeting_name: "Matematikk", created_at: "2026-10-08T08:00:00Z", completed_at: "2026-10-08T08:45:00Z", status: "completed" });
const transcript = JSON.stringify({ segments: [{ id: "s1", text: "Vi skal se på prosent.", audio_start_time: 3.2, audio_end_time: 6.9 }] });

describe("Meetily recording import", () => {
  it("converts a completed Meetily recording to a source-backed transcript", () => {
    expect(parseMeetilyRecording(metadata, transcript, "folder")).toMatchObject({ meetingId: "class-123", title: "Matematikk", segments: [{ id: "s1", startMs: 3200, endMs: 6900, speaker: { status: "unknown" } }] });
  });
  it("does not import an in-progress recording", () => {
    expect(parseMeetilyRecording(metadata.replace("completed\"", "recording\""), transcript, "folder")).toBeNull();
  });
  it("does not invent words when transcription is empty", () => {
    expect(parseMeetilyRecording(metadata, JSON.stringify({ segments: [] }), "folder")).toBeNull();
  });
});
