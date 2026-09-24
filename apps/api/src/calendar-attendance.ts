export type ClassAttendanceLink = {
  id: string;
  lessonId: string | null;
  calendarEventId: string | null;
  date: string;
  status: "absent" | "late";
  label: string;
};

function localDate(instant: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(instant));
  const part = (name: string) => parts.find(value => value.type === name)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function attendanceForClass<T extends ClassAttendanceLink>(records: T[], target: { lessonId?: string; calendarEventId?: string; startsAt: string; timezone: string }): T | null {
  const date = localDate(target.startsAt, target.timezone);
  const matches = records.filter(record => record.date === date && (
    (target.lessonId !== undefined && record.lessonId === target.lessonId) ||
    (target.calendarEventId !== undefined && record.calendarEventId === target.calendarEventId)
  ));
  return matches.length === 1 ? matches[0] : null;
}
