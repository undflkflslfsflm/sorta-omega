import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Frame, Page } from "playwright-core";

type Entry = { name: string; rowIndex: number; folder: boolean };
type ManifestItem = { relativePath: string; stagedName: string; sha256: string; byteLength: number; modifiedAt: string };

const maxClasses = 30;
const maxFolders = 200;
const maxDepth = 6;
const maxFiles = 512;
const maxFileBytes = 25 * 1024 * 1024;
const maxBatchBytes = 300 * 1024 * 1024;

export function safeSegment(value: string): string {
  const cleaned = value.normalize("NFC").replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().replace(/[. ]+$/, "");
  if (!cleaned || cleaned === "." || cleaned === "..") throw new Error("teams_file_path_segment_invalid");
  return cleaned.slice(0, 180);
}

async function visibleEntries(frame: Frame): Promise<{ entries: Entry[]; totalRows: number | null }> {
  const snapshot = await frame.evaluate(() => {
    const grid = document.querySelector<HTMLElement>('[role="grid"]');
    const totalText = grid?.getAttribute("aria-rowcount") ?? "";
    const entries = [...document.querySelectorAll<HTMLElement>('[role="row"]')].flatMap((row, rowIndex) => {
      if (row.getAttribute("data-automationid") === "row-header") return [];
      const name = (row.querySelector('[data-automationid="field-LinkFilename"]')?.textContent ?? "").trim();
      const iconCell = row.querySelector<HTMLElement>('[data-automationid="field-DocIcon"]');
      const iconLabels = [...(iconCell?.querySelectorAll<HTMLElement>('[title], [aria-label]') ?? [])].map(icon => icon.getAttribute("title") ?? icon.getAttribute("aria-label") ?? "");
      return name ? [{ name, rowIndex, folder: iconLabels.some(label => /folder/i.test(label)) }] : [];
    });
    return { entries, totalRows: /^\d+$/.test(totalText) ? Number(totalText) : null };
  });
  if (snapshot.totalRows !== null && snapshot.totalRows > snapshot.entries.length + 1) throw new Error("teams_sharepoint_virtualized_rows_not_captured");
  if (snapshot.entries.length > 1000) throw new Error("teams_sharepoint_folder_too_large");
  return snapshot;
}

async function waitForGrid(frame: Frame): Promise<void> {
  await frame.locator('[role="row"]').first().waitFor({ timeout: 20_000 });
  let previous = -1, stable = 0;
  for (let attempt = 0; attempt < 40; attempt++) {
    const state = await frame.evaluate(() => ({
      rows: document.querySelectorAll('[role="row"]').length,
      empty: /this folder is empty|no files|ingen filer|mappen er tom/i.test(document.body?.innerText ?? ""),
    }));
    stable = state.rows === previous ? stable + 1 : 0;
    previous = state.rows;
    if (stable >= 3 && (state.rows > 1 || state.empty)) return;
    await frame.waitForTimeout(500);
  }
  throw new Error("teams_sharepoint_grid_not_loaded");
}

async function enterFolder(frame: Frame, name: string): Promise<void> {
  const entries = (await visibleEntries(frame)).entries;
  const matches = entries.filter(entry => entry.folder && entry.name === name);
  if (matches.length !== 1) throw new Error("teams_sharepoint_folder_changed");
  await frame.locator('[role="row"]').nth(matches[0].rowIndex).locator('[data-automationid="field-LinkFilename"]').dblclick();
  await waitForGrid(frame);
}

async function goToFolder(frame: Frame, rootLabel: string, segments: string[]): Promise<void> {
  const root = frame.getByRole("button", { name: rootLabel, exact: true });
  if (await root.count() !== 1) throw new Error("teams_sharepoint_root_breadcrumb_missing");
  await root.click();
  await waitForGrid(frame);
  for (const segment of segments) await enterFolder(frame, segment);
}

function sharePointFrame(page: Page): Frame {
  const frames = page.frames().filter(frame => { try { return new URL(frame.url()).hostname === "akershusfylke.sharepoint.com"; } catch { return false; } });
  if (frames.length !== 1) throw new Error("teams_sharepoint_frame_missing_or_ambiguous");
  return frames[0];
}

