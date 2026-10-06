import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Frame, Page } from "playwright-core";
import type { TeamsAssignmentSnapshot } from "./teams-assignments.js";
import { assignmentSchoolFileRelativePath, schoolFileByteLimit, validateSchoolOriginal } from "./teams-powerpoints.js";

const assignmentOrigin = "https://assignments.edu.cloud.microsoft";
const supportedFile = /\.(?:pptx|pdf|docx|xlsx)$/i;
const maxFiles = 512;
const maxBatchBytes = 1024 * 1024 * 1024;

type ManifestItem = { relativePath: string; stagedName: string; sha256: string; byteLength: number; modifiedAt: string };

function assignmentFrame(page: Page): Frame {
  const frames = page.frames().filter(frame => {
    try { return new URL(frame.url()).origin === assignmentOrigin; } catch { return false; }
  });
  if (frames.length !== 1) throw new Error("teams_assignment_files_frame_missing_or_ambiguous");
  return frames[0];
}

export function validateAssignmentFileSnapshot(snapshot: TeamsAssignmentSnapshot): void {
  if (snapshot.version !== "omega_teams_assignments_json_v1" || snapshot.source_origin !== assignmentOrigin || !Array.isArray(snapshot.records) || snapshot.records.length < 1 || snapshot.records.length > 500) throw new Error("teams_assignment_files_snapshot_invalid");
  const keys = new Set<string>();
  for (const record of snapshot.records) {
    if (typeof record.classExternalId !== "string" || !record.classExternalId || record.classExternalId.length > 200 || typeof record.assignmentExternalId !== "string" || !record.assignmentExternalId || record.assignmentExternalId.length > 200 || typeof record.courseTitle !== "string" || !record.courseTitle || record.courseTitle.length > 500 || !["available", "not_assigned"].includes(record.detailState) || !Array.isArray(record.linkedFileNames) || record.linkedFileNames.length > 100 || record.linkedFileNames.some(name => typeof name !== "string" || !name || name.length > 500)) throw new Error("teams_assignment_files_snapshot_record_invalid");
    const url = new URL(record.detailUrl);
    if (url.origin !== assignmentOrigin || url.username || url.password || url.search || url.hash || url.pathname !== `/classes/${encodeURIComponent(record.classExternalId)}/assignments/${encodeURIComponent(record.assignmentExternalId)}`) throw new Error("teams_assignment_files_snapshot_route_invalid");
    const key = `${record.classExternalId}:${record.assignmentExternalId}`;
    if (keys.has(key)) throw new Error("teams_assignment_files_snapshot_duplicate");
    keys.add(key);
  }
}

