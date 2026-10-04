export type AssignmentDue = { kind: "unknown" } | { kind: "exact"; dueAt: string; timezone: "Europe/Oslo" };

const months = new Map(Object.entries({ january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 }));
const oslo = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Oslo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

function osloParts(utcMs: number) {
  const values = Object.fromEntries(oslo.formatToParts(new Date(utcMs)).map(part => [part.type, part.value]));
  return { year: Number(values.year), month: Number(values.month), day: Number(values.day), hour: Number(values.hour), minute: Number(values.minute) };
}

function localToUtc(year: number, month: number, day: number, hour: number, minute: number): string | null {
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  if (!Number.isFinite(wall) || new Date(wall).getUTCMonth() !== month - 1 || new Date(wall).getUTCDate() !== day) return null;
  let guess = wall - 2 * 60 * 60_000;
  for (let attempt = 0; attempt < 4; attempt++) {
    const parts = osloParts(guess);
    const observed = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
    const difference = wall - observed;
    if (difference === 0) return new Date(guess).toISOString();
    guess += difference;
  }
  return null;
}

export function teamsAssignmentDue(metadata: string, sourceTimestamp: string): AssignmentDue {
  const relative = /^Due\s+(today|tomorrow)\s+at\s+(\d{1,2}):(\d{2})\s*(AM|PM)\b/i.exec(metadata);
  const absolute = /^Due\s+([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)\b/i.exec(metadata);
  let year: number, month: number, day: number, hour: number, minute: number, meridiem: string;
  if (relative) {
    const source = Date.parse(sourceTimestamp);
    if (!Number.isFinite(source)) return { kind: "unknown" };
    const local = osloParts(source);
    const shifted = new Date(Date.UTC(local.year, local.month - 1, local.day + (relative[1].toLowerCase() === "tomorrow" ? 1 : 0)));
    year = shifted.getUTCFullYear(); month = shifted.getUTCMonth() + 1; day = shifted.getUTCDate();
    hour = Number(relative[2]); minute = Number(relative[3]); meridiem = relative[4];
  } else if (absolute) {
    year = Number(absolute[3]); month = months.get(absolute[1].toLowerCase()) ?? 0; day = Number(absolute[2]);
    hour = Number(absolute[4]); minute = Number(absolute[5]); meridiem = absolute[6];
  } else return { kind: "unknown" };
  if (year < 2000 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31 || hour < 1 || hour > 12 || minute < 0 || minute > 59) return { kind: "unknown" };
  const twentyFourHour = hour % 12 + (meridiem.toUpperCase() === "PM" ? 12 : 0);
  const dueAt = localToUtc(year, month, day, twentyFourHour, minute);
  return dueAt ? { kind: "exact", dueAt, timezone: "Europe/Oslo" } : { kind: "unknown" };
}

export function teamsCourseBaseName(name: string): string {
  return name.replace(/\s*[-–]\s*VGMAI\b.*$/i, "").replace(/\s+\d{2,4}\/\d{2,4}\b.*$/, "").trim();
}

function key(value: string): string {
  return value.replace(/[øØ]/g, "o").replace(/[æÆ]/g, "ae").replace(/[åÅ]/g, "a").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function abbreviation(value: string): string {
  return key(value).split(" ").filter(word => word && !["og", "med", "and"].includes(word)).map(word => /^\d/.test(word) ? word : word.slice(0, 2)).join("");
}

export function matchTeamsCourse(teamsTitle: string, candidates: Array<{ id: string; name: string }>): string | null {
  const base = teamsCourseBaseName(teamsTitle);
  const exact = candidates.filter(item => key(item.name) === key(base));
  if (exact.length === 1) return exact[0].id;
  if (exact.length > 1) return null;
  const abbreviated = candidates.filter(item => abbreviation(item.name) === key(base).replace(/ /g, ""));
  return abbreviated.length === 1 ? abbreviated[0].id : null;
}
