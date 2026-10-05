import { createHash } from "node:crypto";
import type { Page } from "playwright-core";
type InSchoolSnapshot = { version: "omega_school_json_v1"; source_timestamp: string; source_origin: string; timezone: "Europe/Oslo"; records: Array<
  | { kind: "subject"; externalId: string; title: string; code: string | null }
  | { kind: "course"; externalId: string; title: string; subjectExternalId: string; teachingGroupId: string | null }
  | { kind: "lesson"; externalId: string; title: string; courseExternalId: string; subjectExternalId: string; startsAt: string; endsAt: string; timezone: "Europe/Oslo"; room: string | null; teachers: string | null; lessonType: string | null; sourceEntityId: string | null }
  | { kind: "attendance"; externalId: string; courseExternalId: string; lessonExternalId: string | null; date: string; rawStatus: string; normalizedStatus: "present" | "absent" | "late" | "unknown"; excusalStatus: "excused" | "unexcused" | "unknown" | "not_applicable"; duration: number | null; units: "minutes" | "lessons" | "source_defined" | null }
  | { kind: "grade"; externalId: string; courseExternalId: string; date: string; rawGrade: string; scale: string; officialWeight: number | null }
> };

type Detail = { date: string; code: string; time: string; hours: string; group: string; recordedBy: string; countsTowardSubject: string; onCertificate: string; term: string };
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
const localDateTime = (iso: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Oslo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));
export function attendanceDataRowCount(reportedTotalRows: number, headerRows: number): number | null {
  if (!Number.isInteger(reportedTotalRows) || !Number.isInteger(headerRows) || headerRows < 1 || reportedTotalRows < headerRows) return null;
  return reportedTotalRows - headerRows;
}

