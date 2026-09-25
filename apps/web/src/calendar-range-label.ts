function localDate(value: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(value));
  const part = (type: "year" | "month" | "day") => parts.find(item => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function norwegianDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

export function calendarRangeLabel(from: string, toExclusive: string, timezone: string): string {
  const first = localDate(from, timezone);
  const last = localDate(new Date(Date.parse(toExclusive) - 1).toISOString(), timezone);
  if (first === last) return norwegianDate(first);
  const [firstYear, firstMonth, firstDay] = first.split("-");
  const [lastYear, lastMonth] = last.split("-");
  return firstYear === lastYear && firstMonth === lastMonth
    ? `${firstDay}.–${norwegianDate(last)}`
    : `${norwegianDate(first)}–${norwegianDate(last)}`;
}
