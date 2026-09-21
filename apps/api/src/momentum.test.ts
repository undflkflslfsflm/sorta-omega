import { describe, expect, it } from "vitest";
import { buildMomentumSummary } from "./momentum.js";

describe("momentum summary", () => {
  it("uses explicit actions and clips measured time to the requested window", () => {
    const summary = buildMomentumSummary({
      dateFrom: "2026-09-01",
      dateTo: "2026-09-02",
      courseId: null,
      preferences: { enabled: true, minObservations: 2 },
      now: "2026-09-03T00:00:00.000Z",
      sessions: [
        { id: "one", courseId: null, createdAt: "2026-09-01T09:00:00.000Z", estimatedMinutes: 30, activeTimeSegments: [{ startedAt: "2026-09-01T09:00:00.000Z", endedAt: "2026-09-01T09:20:00.000Z" }], actions: [{ action: "complete", observedAt: "2026-09-01T09:20:00.000Z" }] },
        { id: "two", courseId: null, createdAt: "2026-08-31T23:50:00.000Z", estimatedMinutes: 20, activeTimeSegments: [{ startedAt: "2026-08-31T23:50:00.000Z", endedAt: "2026-09-01T00:10:00.000Z" }], actions: [{ action: "interrupt", observedAt: "2026-09-01T00:10:00.000Z" }] }
      ]
    });
    expect(summary.counts).toMatchObject({ sessionObservations: 2, completedSessions: 1, interruptedSessions: 1, durationPairs: 2 });
    expect(summary.duration).toMatchObject({ observedMinutes: 30, pairedEstimatedMinutes: 50, observedToEstimatedRatio: 0.6 });
    expect(summary.evidence.sufficient).toBe(true);
    expect(summary.adaptiveEstimateEligible).toBe(true);
  });

  it("does not diagnose skipped work or enable adaptation without enough paired evidence", () => {
    const summary = buildMomentumSummary({
      dateFrom: "2026-09-01", dateTo: "2026-09-07", courseId: null,
      preferences: { enabled: true, minObservations: 3 },
      sessions: [{ id: "one", courseId: null, createdAt: "2026-09-02T10:00:00.000Z", estimatedMinutes: null, activeTimeSegments: [], actions: [{ action: "skip", observedAt: "2026-09-02T10:01:00.000Z" }] }]
    });
    expect(summary.counts.skippedSessions).toBe(1);
    expect(summary.adaptiveEstimateEligible).toBe(false);
    expect(summary.limitations.join(" ")).toContain("does not prove learning");
    expect(summary.limitations.join(" ")).not.toMatch(/lazy|motivat|psych/i);
  });
});