export async function collectTeamsPowerpoints(source: Page, stagingRoot: string, classIndexOnly?: number): Promise<{ manifest: { version: string; deviceKey: string; items: ManifestItem[] }; report: { classes: number; folders: number; entries: number; folderCandidates: number; presentations: number; bytes: number; coverageComplete: false; coverageLimitation: string } }> {
  const probe = await source.context().newPage();
  const items: ManifestItem[] = [];
  let totalBytes = 0, classCount = 0, folderCount = 0, processedClasses = 0, entriesObserved = 0, folderCandidates = 0;
  await mkdir(path.join(stagingRoot, "files"), { recursive: true });
  try {
    await probe.goto(source.url(), { waitUntil: "domcontentloaded", timeout: 30_000 });
    const teamsNav = probe.getByRole("button", { name: /^Teams \(Ctrl\+Shift\+5\)$/ });
    await teamsNav.waitFor({ timeout: 20_000 });
    await teamsNav.click();
    const classes = probe.locator(".fui-AccordionItem").filter({ hasText: /Classes\s*\d+\s*teams/i });
    await classes.waitFor({ timeout: 20_000 });
    if (await classes.count() !== 1) throw new Error("teams_classes_accordion_ambiguous");
    const header = classes.locator(".fui-AccordionHeader__button");
    if (await header.getAttribute("aria-expanded") === "false") await header.click();
    const cards = classes.locator('[role="group"]');
    await cards.first().waitFor({ timeout: 15_000 });
    classCount = await cards.count();
    if (classCount < 1 || classCount > maxClasses) throw new Error("teams_class_count_unbounded");
    if (classIndexOnly !== undefined && (!Number.isInteger(classIndexOnly) || classIndexOnly < 0 || classIndexOnly >= classCount)) throw new Error("teams_class_index_invalid");
    for (let classIndex = 0; classIndex < classCount; classIndex++) {
      if (classIndexOnly !== undefined && classIndex !== classIndexOnly) continue;
      processedClasses++;
      const className = safeSegment((await cards.nth(classIndex).textContent() ?? "").replace(/\s+/g, " ").trim());
      await cards.nth(classIndex).click();
      const general = probe.getByRole("treeitem", { name: /^(General|Generelt)$/ });
      await general.waitFor({ timeout: 15_000 });
      if (await general.count() !== 1) throw new Error("teams_general_channel_ambiguous");
      const rootLabel = (await general.textContent() ?? "").trim();
      await general.click();
      const shared = probe.getByRole("tab", { name: /^(Shared|Files|Filer)$/ });
      await shared.waitFor({ timeout: 15_000 });
      if (await shared.count() !== 1) throw new Error("teams_shared_tab_ambiguous");
      await shared.click();
      await probe.waitForTimeout(3_000);
      const frame = sharePointFrame(probe);
      await waitForGrid(frame);
      const folders: string[][] = [[]];
      const seen = new Set<string>();
      for (let next = 0; next < folders.length; next++) {
        const segments = folders[next];
        const key = segments.join("\0");
        if (seen.has(key)) continue;
        seen.add(key);
        if (++folderCount > maxFolders) throw new Error("teams_sharepoint_folder_limit_exceeded");
        await goToFolder(frame, rootLabel, segments);
        const entries = (await visibleEntries(frame)).entries;
        entriesObserved += entries.length;
        for (const entry of entries) {
          if (entry.folder) {
            folderCandidates++;
            if (segments.length < maxDepth) folders.push([...segments, entry.name]);
            else throw new Error("teams_sharepoint_folder_depth_exceeded");
            continue;
          }
          if (!/\.pptx$/i.test(entry.name)) continue;
          if (items.length >= maxFiles) throw new Error("teams_powerpoint_file_limit_exceeded");
          const relativePath = ["Teams", className, safeSegment(rootLabel), ...segments.map(safeSegment), safeSegment(entry.name)].join("/");
          const row = frame.locator('[role="row"]').nth(entry.rowIndex);
          await row.click();
          const downloadButton = frame.getByRole("menuitem", { name: /^Download$/ });
          await downloadButton.waitFor({ timeout: 10_000 });
          const download = await Promise.all([probe.waitForEvent("download", { timeout: 30_000 }), downloadButton.click()]).then(([item]) => item);
          const filePath = await download.path();
          const metadata = await stat(filePath);
          if (!metadata.isFile() || metadata.size < 1 || metadata.size > maxFileBytes || totalBytes + metadata.size > maxBatchBytes) throw new Error("teams_powerpoint_size_limit_exceeded");
          const bytes = await readFile(filePath);
          if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) throw new Error("teams_powerpoint_archive_invalid");
          const sha256 = createHash("sha256").update(bytes).digest("hex");
          const stagedPath = path.join(stagingRoot, "files", sha256);
          await writeFile(stagedPath, bytes, { flag: "wx" }).catch(async error => {
            if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
            if (createHash("sha256").update(await readFile(stagedPath)).digest("hex") !== sha256) throw new Error("teams_powerpoint_staged_hash_mismatch");
          });
          items.push({ relativePath, stagedName: sha256, sha256, byteLength: bytes.length, modifiedAt: new Date().toISOString() });
          totalBytes += bytes.length;
        }
      }
      await probe.getByText("All teams", { exact: true }).click();
      await cards.first().waitFor({ timeout: 15_000 });
    }
  } finally { await probe.close(); }
  return { manifest: { version: "omega_personal_files_v1", deviceKey: "teams-sharepoint", items }, report: { classes: processedClasses, folders: folderCount, entries: entriesObserved, folderCandidates, presentations: items.length, bytes: totalBytes, coverageComplete: false, coverageLimitation: "General-channel Shared folders only. Other channels, Classwork, post attachments, virtualized rows, and image-only slides are not yet covered." } };
}
