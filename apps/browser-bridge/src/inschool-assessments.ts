import { createHash } from "node:crypto";
import type { Page } from "playwright-core";

type BaseRecord =
  | { kind: "subject"; externalId: string; title: string; code: string | null }
  | { kind: "course"; externalId: string; title: string; subjectExternalId: string; teachingGroupId: string | null }
  | { kind: string; [key: string]: unknown };
type BaseSnapshot = { version: string; source_origin: string; records: BaseRecord[] };
type Record =
  | { kind: "subject"; externalId: string; title: string; code: string | null }
  | { kind: "course"; externalId: string; title: string; subjectExternalId: string; teachingGroupId: string | null }
  | { kind: "assessment"; externalId: string; courseExternalId: string; title: string; date: string; theme: string; assessmentType: string; detailText: string }
  | { kind: "grade"; externalId: string; courseExternalId: string; assessmentExternalId: string; date: string; rawGrade: string; scale: string; officialWeight: null };

const digest = (value: string) => createHash("sha256").update(value).digest("hex");
const clean = (value: string | null | undefined) => (value ?? "").replace(/\s+/g, " ").trim();
function norwegianDate(value: string) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (!match) throw new Error("inschool_assessment_date_unrecognized");
  const iso = `${match[3]}-${match[2]}-${match[1]}`;
  if (new Date(`${iso}T12:00:00Z`).toISOString().slice(0, 10) !== iso) throw new Error("inschool_assessment_date_invalid");
  return iso;
}

