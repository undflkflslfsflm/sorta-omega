export type SchedulerWindow = { days: number[]; startLocal: string; endLocal: string; label: string };
export type SchedulerTaskInput = { id: string; remainingMinutes: number | null; earliestStart: string | null; dueAt: string | null; priority: number; allowSplit: boolean; minBlockMinutes: number | null; maxBlockMinutes: number | null };
export type SchedulerPreferencesInput = { timezone: string; protectedWindows: SchedulerWindow[]; preferredWindows: SchedulerWindow[]; dailyLimitMinutes: number; breakMinutes: number; minBlockMinutes: number; maxBlockMinutes: number; allowSplit: boolean };
export type BusyInterval = { startsAt: string; endsAt: string };
export type SchedulePlacement = { taskId: string; startsAt: string; endsAt: string; minutes: number; reasonCodes: string[] };
export type UnscheduledWork = { taskId: string; remainingMinutes: number | null; reasonCodes: string[] };
export type ScheduledFocusInput = { taskId: string; eventId: string; startsAt: string; endsAt: string };
export type NextActionPlacement = { taskId: string; source: "scheduled_focus_block" | "deterministic_slot"; calendarEventId: string | null; startsAt: string; endsAt: string; durationMinutes: number; reasonCodes: string[]; explanation: string; canStartNow: boolean };
export type NextActionCandidate = { taskId: string; source: "scheduled_focus_block" | "deterministic_slot" | "unsized_task"; calendarEventId: string | null; startsAt: string | null; endsAt: string | null; durationMinutes: number | null; durationKnown: boolean; fitsAvailableMinutes: boolean | null; reasonCodes: string[]; explanation: string; canStartNow: boolean };

const STEP_MS = 5 * 60_000;
const reasonText: Record<string, string> = {
  scheduled_focus_block: "An accepted local focus block already exists for this task.",
  preferred_window: "The block fits an explicitly preferred work window.",
  earliest_feasible: "This is the earliest block that satisfies current busy and protected-time constraints.",
  bounded_block: "The block respects the configured split and maximum-duration bounds.",
  short_final_block: "Only the final remainder is shorter than the preferred minimum block.",
  unknown_effort: "Remaining effort is unknown, so no duration or slot was invented.",
  exceeds_unsplittable_maximum: "The task is marked unsplittable and exceeds the maximum block duration.",
  deadline_before_horizon: "The recorded deadline is before the requested planning horizon.",
  no_capacity: "No remaining capacity satisfies the current calendar, protected-time, break, and daily-limit constraints."
};
export function explainScheduleReasons(reasonCodes: string[]) { return reasonCodes.map((code) => reasonText[code] ?? `Recorded scheduler reason: ${code}.`); }
const formatterCache = new Map<string, Intl.DateTimeFormat>();
function localParts(instant: Date, timezone: string) {
  let formatter = formatterCache.get(timezone); if (!formatter) { formatter = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, weekday: "short", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }); formatterCache.set(timezone, formatter); }
  const parts = formatter.formatToParts(instant); const get = (type: Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)?.value ?? "";
  const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(get("weekday")); return { day: weekday, date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}
function insideWindow(instant: Date, windows: SchedulerWindow[], timezone: string) { const local = localParts(instant, timezone); return windows.some(window => window.days.includes(local.day) && local.time >= window.startLocal && local.time < window.endLocal); }
function overlapsProtected(start: number, end: number, windows: SchedulerWindow[], timezone: string) { for (let cursor=start;cursor<end;cursor+=STEP_MS) if (insideWindow(new Date(cursor),windows,timezone)) return true; return false; }
function overlaps(start: number, end: number, intervals: Array<{ start: number; end: number }>) { return intervals.some(interval => start < interval.end && end > interval.start); }
function ceilStep(value: number) { return Math.ceil(value / STEP_MS) * STEP_MS; }