export async function collectInSchoolAttendance(page: Page, base: InSchoolSnapshot, sourceOrigin: string) {
  if (new URL(page.url()).origin !== sourceOrigin || !page.url().includes("#/app/attendance/lessons")) throw new Error("inschool_attendance_page_required");
  const table = page.locator("table").first();
  await table.locator("tbody tr").first().waitFor({ timeout: 20_000 });
  const headers = await table.locator("thead th").allTextContents();
  if (!headers.some(value => value.trim() === "Dato") || !headers.some(value => value.trim() === "Type")) throw new Error("inschool_attendance_layout_changed");
  const reportedRows = attendanceDataRowCount(Number(await table.getAttribute("aria-rowcount")), await table.locator("thead tr").count());
  const details: Detail[] = [];
  let overviewRows = 0;
  for (let pageIndex = 0; pageIndex < 20; pageIndex++) {
  const rowCount = await table.locator("tbody tr").count();
  if (rowCount < 1 || rowCount > 100) throw new Error("inschool_attendance_row_count_outside_bounds");
  overviewRows += rowCount;
  for (let index = 0; index < rowCount; index++) {
    const row = table.locator("tbody tr").nth(index);
    const action = row.getByText("Se fravær", { exact: true });
    if (await action.count() !== 1) throw new Error("inschool_attendance_detail_action_missing");
    await action.click();
    const modal = page.locator(".VsModal.fullscreen");
    await modal.waitFor({ timeout: 10_000 });
    const extracted = await modal.evaluate(element => {
      const table = element.querySelector("table");
      const headers = [...(table?.querySelectorAll("thead th") ?? [])].map(cell => (cell.textContent ?? "").trim().toLocaleLowerCase("nb-NO"));
      if (!["dato", "kode", "tid", "oversikt timer", "undervisningsgruppe"].every(label => headers.includes(label))) throw new Error("inschool_attendance_detail_layout_changed");
      return [...(table?.querySelectorAll("tbody tr") ?? [])].map(row => [...row.querySelectorAll("td")].map(cell => (cell.textContent ?? "").replace(/\s+/g, " ").trim()));
    });
    for (const cells of extracted) {
      if (cells.length < 9) throw new Error("inschool_attendance_detail_cells_missing");
      details.push({ date: cells[0], code: cells[1], time: cells[2], hours: cells[3], group: cells[4], recordedBy: cells[5], countsTowardSubject: cells[6], onCertificate: cells[7], term: cells[8] });
    }
    await modal.getByText("Lukk", { exact: true }).click();
    await modal.waitFor({ state: "hidden", timeout: 10_000 });
  }
  const next = page.getByRole("button", { name: "Neste side", exact: true });
  if (await next.count() !== 1 || await next.isDisabled()) break;
  const previousFirst = await table.locator("tbody tr").first().textContent();
  await next.click();
  await page.waitForFunction(before => document.querySelector("table tbody tr")?.textContent !== before, previousFirst, { timeout: 10_000 });
  if (pageIndex === 19) throw new Error("inschool_attendance_pagination_limit_reached");
  }
  const unique = [...new Map(details.map(item => [JSON.stringify(item), item])).values()];
  const courses = base.records.filter(record => record.kind === "course");
  const lessons = base.records.filter(record => record.kind === "lesson");
  const subjects = base.records.filter(record => record.kind === "subject");
  const matchedCourseIds = new Set<string>();
  const matchedLessonIds = new Set<string>();
  const attendance: InSchoolSnapshot["records"] = [];
  const limitations: string[] = [];
  for (const item of unique) {
    const date = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(item.date);
    const hours = /^(\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2})$/.exec(item.time);
    if (!date || !hours || !item.group || !item.code) { limitations.push("An absence detail lacked a date, time, group, or code."); continue; }
    const isoDate = `${date[3]}-${date[2]}-${date[1]}`;
    const groupCode = /(?:^|\/)([A-Z]{3}\d{4})(?:-\d+)?$/i.exec(item.group)?.[1]?.toUpperCase();
    const subject = subjects.find(record => record.code?.toUpperCase() === groupCode);
    const candidates = courses.filter(record => record.teachingGroupId === item.group || subject && record.subjectExternalId === subject.externalId);
    const timed = candidates.map(course => ({ course, lesson: lessons.find(record => record.courseExternalId === course.externalId && localDateTime(record.startsAt) === `${isoDate} ${hours[1]}`) })).filter(item => item.lesson);
    const course = timed.length === 1 ? timed[0].course : candidates.length === 1 ? candidates[0] : null;
    if (!course) { limitations.push(`No unambiguous captured timetable course matched one absence teaching group: ${item.group}.`); continue; }
    matchedCourseIds.add(course.externalId);
    const lesson = lessons.find(record => record.courseExternalId === course.externalId && localDateTime(record.startsAt) === `${isoDate} ${hours[1]}`);
    if (lesson) matchedLessonIds.add(lesson.externalId);
    else limitations.push(`An absence lesson had no matching captured timetable item on ${isoDate}.`);
    const code = item.code.split(" - ")[0].trim().toUpperCase();
    const absent = ["X", "D", "M"].includes(code);
    const late = code === "R" || /forsink|sen ankomst/i.test(item.code);
    const excusalStatus = code === "D" ? "excused" : code === "X" ? "unexcused" : "unknown";
    const duration = Number(item.hours);
    attendance.push({ kind: "attendance", externalId: `attendance:${digest(`${item.date}|${item.time}|${item.group}|${item.code}`)}`, courseExternalId: course.externalId, lessonExternalId: lesson?.externalId ?? null, date: isoDate, rawStatus: `${item.code}; På fagfravær: ${item.countsTowardSubject}; På vitnemål: ${item.onCertificate}; Halvår: ${item.term}`.slice(0, 240), normalizedStatus: late ? "late" : absent ? "absent" : "unknown", excusalStatus, duration: Number.isFinite(duration) && duration >= 0 ? duration * 60 : null, units: Number.isFinite(duration) && duration >= 0 ? "minutes" : null });
  }
  const includedCourses = courses.filter(record => matchedCourseIds.has(record.externalId));
  const subjectIds = new Set(includedCourses.map(record => record.subjectExternalId));
  const records: InSchoolSnapshot["records"] = [
    ...base.records.filter(record => record.kind === "subject" && subjectIds.has(record.externalId)),
    ...includedCourses,
    ...lessons.filter(record => matchedLessonIds.has(record.externalId)),
    ...attendance,
  ];
  const linkedLessonRows = attendance.filter(record => record.kind === "attendance" && record.lessonExternalId !== null).length;
  return { snapshot: { version: "omega_school_json_v1" as const, source_timestamp: new Date().toISOString(), source_origin: sourceOrigin, timezone: "Europe/Oslo" as const, records }, coverage: { overviewRows, reportedRows, detailRows: unique.length, importedRows: attendance.length, linkedLessonRows, unlinkedLessonRows: attendance.length - linkedLessonRows, complete: reportedRows === overviewRows && attendance.length === unique.length, limitations: [...new Set(limitations)] } };
}
