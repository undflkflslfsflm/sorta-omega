import type { ActiveTimeSegment, StudySessionAction } from "./study-session.js";

export type MomentumActionObservation = { action: StudySessionAction; observedAt: string };
export type MomentumSessionObservation = {
  id: string;
  courseId: string | null;
  createdAt: string;
  estimatedMinutes: number | null;
  activeTimeSegments: ActiveTimeSegment[];
  actions: MomentumActionObservation[];
};

export type MomentumPreferencesInput = {
  enabled: boolean;
  minObservations: number;
};

function overlapSeconds(segment: ActiveTimeSegment, fromMs: number, toMs: number, nowMs: number) {
  const start = Math.max(Date.parse(segment.startedAt), fromMs);
  const rawEnd = segment.endedAt ? Date.parse(segment.endedAt) : nowMs;
  const end = Math.min(rawEnd, toMs);
  return Number.isFinite(start) && Number.isFinite(end) ? Math.max(0, Math.floor((end - start) / 1000)) : 0;
}

export function buildMomentumSummary(input: {
  dateFrom: string;
  dateTo: string;
  courseId: string | null;
  sessions: MomentumSessionObservation[];
  preferences: MomentumPreferencesInput;
  now?: string;
  truncated?: boolean;
  timezone?: string;
  windowStartsAt?: string;
  windowEndsAt?: string;
}) {
  const fromMs = Date.parse(input.windowStartsAt ?? `${input.dateFrom}T00:00:00.000Z`);
  const toMs = Date.parse(input.windowEndsAt ?? new Date(Date.parse(`${input.dateTo}T00:00:00.000Z`) + 86_400_000).toISOString());
  const nowMs = Math.min(Date.parse(input.now ?? new Date().toISOString()), toMs);
  const inRange = (value: string) => { const at = Date.parse(value); return at >= fromMs && at < toMs; };

  const observations = input.sessions.flatMap(session => {
    const actions = session.actions.filter(item => inRange(item.observedAt));
    const observedSeconds = session.activeTimeSegments.reduce((total, segment) => total + overlapSeconds(segment, fromMs, toMs, nowMs), 0);
    const createdInRange = inRange(session.createdAt);
    if (!actions.length && !observedSeconds && !createdInRange) return [];
    return [{ session, actions, observedSeconds }];
  });

  const sessionsWithMeasuredDuration = observations.filter(item => item.observedSeconds > 0);
  const durationPairs = sessionsWithMeasuredDuration.filter(item => item.session.estimatedMinutes !== null);
  const totalObservedSeconds = sessionsWithMeasuredDuration.reduce((sum, item) => sum + item.observedSeconds, 0);
  const pairedObservedSeconds = durationPairs.reduce((sum, item) => sum + item.observedSeconds, 0);
  const pairedEstimatedMinutes = durationPairs.reduce((sum, item) => sum + (item.session.estimatedMinutes ?? 0), 0);
  const completedSessions = observations.filter(item => item.actions.some(action => action.action === "complete")).length;
  const skippedSessions = observations.filter(item => item.actions.some(action => action.action === "skip")).length;
  const interruptedSessions = observations.filter(item => item.actions.some(action => action.action === "interrupt")).length;
  const evidenceSufficient = observations.length >= input.preferences.minObservations;
  const adaptiveEstimateEligible = input.preferences.enabled && evidenceSufficient && durationPairs.length >= input.preferences.minObservations;
  const orderedTimes = observations.flatMap(item => [item.session.createdAt, ...item.actions.map(action => action.observedAt)]).filter(inRange).sort();

  const limitations = [
    "Elapsed focus time measures recorded active segments; it does not prove learning, mastery, attention, or task completion.",
    ...(evidenceSufficient ? [] : [`Only ${observations.length} session observation(s) are available; at least ${input.preferences.minObservations} are required.`]),
    ...(durationPairs.length ? [] : ["No session in this window has both a recorded estimate and measured active time."]),
    ...(!input.preferences.enabled ? ["Adaptive estimates are disabled; this summary cannot change future estimates."] : [])
  ];

  return {
    window: { dateFrom: input.dateFrom, dateTo: input.dateTo, timezone: input.timezone ?? "UTC", courseId: input.courseId },
    counts: {
      sessionObservations: observations.length,
      completedSessions,
      skippedSessions,
      interruptedSessions,
      sessionsWithMeasuredDuration: sessionsWithMeasuredDuration.length,
      durationPairs: durationPairs.length
    },
    duration: {
      observedMinutes: Math.floor(totalObservedSeconds / 60),
      pairedObservedMinutes: Math.floor(pairedObservedSeconds / 60),
      pairedEstimatedMinutes,
      observedToEstimatedRatio: pairedEstimatedMinutes > 0 ? Number((pairedObservedSeconds / 60 / pairedEstimatedMinutes).toFixed(3)) : null
    },
    evidence: {
      minimumObservations: input.preferences.minObservations,
      sufficient: evidenceSufficient,
      firstObservedAt: orderedTimes[0] ?? null,
      lastObservedAt: orderedTimes.at(-1) ?? null,
      truncated: input.truncated ?? false
    },
    adaptiveEstimateEligible,
    limitations: [...limitations, ...(input.truncated ? ["The result reached the 5,000-session safety bound; narrow the date or course filter for complete coverage."] : [])]
  };
}