export function buildSchedulePreview(input: { tasks: SchedulerTaskInput[]; busy: BusyInterval[]; horizon: { startsAt: string; endsAt: string }; preferences: SchedulerPreferencesInput }) {
  const horizonStart = Date.parse(input.horizon.startsAt), horizonEnd = Date.parse(input.horizon.endsAt); if (!(horizonStart < horizonEnd) || horizonEnd - horizonStart > 31 * 86_400_000) throw new Error("invalid_schedule_horizon");
  const occupied = input.busy.map(item => ({ start: Date.parse(item.startsAt), end: Date.parse(item.endsAt) })).filter(item => item.start < item.end); const dailyUsed = new Map<string, number>(); const placements: SchedulePlacement[] = []; const unscheduled: UnscheduledWork[] = [];
  const tasks = [...input.tasks].sort((a,b) => (a.dueAt ? Date.parse(a.dueAt) : Infinity) - (b.dueAt ? Date.parse(b.dueAt) : Infinity) || b.priority - a.priority || a.id.localeCompare(b.id));
  for (const task of tasks) {
    if (task.remainingMinutes === null) { unscheduled.push({ taskId: task.id, remainingMinutes: null, reasonCodes: ["unknown_effort"] }); continue; }
    let remaining = task.remainingMinutes; if (remaining === 0) continue;
    const allowSplit = task.allowSplit && input.preferences.allowSplit; const minBlock = task.minBlockMinutes ?? input.preferences.minBlockMinutes; const maxBlock = task.maxBlockMinutes ?? input.preferences.maxBlockMinutes; if (!allowSplit && remaining > maxBlock) { unscheduled.push({ taskId: task.id, remainingMinutes: remaining, reasonCodes: ["exceeds_unsplittable_maximum"] }); continue; }
    while (remaining > 0) {
      const minutes = allowSplit ? Math.min(remaining, maxBlock) : remaining; const duration = minutes * 60_000; const earliest = Math.max(horizonStart, task.earliestStart ? Date.parse(task.earliestStart) : horizonStart); const deadline = Math.min(horizonEnd, task.dueAt ? Date.parse(task.dueAt) : horizonEnd); let found: number | null = null; let preferred: number | null = null;
      for (let candidate = ceilStep(earliest); candidate + duration <= deadline; candidate += STEP_MS) { const end = candidate + duration; const startDate = new Date(candidate); const dayKey = localParts(startDate,input.preferences.timezone).date; if ((dailyUsed.get(dayKey) ?? 0) + minutes > input.preferences.dailyLimitMinutes) continue; if (overlapsProtected(candidate,end,input.preferences.protectedWindows,input.preferences.timezone) || overlaps(candidate,end,occupied)) continue; found ??= candidate; if (insideWindow(startDate,input.preferences.preferredWindows,input.preferences.timezone)) { preferred = candidate; break; } }
      const start = preferred ?? found; if (start === null) break; const end = start + duration; const key = localParts(new Date(start),input.preferences.timezone).date; dailyUsed.set(key,(dailyUsed.get(key)??0)+minutes); occupied.push({start,end:end+input.preferences.breakMinutes*60_000}); placements.push({taskId:task.id,startsAt:new Date(start).toISOString(),endsAt:new Date(end).toISOString(),minutes,reasonCodes:[preferred!==null?"preferred_window":"earliest_feasible",minutes<minBlock?"short_final_block":"bounded_block"]}); remaining -= minutes; if (!allowSplit) break;
    }
    if (remaining > 0) unscheduled.push({taskId:task.id,remainingMinutes:remaining,reasonCodes:[task.dueAt&&Date.parse(task.dueAt)<=horizonStart?"deadline_before_horizon":"no_capacity"]});
  }
  return { placements, unscheduled };
}

export function selectNextActionPlacement(input: { tasks: SchedulerTaskInput[]; scheduledFocus: ScheduledFocusInput[]; busy: BusyInterval[]; horizon: { startsAt: string; endsAt: string }; preferences: SchedulerPreferencesInput }): NextActionPlacement | null {
  const now = Date.parse(input.horizon.startsAt); const horizonEnd = Date.parse(input.horizon.endsAt); const taskIds = new Set(input.tasks.map(task => task.id));
  const scheduled = input.scheduledFocus.filter(item => taskIds.has(item.taskId) && Date.parse(item.endsAt) > now && Date.parse(item.startsAt) < horizonEnd).sort((a,b) => Date.parse(a.startsAt)-Date.parse(b.startsAt)||a.eventId.localeCompare(b.eventId))[0];
  if (scheduled) { const starts = Date.parse(scheduled.startsAt), ends = Date.parse(scheduled.endsAt); return { taskId: scheduled.taskId, source:"scheduled_focus_block", calendarEventId:scheduled.eventId, startsAt:scheduled.startsAt, endsAt:scheduled.endsAt, durationMinutes:Math.max(1,Math.round((ends-starts)/60_000)), reasonCodes:["scheduled_focus_block"], explanation:"This task already has the next accepted focus block on your local calendar.", canStartNow:starts<=now&&ends>now }; }
  const preview = buildSchedulePreview({tasks:input.tasks,busy:input.busy,horizon:input.horizon,preferences:input.preferences}); const placement=[...preview.placements].sort((a,b)=>a.startsAt.localeCompare(b.startsAt)||a.taskId.localeCompare(b.taskId))[0]; if(!placement)return null;
  const task=input.tasks.find(item=>item.id===placement.taskId)!; const rankingInputs=task.dueAt?" Its recorded deadline and priority were included in the deterministic ordering.":" Its recorded priority was included in the deterministic ordering."; const detail=`This is the earliest generated block that fits your busy time, protected windows, workload limit, and break settings.${rankingInputs}`; const start=Date.parse(placement.startsAt);
  return {taskId:placement.taskId,source:"deterministic_slot",calendarEventId:null,startsAt:placement.startsAt,endsAt:placement.endsAt,durationMinutes:placement.minutes,reasonCodes:placement.reasonCodes,explanation:detail,canStartNow:start-now<STEP_MS};
}

