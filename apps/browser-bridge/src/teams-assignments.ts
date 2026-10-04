import type { Frame, Page } from "playwright-core";

export type TeamsAssignmentSnapshot = {
  version: "omega_teams_assignments_json_v1";
  source_timestamp: string;
  source_origin: "https://assignments.edu.cloud.microsoft";
  coverage: { listRoute: string; visibleCardCount: number; capturedDetailCount: number; complete: boolean; limitation: string | null };
  records: Array<{
    classExternalId: string;
    assignmentExternalId: string;
    title: string;
    courseTitle: string;
    dueSummary: string;
    instructions: string;
    metadataText: string;
    pointsText: string;
    cardText: string;
    linkedFileNames: string[];
    detailUrl: string;
  }>;
};

const assignmentOrigin = "https://assignments.edu.cloud.microsoft" as const;
const teamsOrigins = new Set(["https://teams.microsoft.com", "https://teams.cloud.microsoft"]);

function assignmentFrame(page: Page): Frame {
  const frames = page.frames().filter(frame => {
    try { return new URL(frame.url()).origin === assignmentOrigin; } catch { return false; }
  });
  if (frames.length !== 1) throw new Error("teams_assignments_frame_missing_or_ambiguous");
  return frames[0];
}

function assignmentIdentity(urlText: string): { classExternalId: string; assignmentExternalId: string } {
  const url = new URL(urlText);
  if (url.origin !== assignmentOrigin || url.username || url.password || url.port) throw new Error("teams_assignment_detail_origin_invalid");
  const match = /^\/classes\/([^/]+)\/assignments\/([^/]+)$/.exec(url.pathname);
  if (!match || match[1].length > 200 || match[2].length > 200) throw new Error("teams_assignment_detail_route_changed");
  return { classExternalId: decodeURIComponent(match[1]), assignmentExternalId: decodeURIComponent(match[2]) };
}

export async function collectTeamsAssignments(signedInPage: Page): Promise<TeamsAssignmentSnapshot> {
  const start = new URL(signedInPage.url());
  if (!teamsOrigins.has(start.origin) || start.username || start.password) throw new Error("teams_signed_in_tab_origin_invalid");
  const probe = await signedInPage.context().newPage();
  let stage = "open";
  try {
    await probe.goto(signedInPage.url(), { waitUntil: "domcontentloaded", timeout: 30_000 });
    if (!teamsOrigins.has(new URL(probe.url()).origin)) throw new Error("teams_probe_left_registered_origin");
    stage = "navigation";
    const nav = probe.getByRole("button", { name: /^Assignments \(Ctrl\+Shift\+4\)$/ });
    await nav.waitFor({ timeout: 25_000 });
    if (await nav.count() !== 1) throw new Error("teams_assignments_navigation_ambiguous");
    await nav.click();
    let frame: Frame | null = null;
    for (let attempt = 0; attempt < 100 && !frame; attempt++) {
      try { frame = assignmentFrame(probe); } catch { await probe.waitForTimeout(250); }
    }
    if (!frame) throw new Error("teams_assignments_frame_not_loaded");
    stage = "list_open";
    const viewAssignments = frame.getByRole("link", { name: /^View assignments$/i });
    await viewAssignments.waitFor({ timeout: 25_000 });
    if (await viewAssignments.count() !== 1) throw new Error("teams_view_assignments_navigation_ambiguous");
    await viewAssignments.click();
    await frame.locator(".aui-assignmentListCard").first().waitFor({ timeout: 25_000 });
    const listUrl = frame.url();
    const parsedList = new URL(listUrl);
    if (parsedList.origin !== assignmentOrigin || parsedList.pathname !== "/classes/all/list" || parsedList.search || parsedList.hash) throw new Error("teams_assignment_list_route_changed");
    stage = "list_read";
    const cards = await frame.locator(".aui-assignmentListCard").evaluateAll(elements => elements.map(element => ({
      id: element.id,
      text: (element.textContent ?? "").replace(/\s+/g, " ").trim(),
      dueSummary: (element.querySelector('[class*="CardHeader__description"]')?.children[0]?.textContent ?? "").replace(/\s+/g, " ").trim(),
      courseTitle: (element.querySelector('[class*="CardHeader__description"]')?.children[1]?.textContent ?? "").replace(/\s+/g, " ").trim(),
    })));
    if (cards.length === 0 || cards.length > 500 || cards.some(card => !card.id || !card.text || !card.courseTitle || card.text.length > 8_000 || card.courseTitle.length > 500 || card.dueSummary.length > 500)) throw new Error("teams_assignment_list_invalid_or_unbounded");
    const records: TeamsAssignmentSnapshot["records"] = [];
    for (let index = 0; index < cards.length; index++) {
      if (index > 0) {
        stage = "list_return";
        await frame.goto(listUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
        await frame.locator(".aui-assignmentListCard").first().waitFor({ timeout: 25_000 });
      }
      const current = frame.locator(".aui-assignmentListCard");
      if (await current.count() !== cards.length) throw new Error("teams_assignment_list_changed_during_capture");
      const card = current.nth(index);
      if (await card.getAttribute("id") !== cards[index].id) throw new Error("teams_assignment_list_reordered_during_capture");
      stage = "detail_open";
      await card.click();
      await frame.locator('[class*="assignment-details-container"]').waitFor({ timeout: 25_000 });
      const ids = assignmentIdentity(frame.url());
      stage = "detail_read";
      const detail = await frame.evaluate(String.raw`(() => {
        const text = selector => (document.querySelector(selector)?.innerText ?? "").replace(/\s+/g, " ").trim();
        const linkedFileNames = [...document.querySelectorAll('[class*="assignment-details-files-container"] a')].map(element => (element.textContent ?? "").replace(/\s+/g, " ").trim()).filter(Boolean).slice(0, 100);
        return { title: text('[class*="assignment-title"]'), instructions: text('[class*="assignment-details-description"]'), metadataText: text('[class*="assignment-metadata-container"]'), pointsText: text('[class*="assignment-details-right-pane"]'), linkedFileNames };
      })()`) as { title: string; instructions: string; metadataText: string; pointsText: string; linkedFileNames: string[] };
      if (!detail.title || detail.title.length > 500 || detail.instructions.length > 100_000 || detail.metadataText.length > 8_000 || detail.pointsText.length > 8_000) throw new Error("teams_assignment_detail_invalid_or_unbounded");
      const detailUrl = new URL(frame.url());
      records.push({ ...ids, ...detail, cardText: cards[index].text, courseTitle: cards[index].courseTitle, dueSummary: cards[index].dueSummary, detailUrl: `${detailUrl.origin}${detailUrl.pathname}` });
    }
    if (new Set(records.map(item => `${item.classExternalId}:${item.assignmentExternalId}`)).size !== records.length) throw new Error("teams_assignment_duplicate_identity");
    return { version: "omega_teams_assignments_json_v1", source_timestamp: new Date().toISOString(), source_origin: assignmentOrigin, coverage: { listRoute: parsedList.pathname, visibleCardCount: cards.length, capturedDetailCount: records.length, complete: false, limitation: "Only cards visible in the Teams Assignments list were captured. Other filters, classes, pagination, attachments, and submission details have not been verified." }, records };
  } catch (caught) {
    if (caught instanceof Error && /^teams_[a-z0-9_]+$/.test(caught.message)) throw caught;
    throw new Error(`teams_assignment_${stage}_failed`);
  } finally { await probe.close(); }
}
