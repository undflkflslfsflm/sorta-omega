import rrule from "rrule";

const { RRule, datetime } = rrule;

export type RecurrenceRule = {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  timezone: string;
  byWeekday?: Array<"MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU">;
  count?: number;
  until?: string;
};

export type OccurrenceException = {
  id: string;
  originalStartsAt: string;
  cancelled: boolean;
  title?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
};

const frequencies = { daily: RRule.DAILY, weekly: RRule.WEEKLY, monthly: RRule.MONTHLY, yearly: RRule.YEARLY } as const;
const weekdays = { MO: RRule.MO, TU: RRule.TU, WE: RRule.WE, TH: RRule.TH, FR: RRule.FR, SA: RRule.SA, SU: RRule.SU } as const;

function wallClockDate(instant: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
  }).formatToParts(instant);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return datetime(value("year"), value("month"), value("day"), value("hour"), value("minute"), value("second"));
}

export function instantFromWallClock(wallClock: Date, timezone: string) {
  const target = Date.UTC(wallClock.getUTCFullYear(), wallClock.getUTCMonth(), wallClock.getUTCDate(), wallClock.getUTCHours(), wallClock.getUTCMinutes(), wallClock.getUTCSeconds());
  let guess = target;
  for (let index = 0; index < 3; index += 1) {
    const represented = wallClockDate(new Date(guess), timezone).getTime();
    guess += target - represented;
  }
  return new Date(guess);
}

export function isSupportedTimezone(timezone: string) {
  try { new Intl.DateTimeFormat("en", { timeZone: timezone }).format(); return true; } catch { return false; }
}

export function expandOccurrences(input: {
  eventId: string; title: string; startsAt: string; endsAt: string; recurrence: RecurrenceRule | null;
  exceptions?: OccurrenceException[]; from: string; to: string; limit?: number;
}) {
  const from = new Date(input.from); const to = new Date(input.to); const start = new Date(input.startsAt); const end = new Date(input.endsAt);
  if (!(from < to) || to.getTime() - from.getTime() > 366 * 24 * 60 * 60 * 1000) throw new Error("occurrence_range_too_large");
  const limit = Math.min(input.limit ?? 500, 500);
  const starts = input.recurrence ? new RRule({
    freq: frequencies[input.recurrence.frequency], interval: input.recurrence.interval,
    dtstart: wallClockDate(start, input.recurrence.timezone),
    byweekday: input.recurrence.byWeekday?.map((day) => weekdays[day]),
    count: input.recurrence.count,
    until: input.recurrence.until ? wallClockDate(new Date(input.recurrence.until), input.recurrence.timezone) : undefined,
    wkst: RRule.MO
  }).between(wallClockDate(from, input.recurrence.timezone), wallClockDate(to, input.recurrence.timezone), true)
    .map((floating) => instantFromWallClock(floating, input.recurrence!.timezone))
    .filter((instant) => instant >= from && instant < to) : (end > from && start < to ? [start] : []);
  if (starts.length > limit) throw new Error("occurrence_limit_exceeded");
  const duration = end.getTime() - start.getTime();
  const exceptions = new Map((input.exceptions ?? []).map((exception) => [new Date(exception.originalStartsAt).toISOString(), exception]));
  return starts.flatMap((occurrenceStart) => {
    const originalStartsAt = occurrenceStart.toISOString();
    const exception = exceptions.get(originalStartsAt);
    if (exception?.cancelled) return [];
    const startsAt = exception?.startsAt ?? originalStartsAt;
    const endsAt = exception?.endsAt ?? new Date(new Date(startsAt).getTime() + duration).toISOString();
    return [{
      id: `${input.eventId}:${originalStartsAt}`, eventId: input.eventId, exceptionId: exception?.id ?? null,
      originalStartsAt, title: exception?.title ?? input.title, startsAt, endsAt
    }];
  });
}