export function selectNextActionCandidates(input: { tasks: SchedulerTaskInput[]; scheduledFocus: ScheduledFocusInput[]; busy: BusyInterval[]; horizon: { startsAt: string; endsAt: string }; preferences: SchedulerPreferencesInput; availableMinutes: number | null; limit: number }): NextActionCandidate[] {
  const now = Date.parse(input.horizon.startsAt);
  const horizonEnd = Date.parse(input.horizon.endsAt);
  const taskById = new Map(input.tasks.map((task) => [task.id, task]));
  const selected = new Set<string>();
  const candidates: NextActionCandidate[] = [];
  for (const focus of [...input.scheduledFocus].sort((a, b) => a.startsAt.localeCompare(b.startsAt) || a.eventId.localeCompare(b.eventId))) {
    if (candidates.length >= input.limit || selected.has(focus.taskId) || !taskById.has(focus.taskId) || Date.parse(focus.endsAt) <= now || Date.parse(focus.startsAt) >= horizonEnd) continue;
    const durationMinutes = Math.max(1, Math.round((Date.parse(focus.endsAt) - Date.parse(focus.startsAt)) / 60_000));
    candidates.push({ taskId: focus.taskId, source: "scheduled_focus_block", calendarEventId: focus.eventId, startsAt: focus.startsAt, endsAt: focus.endsAt, durationMinutes, durationKnown: true, fitsAvailableMinutes: input.availableMinutes === null ? null : durationMinutes <= input.availableMinutes, reasonCodes: ["scheduled_focus_block"], explanation: "This task already has an accepted focus block on your local calendar.", canStartNow: Date.parse(focus.startsAt) <= now && Date.parse(focus.endsAt) > now });
    selected.add(focus.taskId);
  }
  const known = input.tasks.filter((task) => !selected.has(task.id) && task.remainingMinutes !== null && task.remainingMinutes > 0).map((task) => input.availableMinutes === null ? task : { ...task, maxBlockMinutes: Math.min(task.maxBlockMinutes ?? input.preferences.maxBlockMinutes, input.availableMinutes) });
  if (known.length && candidates.length < input.limit) {
    const preferences = input.availableMinutes === null ? input.preferences : { ...input.preferences, maxBlockMinutes: Math.min(input.preferences.maxBlockMinutes, input.availableMinutes) };
    const preview = buildSchedulePreview({ tasks: known, busy: input.busy, horizon: input.horizon, preferences });
    const firstByTask = new Map<string, SchedulePlacement>();
    for (const placement of preview.placements) if (!firstByTask.has(placement.taskId)) firstByTask.set(placement.taskId, placement);
    for (const placement of [...firstByTask.values()].sort((a, b) => a.startsAt.localeCompare(b.startsAt) || a.taskId.localeCompare(b.taskId))) {
      if (candidates.length >= input.limit) break;
      const task = taskById.get(placement.taskId)!;
      candidates.push({ taskId: placement.taskId, source: "deterministic_slot", calendarEventId: null, startsAt: placement.startsAt, endsAt: placement.endsAt, durationMinutes: placement.minutes, durationKnown: true, fitsAvailableMinutes: input.availableMinutes === null ? null : placement.minutes <= input.availableMinutes, reasonCodes: placement.reasonCodes, explanation: task.dueAt ? "This is a feasible block selected from the task's recorded deadline, priority, current busy time, protected windows, workload limit, and break settings." : "This is a feasible block selected from the task's recorded priority, current busy time, protected windows, workload limit, and break settings.", canStartNow: Date.parse(placement.startsAt) - now < STEP_MS });
      selected.add(placement.taskId);
    }
  }
  const unknown = input.tasks.filter((task) => !selected.has(task.id) && task.remainingMinutes === null).sort((a, b) => (a.dueAt ? Date.parse(a.dueAt) : Infinity) - (b.dueAt ? Date.parse(b.dueAt) : Infinity) || b.priority - a.priority || a.id.localeCompare(b.id));
  for (const task of unknown) {
    if (candidates.length >= input.limit) break;
    candidates.push({ taskId: task.id, source: "unsized_task", calendarEventId: null, startsAt: null, endsAt: null, durationMinutes: null, durationKnown: false, fitsAvailableMinutes: null, reasonCodes: ["unknown_effort"], explanation: "This task is actionable, but no duration or free slot is claimed until its remaining effort is known.", canStartNow: false });
  }
  return candidates;
}
