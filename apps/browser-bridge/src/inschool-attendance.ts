import { createHash } from "node:crypto";
import type { Page } from "playwright-core";
import type { InSchoolSnapshot } from "../../api/src/school-snapshot.js";

type Detail = { date: string; code: string; time: string; hours: string; group: string; recordedBy: string; countsTowardSubject: string; onCertificate: string; term: string };
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
const localDateTime = (iso: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Oslo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));

export async function collectInSchoolAttendance(page: Page, base: InSchoolSnapshot, sourceOrigin: string) {
  if (new URL(page.url()).origin !== sourceOrigin || !page.url().includes("#/app/attendance/lessons")) throw new Error("inschool_attendance_page_required");
  const table = page.locator("table").first();
  await table.locator("tbody tr").first().waitFor({ timeout: 20_000 });
  const headers = await table.locator("thead th").allTextContents();
  if (!headers.some(value => value.trim() === "Dato") || !headers.some(value => value.trim() === "Type")) throw new Error("inschool_attendance_layout_changed");
  const rowCount = await table.locator("tbody tr").count();
  if (rowCount < 1 || rowCount > 500) throw new Error("inschool_attendance_row_count_outside_bounds");
  const reportedRows = Number(await table.getAttribute("aria-rowcount"));
  const details: Detail[] = [];
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
  const unique = [...new Map(details.map(item => [JSON.stringify(item), item])).values()];
  const courses = base.records.filter(record => record.kind === "course");
  const lessons = base.records.filter(record => record.kind === "lesson");
  const matchedCourseIds = new Set<string>();
  const matchedLessonIds = new Set<string>();
  const attendance: InSchoolSnapshot["records"] = [];
  const limitations: string[] = [];
  for (const item of unique) {
    const date = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(item.date);
    const hours = /^(\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2})$/.exec(item.time);
    if (!date || !hours || !item.group || !item.code) { limitations.push("An absence detail lacked a date, time, group, or code."); continue; }
    const isoDate = `${date[3]}-${date[2]}-${date[1]}`;
    const course = courses.find(record => record.teachingGroupId === item.group);
    if (!course) { limitations.push(`No captured timetable course matched one absence teaching group: ${item.group}.`); continue; }
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
  return { snapshot: { version: "omega_school_json_v1" as const, source_timestamp: new Date().toISOString(), source_origin: sourceOrigin, timezone: "Europe/Oslo" as const, records }, coverage: { overviewRows: rowCount, reportedRows: Number.isFinite(reportedRows) ? reportedRows : null, detailRows: unique.length, importedRows: attendance.length, complete: reportedRows === rowCount && attendance.length === unique.length, limitations: [...new Set(limitations)] } };
}
