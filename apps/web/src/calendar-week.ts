export function isoWeekForDate(instant: Date, timezone = "Europe/Oslo"): number {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(instant);
  const part = (name: string) => Number(parts.find(value => value.type === name)?.value);
  const localDay = new Date(Date.UTC(part("year"), part("month") - 1, part("day")));
  localDay.setUTCDate(localDay.getUTCDate() + 4 - (localDay.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(localDay.getUTCFullYear(), 0, 1));
  return Math.ceil((((localDay.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7);
}