export async function collectTeamsAssignmentFiles(source: Page, snapshot: TeamsAssignmentSnapshot, stagingRoot: string): Promise<{ manifest: { version: "omega_personal_files_v1"; deviceKey: "teams-sharepoint"; items: ManifestItem[] }; report: { assignments: number; resources: number; eligible: number; downloaded: number; unsupported: number; bytes: number; coverageComplete: false; coverageLimitation: string } }> {
  validateAssignmentFileSnapshot(snapshot);
  const sourceUrl = new URL(source.url());
  if (!["https://teams.microsoft.com", "https://teams.cloud.microsoft"].includes(sourceUrl.origin) || sourceUrl.username || sourceUrl.password) throw new Error("teams_assignment_files_source_invalid");
  const probe = await source.context().newPage();
  const items: ManifestItem[] = [];
  let resources = 0, eligible = 0, unsupported = 0, bytes = 0;
  let stage = "open";
  await mkdir(path.join(stagingRoot, "files"), { recursive: true });
  try {
    await probe.goto(source.url(), { waitUntil: "domcontentloaded", timeout: 30_000 });
    stage = "navigation";
    const nav = probe.getByRole("button", { name: /^Assignments \(Ctrl\+Shift\+4\)$/ });
    await nav.waitFor({ timeout: 25_000 });
    if (await nav.count() !== 1) throw new Error("teams_assignment_files_navigation_ambiguous");
    await nav.click();
    let frame: Frame | null = null;
    for (let attempt = 0; attempt < 100 && !frame; attempt++) {
      try { frame = assignmentFrame(probe); } catch { await probe.waitForTimeout(250); }
    }
    if (!frame) throw new Error("teams_assignment_files_frame_not_loaded");
    for (const [recordIndex, record] of snapshot.records.entries()) {
      if (record.detailState !== "available") continue;
      stage = `detail_open_${recordIndex}`;
      frame = assignmentFrame(probe);
      await frame.goto(record.detailUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
      if (new URL(frame.url()).origin !== assignmentOrigin || new URL(frame.url()).pathname !== new URL(record.detailUrl).pathname) throw new Error("teams_assignment_files_detail_redirected");
      stage = `detail_wait_${recordIndex}`;
      await frame.locator('[class*="assignment-details-container"]').waitFor({ timeout: 25_000 });
      await frame.locator('[class*="assignment-details-files-container"]').first().waitFor({ timeout: 15_000 });
      stage = `resource_read_${recordIndex}`;
      const resourceButtons = frame.locator('[class*="assignment-details-files-container"] [class*="resource-well"] button[class*="open-button"]');
      const names = (await resourceButtons.allTextContents()).map(value => value.replace(/\s+/g, " ").trim());
      if (names.length > 100 || names.some(name => !name || name.length > 500)) throw new Error("teams_assignment_files_resource_list_invalid");
      if (record.linkedFileNames.length && names.some(name => !record.linkedFileNames.includes(name))) throw new Error("teams_assignment_files_resource_list_changed");
      resources += names.length;
      const duplicates = new Map<string, number>();
      for (const [index, name] of names.entries()) {
        if (!supportedFile.test(name)) { unsupported++; continue; }
        stage = `download_${recordIndex}_${index}`;
        eligible++;
        if (items.length >= maxFiles) throw new Error("teams_assignment_files_count_limit_exceeded");
        const ordinal = duplicates.get(name) ?? 0;
        duplicates.set(name, ordinal + 1);
        const relativePath = assignmentSchoolFileRelativePath(record.courseTitle, record.classExternalId, record.assignmentExternalId, name, ordinal);
        const more = resourceButtons.nth(index).locator('xpath=..').locator('button[class*="more-options-button"]');
        if (await more.count() !== 1) throw new Error("teams_assignment_files_menu_ambiguous");
        await more.click();
        const action = frame.getByRole("menuitem", { name: "Download", exact: true });
        if (await action.count() !== 1) throw new Error("teams_assignment_files_download_action_missing");
        const download = await Promise.all([probe.waitForEvent("download", { timeout: 30_000 }), action.click({ timeout: 10_000, noWaitAfter: true })]).then(([item]) => item);
        let timer: ReturnType<typeof setTimeout> | undefined;
        const filePath = await Promise.race([download.path(), new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("teams_assignment_files_download_timeout")), 60_000); })]).finally(() => { if (timer) clearTimeout(timer); });
        const metadata = await stat(filePath);
        if (!metadata.isFile() || metadata.size < 1 || metadata.size > schoolFileByteLimit(name) || bytes + metadata.size > maxBatchBytes) throw new Error("teams_assignment_files_download_size_invalid");
        if (!download.suggestedFilename().toLowerCase().endsWith(name.slice(name.lastIndexOf(".")).toLowerCase())) throw new Error("teams_assignment_files_download_type_changed");
        const contents = await readFile(filePath);
        validateSchoolOriginal(name, contents);
        const sha256 = createHash("sha256").update(contents).digest("hex");
        const stagedPath = path.join(stagingRoot, "files", sha256);
        await writeFile(stagedPath, contents, { flag: "wx" }).catch(async error => {
          if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
          if (createHash("sha256").update(await readFile(stagedPath)).digest("hex") !== sha256) throw new Error("teams_assignment_files_staged_hash_mismatch");
        });
        items.push({ relativePath, stagedName: sha256, sha256, byteLength: contents.length, modifiedAt: new Date().toISOString() });
        bytes += contents.length;
      }
    }
    return { manifest: { version: "omega_personal_files_v1", deviceKey: "teams-sharepoint", items }, report: { assignments: snapshot.records.length, resources, eligible, downloaded: items.length, unsupported, bytes, coverageComplete: false, coverageLimitation: "Only rendered assignment PPTX/PDF/DOCX/XLSX resources were downloaded; other formats, older server-side history, and submission files remain unverified." } };
  } catch (caught) {
    if (caught instanceof Error && /^teams_[a-z0-9_]{1,95}$/.test(caught.message)) throw caught;
    throw new Error(`teams_assignment_files_${stage}_failed`);
  } finally { await probe.close(); }
}
