import { isSupportedTimezone } from "./recurrence.js";

export type CalendarViewMode = "day" | "week" | "workweek" | "month" | "agenda";

const maximumRangeDays: Record<CalendarViewMode, number> = {
  day: 2,
  week: 14,
  workweek: 14,
  month: 62,
  agenda: 366
};

export function validateCalendarViewRange(input: { from: string; to: string; timezone: string; view: CalendarViewMode }) {
  const from = Date.parse(input.from);
  const to = Date.parse(input.to);
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) throw new Error("invalid_calendar_view_range");
  if (!isSupportedTimezone(input.timezone)) throw new Error("unsupported_calendar_view_timezone");
  if (to - from > maximumRangeDays[input.view] * 86_400_000) throw new Error("calendar_view_range_too_large");
  return input;
}

export function calendarSourceStaleness(input: { state: string; lastSuccessAt: string | null }, nowMs = Date.now()) {
  if (input.state !== "connected") return `connection_${input.state}`;
  if (!input.lastSuccessAt) return "never_synchronized";
  if (nowMs - Date.parse(input.lastSuccessAt) > 24 * 60 * 60_000) return "last_success_over_24_hours_ago";
  return null;
}