export async function collectInSchoolAssessments(source: Page, base: BaseSnapshot, origin: string) {
  if (base.version !== "omega_school_json_v1" || base.source_origin !== origin || !Array.isArray(base.records)) throw new Error("inschool_assessment_base_snapshot_invalid");
  const page = await source.context().newPage();
  const records: Record[] = [];
  const coveredGroups: Array<{ id: string; rowCount: number; publishedGrades: number }> = [];
  let phase = "overview_navigation";
  try {
    await page.goto(`${origin}/#/app/assessment`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    phase = "overview_rows";
    await page.locator("table tbody tr a[href]").first().waitFor({ timeout: 20_000 });
    const groups = await page.locator("table tbody tr").evaluateAll(rows => rows.map(row => {
      const cells = [...row.querySelectorAll("td")];
      const link = cells[0]?.querySelector("a[href]");
      return { href: link?.getAttribute("href") ?? "", codeLabel: (cells[0]?.textContent ?? "").trim(), name: (cells[1]?.textContent ?? "").replace(/\s+/g, " ").trim() };
    }).filter(row => row.href));
    if (groups.length < 1 || groups.length > 50 || groups.some(group => !/^#\/app\/assessment\/groups\/\d+\/details$/.test(group.href) || !group.name)) throw new Error("inschool_assessment_overview_layout_changed");
    const subjects = base.records.filter((item): item is Extract<BaseRecord, { kind: "subject" }> => item.kind === "subject");
    const courses = base.records.filter((item): item is Extract<BaseRecord, { kind: "course" }> => item.kind === "course");
    for (const group of groups) {
      phase = "group_navigation";
      const groupId = /groups\/(\d+)/.exec(group.href)?.[1];
      if (!groupId) throw new Error("inschool_assessment_group_id_missing");
      const code = /(?:^|\/)([A-Z]{3}\d{4})(?:-\d+)?$/i.exec(group.codeLabel)?.[1]?.toUpperCase() ?? null;
      const matchedSubject = code ? subjects.find(item => item.code?.toUpperCase() === code) : null;
      const subjectExternalId = matchedSubject?.externalId ?? (code ? `subject:${code}` : `subject:assessment:${groupId}`);
      const matches = courses.filter(item => item.subjectExternalId === subjectExternalId);
      const courseExternalId = matches.length === 1 ? matches[0]!.externalId : `course:assessment:${groupId}`;
      if (!records.some(item => item.kind === "subject" && item.externalId === subjectExternalId)) records.push({ kind: "subject", externalId: subjectExternalId, title: matchedSubject?.title ?? group.name.slice(0, 500), code });
      if (!records.some(item => item.kind === "course" && item.externalId === courseExternalId)) records.push({ kind: "course", externalId: courseExternalId, title: matches.length === 1 ? matches[0]!.title : group.name.slice(0, 500), subjectExternalId, teachingGroupId: matches.length === 1 ? matches[0]!.teachingGroupId : null });
      const detailUrl = `${origin}/${group.href}`;
      await page.goto(detailUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await page.locator("main h1").waitFor({ timeout: 20_000 });
      phase = "group_rows";
      for (let attempt = 0, stable = 0, last = -1; attempt < 16 && stable < 3; attempt++) {
        const count = await page.locator("main table tbody tr").count();
        stable = count === last ? stable + 1 : 0;
        last = count;
        await page.waitForTimeout(250);
      }
      const rows = await page.locator("main table tbody tr").evaluateAll(elements => elements.map(element => [...element.querySelectorAll("td")].map(cell => (cell.textContent ?? "").replace(/\s+/g, " ").trim())));
      if (rows.length > 100 || rows.some(row => row.length < 5)) throw new Error("inschool_assessment_detail_layout_changed");
      let publishedGrades = 0;
      for (let index = 0; index < rows.length; index++) {
        phase = "detail_row_parse";
        const row = rows[index]!;
        const title = clean(row[0]).replace(/\s*Se detaljer\s*$/i, "").trim();
        if (!title || title.length > 500) throw new Error("inschool_assessment_title_invalid");
        const date = norwegianDate(clean(row[1]));
        const externalId = `assessment:${digest(`${groupId}|${title}|${date}|${clean(row[3])}`)}`;
        const link = page.locator("main table tbody tr").nth(index).getByText("Se detaljer", { exact: true });
        let detailText = "";
        if (await link.count() === 1) {
          phase = "detail_click";
          await link.click();
          const modal = page.locator(".VsModal").first();
          phase = "detail_modal_wait";
          await modal.waitFor({ timeout: 10_000 });
          phase = "detail_modal_read";
          detailText = (await modal.innerText()).trim().slice(0, 10_000);
          phase = "detail_return_navigation";
          await page.reload({ waitUntil: "domcontentloaded", timeout: 30_000 });
          phase = "detail_return_heading";
          await page.locator("main h1").waitFor({ timeout: 20_000 });
          phase = "detail_return_rows";
          await page.waitForFunction(expected => document.querySelectorAll("main table tbody tr").length === expected, rows.length, { timeout: 15_000 }).catch(() => { throw new Error("inschool_assessment_rows_changed_during_capture"); });
        }
        phase = "detail_store";
        records.push({ kind: "assessment", externalId, courseExternalId, title, date, theme: clean(row[2]).slice(0, 500), assessmentType: clean(row[3]).slice(0, 240), detailText });
        const rawGrade = clean(row[4]);
        if (rawGrade && rawGrade !== "-") {
          records.push({ kind: "grade", externalId: `grade:${externalId}`, courseExternalId, assessmentExternalId: externalId, date, rawGrade: rawGrade.slice(0, 80), scale: "InSchool original", officialWeight: null });
          publishedGrades++;
        }
      }
      coveredGroups.push({ id: groupId, rowCount: rows.length, publishedGrades });
    }
  } catch {
    throw new Error(`inschool_assessment_capture_failed_at_${phase}`);
  } finally { await page.close(); }
  const unique = [...new Map(records.map(item => [`${item.kind}:${item.externalId}`, item])).values()];
  if (!unique.some(item => item.kind === "assessment")) throw new Error("inschool_assessment_records_not_found");
  return { snapshot: { version: "omega_school_json_v1" as const, source_timestamp: new Date().toISOString(), source_origin: origin, timezone: "Europe/Oslo" as const, records: unique }, coverage: { groupCount: coveredGroups.length, assessmentCount: unique.filter(item => item.kind === "assessment").length, gradeCount: unique.filter(item => item.kind === "grade").length, groups: coveredGroups, complete: false, limitation: "Only the rendered current-year subject assessment tables were captured. Other school periods, exam tabs, unrendered groups, and linked OneNote feedback remain unverified." } };
}
