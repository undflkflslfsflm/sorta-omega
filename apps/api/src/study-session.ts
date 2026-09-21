export type StudySessionState = "planned" | "active" | "paused" | "interrupted" | "completed" | "skipped";
export type StudySessionAction = "start" | "pause" | "resume" | "interrupt" | "complete" | "skip";
export type ActiveTimeSegment = { startedAt: string; endedAt: string | null };

const transitions: Record<StudySessionState, Partial<Record<StudySessionAction, StudySessionState>>> = {
  planned: { start: "active", skip: "skipped" },
  active: { pause: "paused", interrupt: "interrupted", complete: "completed" },
  paused: { resume: "active", interrupt: "interrupted", complete: "completed", skip: "skipped" },
  interrupted: { resume: "active", complete: "completed", skip: "skipped" },
  completed: {},
  skipped: {}
};

export function applyStudySessionTransition(state: StudySessionState, action: StudySessionAction, observedAt: string, segments: ActiveTimeSegment[]) {
  const nextState = transitions[state][action];
  if (!nextState) return null;
  const nextSegments = segments.map(segment => ({ ...segment }));
  if (action === "start" || action === "resume") nextSegments.push({ startedAt: observedAt, endedAt: null });
  if (state === "active") {
    let open: ActiveTimeSegment | undefined;
    for (let index = nextSegments.length - 1; index >= 0; index -= 1) { if (nextSegments[index].endedAt === null) { open = nextSegments[index]; break; } }
    if (!open || Date.parse(observedAt) < Date.parse(open.startedAt)) return null;
    open.endedAt = observedAt;
  }
  return { state: nextState, segments: nextSegments };
}

export function observedActiveSeconds(segments: ActiveTimeSegment[], now?: string) {
  return Math.floor(segments.reduce((total, segment) => {
    const end = segment.endedAt ?? now;
    return end ? total + Math.max(0, Date.parse(end) - Date.parse(segment.startedAt)) : total;
  }, 0) / 1000);
}
