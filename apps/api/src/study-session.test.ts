import { describe, expect, it } from "vitest";
import { applyStudySessionTransition, observedActiveSeconds } from "./study-session.js";

describe("study session transitions", () => {
  it("records only explicit active segments across pause and resume", () => {
    const started = applyStudySessionTransition("planned", "start", "2026-09-19T10:00:00.000Z", []);
    const paused = applyStudySessionTransition("active", "pause", "2026-09-19T10:20:00.000Z", started!.segments);
    const resumed = applyStudySessionTransition("paused", "resume", "2026-09-19T10:30:00.000Z", paused!.segments);
    const completed = applyStudySessionTransition("active", "complete", "2026-09-19T10:40:00.000Z", resumed!.segments);
    expect(completed?.state).toBe("completed");
    expect(observedActiveSeconds(completed!.segments)).toBe(30 * 60);
  });

  it("rejects implied completion and invalid event order", () => {
    expect(applyStudySessionTransition("planned", "complete", "2026-09-19T10:00:00.000Z", [])).toBeNull();
    expect(applyStudySessionTransition("active", "pause", "2026-09-19T09:59:00.000Z", [{ startedAt: "2026-09-19T10:00:00.000Z", endedAt: null }])).toBeNull();
    expect(applyStudySessionTransition("completed", "resume", "2026-09-19T11:00:00.000Z", [])).toBeNull();
  });
});
