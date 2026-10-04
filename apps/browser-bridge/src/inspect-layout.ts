import { chromium } from "playwright-core";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Development-only structural probe. Section table previews can include private
// record text; run locally only and never save its output to the public repo.
const args = new Map<string, string>();
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index], value = process.argv[index + 1];
  if (!key?.startsWith("--") || !value) throw new Error("usage: inspect-layout --cdp http://127.0.0.1:9222 --provider teams|inschool [--origin https://mailand.inschool.visma.no]");
  args.set(key.slice(2), value);
}
let endpointText = args.get("cdp");
if (args.get("cdp-profile") || args.get("cdp-brave") === "true") {
  const profile = args.get("cdp-profile") ?? path.join(process.env.LOCALAPPDATA ?? "", "BraveSoftware", "Brave-Browser", "User Data");
  if (!path.isAbsolute(profile) || endpointText) throw new Error("absolute_cdp_profile_without_endpoint_required");
  const [portText, socketPath] = (await readFile(path.join(profile, "DevToolsActivePort"), "utf8")).trim().split(/\r?\n/);
  const port = Number(portText);
  if (!Number.isInteger(port) || port < 1024 || port > 65535 || !/^\/devtools\/browser\/[a-zA-Z0-9-]+$/.test(socketPath ?? "")) throw new Error("cdp_profile_port_file_invalid");
  endpointText = `ws://127.0.0.1:${port}${socketPath}`;
}
const endpoint = new URL(endpointText ?? "");
if (!["http:", "ws:"].includes(endpoint.protocol) || !["127.0.0.1", "localhost"].includes(endpoint.hostname) || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || endpoint.protocol === "http:" && endpoint.pathname !== "/" || endpoint.protocol === "ws:" && !/^\/devtools\/browser\/[a-zA-Z0-9-]+$/.test(endpoint.pathname)) throw new Error("local_cdp_endpoint_required");
const provider = args.get("provider");
if (provider !== "teams" && provider !== "inschool") throw new Error("provider_required");
const expectedOrigin = provider === "inschool" ? new URL(args.get("origin") ?? "").origin : null;
if (provider === "inschool" && (!expectedOrigin || !new URL(expectedOrigin).hostname.endsWith(".inschool.visma.no"))) throw new Error("inschool_origin_invalid");
const browser = await chromium.connectOverCDP(endpoint.toString()).catch(() => { throw new Error("cdp_connection_failed"); });
try {
  let page = browser.contexts().flatMap(context => context.pages()).find(candidate => {
    try { const origin = new URL(candidate.url()).origin; return provider === "teams" ? ["https://teams.microsoft.com", "https://teams.cloud.microsoft"].includes(origin) : origin === expectedOrigin; } catch { return false; }
  });
  let authProbed = false;
  if (!page && provider === "inschool" && args.get("probe-inschool-auth") === "true") {
    const probe = await browser.contexts()[0].newPage();
    try {
      await probe.goto(expectedOrigin!, { waitUntil: "domcontentloaded", timeout: 15_000 });
      const destination = new URL(probe.url());
      const auth = await probe.evaluate(() => ({
        passwordFields: document.querySelectorAll('input[type="password"]').length,
        timetableVisible: document.querySelectorAll(".userTimetable_currentWeek").length === 1,
      }));
      console.log(JSON.stringify({ provider, probe: { origin: destination.origin, routeShape: destination.pathname.replace(/\d+/g, "*"), ...auth } }));
    } finally { await probe.close(); }
    authProbed = true;
  }
  if (!authProbed) {
  if (!page) throw new Error("matching_tab_not_found");
  if (args.get("inschool-section") && provider === "inschool") {
    const section = args.get("inschool-section");
    if (!section || !["attendance", "attendance/lessons", "attendance/future", "assessment"].includes(section)) throw new Error("inschool_section_not_registered");
    const probe = await browser.contexts()[0].newPage();
    try {
      await probe.goto(`${expectedOrigin}/#/app/${section}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await probe.waitForTimeout(5_000);
      const structure = await probe.evaluate(() => {
        const clean = (value: string | null) => (value ?? "").split(/\s+/).filter(token => /^[a-zA-Z][a-zA-Z0-9_-]{0,70}$/.test(token)).slice(0, 6);
        const candidates = [...document.querySelectorAll<HTMLElement>('main [class*="attendance" i], main [class*="assessment" i], main [class*="grade" i], main [class*="frav" i], main table, main [role="grid"], main [role="row"], main [role="tab"]')].slice(0, 100);
        return {
          routeShape: `${location.pathname}${location.hash}`,
          bodyCharacters: document.body?.innerText?.length ?? 0,
          counts: { tables: document.querySelectorAll("table").length, rows: document.querySelectorAll('tr, [role="row"]').length, tabs: document.querySelectorAll('[role="tab"]').length },
          tabs: [...document.querySelectorAll<HTMLElement>('[role="tab"]')].map(item => ({ label: (item.textContent ?? "").trim().slice(0, 60), selected: item.getAttribute("aria-selected"), hrefShape: item.getAttribute("href")?.replace(/\d+/g, "*") ?? null })),
          table: [...document.querySelectorAll<HTMLTableElement>("table")].map(item => ({
            reportedRows: item.getAttribute("aria-rowcount"),
            headers: [...item.querySelectorAll("thead th")].map(cell => (cell.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80)),
            rows: [...item.querySelectorAll("tbody tr")].slice(0, 3).map(row => [...row.querySelectorAll("td")].map(cell => ({ text: (cell.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 120), classes: clean(cell.className), attributes: [...cell.attributes].map(attribute => attribute.name).filter(name => name !== "style").slice(0, 8) }))),
          })),
          pagingControls: [...document.querySelectorAll<HTMLElement>('main button, main select, main [role="combobox"]')].map(item => ({ tag: item.tagName.toLowerCase(), label: (item.getAttribute("aria-label") ?? item.getAttribute("title") ?? item.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80), disabled: item.hasAttribute("disabled"), classes: clean(item.className) })).filter(item => /page|side|neste|forrige|rad|row|vis|show|\b\d+\b/i.test(item.label)).slice(0, 30),
          headings: [...document.querySelectorAll<HTMLElement>("main h1, main h2, main h3")].slice(0, 15).map(item => ({ tag: item.tagName.toLowerCase(), text: (item.textContent ?? "").trim().slice(0, 60), classes: clean(item.className) })),
          candidates: candidates.map(item => ({ tag: item.tagName.toLowerCase(), role: item.getAttribute("role"), classes: clean(item.getAttribute("class")), attributes: [...item.attributes].map(attribute => attribute.name).filter(name => name !== "class" && name !== "style").slice(0, 8), childCount: item.children.length, textLength: (item.textContent ?? "").trim().length })),
        };
      });
      let detail: unknown = null;
      if (section === "attendance/lessons" && args.get("inspect-first-detail") === "true") {
        const action = probe.locator("table").first().locator("tbody tr").first().getByText("Se fravær");
        if (await action.count() === 1) {
          await action.click();
          await probe.waitForTimeout(1_000);
          detail = await probe.evaluate(() => ({
            dialogs: [...document.querySelectorAll<HTMLElement>('[role="dialog"], .modal, [class*="modal" i]')].slice(0, 8).map(element => ({ text: (element.innerText ?? "").trim().slice(0, 3_000), classes: element.className, tables: [...element.querySelectorAll("table")].map(table => ({ headers: [...table.querySelectorAll("th")].map(cell => cell.textContent?.trim()), rows: [...table.querySelectorAll("tbody tr")].slice(0, 8).map(row => [...row.querySelectorAll("td")].map(cell => cell.textContent?.trim())) })) })),
            routeShape: `${location.pathname}${location.hash}`,
          }));
        }
      }
      console.log(JSON.stringify({ provider, section, structure, detail }));
    } finally { await probe.close(); }
  } else if (args.get("teams-first-class-open") === "true" && provider === "teams") {
    const probe = await browser.contexts()[0].newPage();
    try {
      await probe.goto(page.url(), { waitUntil: "domcontentloaded", timeout: 30_000 });
      const teamsNavigation = probe.getByRole("button", { name: /^Teams \(Ctrl\+Shift\+5\)$/ });
      await teamsNavigation.waitFor({ timeout: 20_000 });
      if (await teamsNavigation.count() !== 1) throw new Error("teams_navigation_ambiguous");
      await teamsNavigation.click();
      const classes = probe.locator(".fui-AccordionItem").filter({ hasText: /Classes\s*\d+\s*teams/i });
      await classes.waitFor({ timeout: 20_000 }).catch(async () => {
        const state = await probe.evaluate(String.raw`(() => ({ routeShape: location.pathname + location.hash, classesHeaders: [...document.querySelectorAll('.fui-AccordionItem button')].map(node => (node.textContent ?? '').replace(/\s+/g, ' ').trim()).filter(text => /^Classes/i.test(text)).slice(0, 10), navigationLabels: [...document.querySelectorAll('button')].map(node => node.getAttribute('aria-label') ?? '').filter(text => /Teams|Classes/i.test(text)).slice(0, 10) }))()`);
        console.log(JSON.stringify({ provider, probeState: state }));
        throw new Error("teams_classes_accordion_not_loaded");
      });
      if (await classes.count() !== 1) throw new Error("teams_classes_accordion_ambiguous");
      const header = classes.locator(".fui-AccordionHeader__button");
      if (await header.count() !== 1) throw new Error("teams_classes_header_ambiguous");
      if (await header.getAttribute("aria-expanded") === "false") await header.click();
      const cards = classes.locator('[role="group"]');
      await cards.first().waitFor({ timeout: 15_000 });
      const count = await cards.count();
      if (count < 1 || count > 30) throw new Error("teams_class_card_count_unbounded");
      const classIndexText = args.get("class-index") ?? "0";
      if (!/^\d{1,2}$/.test(classIndexText) || Number(classIndexText) >= count) throw new Error("teams_class_index_invalid");
      const classIndex = Number(classIndexText);
      const classCategories = [];
      for (let index = 0; index < count; index++) {
        const label = await cards.nth(index).textContent() ?? "";
        classCategories.push({ math: /matematikk|math/i.test(label), history: /historie|history/i.test(label), economics: /økonomi|economics/i.test(label) });
      }
      await cards.nth(classIndex).click();
      await probe.waitForTimeout(5_000);
      const screenshotPath = args.get("screenshot-path");
      if (screenshotPath) await probe.screenshot({ path: screenshotPath, fullPage: false });
      const structure = await probe.evaluate(String.raw`(() => {
        const clean = node => (node.getAttribute("class") ?? "").split(/\s+/).filter(token => /^[a-zA-Z][a-zA-Z0-9_-]{0,70}$/.test(token)).slice(0, 6);
        const candidate = document.querySelector('[role="tablist"], [class*="channel" i], [class*="post" i], [role="list"]');
        const postCandidates = [...document.querySelectorAll('[data-tid*="post" i], [class*="post" i], [class*="message" i], [role="article"]')].filter(node => (node.textContent ?? '').trim().length > 20).slice(0, 20).map(node => ({ tag: node.tagName.toLowerCase(), classes: clean(node), role: node.getAttribute('role'), attributes: [...node.attributes].map(attribute => attribute.name).filter(name => name !== 'class' && name !== 'style').slice(0, 10), textLength: (node.textContent ?? '').trim().length, childCount: node.children.length }));
        const postAnchor = [...document.querySelectorAll('body *')].find(node => node.children.length === 0 && (node.textContent ?? '').trim() === 'Uke 39');
        const ancestry = []; let ancestor = postAnchor;
        for (let depth = 0; ancestor && depth < 8; depth++, ancestor = ancestor.parentElement) ancestry.push({ tag: ancestor.tagName.toLowerCase(), classes: clean(ancestor), role: ancestor.getAttribute('role'), attributes: [...ancestor.attributes].map(attribute => attribute.name).filter(name => name !== 'class' && name !== 'style').slice(0, 10), childCount: ancestor.children.length, textLength: (ancestor.textContent ?? '').trim().length });
        return { routeShape: (location.pathname + location.hash).split("/").map(segment => segment.length > 30 || /\d/.test(segment) ? "*" : segment).join("/"), candidate: candidate ? { tag: candidate.tagName.toLowerCase(), classes: clean(candidate), role: candidate.getAttribute("role"), attributes: [...candidate.attributes].map(attribute => attribute.name).filter(name => name !== "class" && name !== "style"), childCount: candidate.children.length } : null, counts: { tabs: document.querySelectorAll('[role="tab"]').length, links: document.querySelectorAll("a").length, groups: document.querySelectorAll('[role="group"]').length, messageElements: document.querySelectorAll('[data-tid="chat-pane-message"], [data-tid="message-pane-list-runway"] [role="listitem"]').length }, genericLabels: [...document.querySelectorAll("button, a, [role=button], [role=tab]")].map(node => (node.getAttribute("aria-label") ?? node.getAttribute("title") ?? node.textContent ?? "").replace(/\s+/g, " ").trim()).filter(label => /^(general|generelt|posts|innlegg|files|filer|assignments|oppgaver|classwork|kanaler|channels|see all|vis alle)$/i.test(label)).slice(0, 40), postCandidates, ancestry };
      })()`);
      const frames = await Promise.all(probe.frames().map(async frame => {
        try {
          const url = new URL(frame.url());
          const counts = await frame.evaluate(() => ({ bodyLength: document.body?.innerText?.length ?? 0, roleArticles: document.querySelectorAll('[role="article"]').length, roleListItems: document.querySelectorAll('[role="listitem"]').length, postClasses: document.querySelectorAll('[class*="post" i], [class*="conversation" i], [class*="message" i]').length }));
          return { origin: url.origin, routeShape: url.pathname.split("/").map(segment => segment.length > 30 || /\d/.test(segment) ? "*" : segment).join("/"), counts };
        } catch { return { origin: "unavailable", counts: null }; }
      }));
      console.log(JSON.stringify({ provider, classCardCount: count, classIndex, classCategories, structure, frames }));
    } finally { await probe.close(); }
  } else if (args.get("teams-sidebar-shape") === "true" && provider === "teams") {
    const sidebar = await page.evaluate(String.raw`(() => {
      const safeClasses = node => (node.getAttribute("class") ?? "").split(/\s+/).filter(token => /^[a-zA-Z][a-zA-Z0-9_-]{0,70}$/.test(token)).slice(0, 8);
      const shape = (node, depth) => ({ tag: node.tagName.toLowerCase(), role: node.getAttribute("role"), classes: safeClasses(node), attributes: [...node.attributes].map(attribute => attribute.name).filter(name => name !== "class" && name !== "style").slice(0, 12), children: depth < 4 ? [...node.children].slice(0, 12).map(child => shape(child, depth + 1)) : [] });
      const buttons = [...document.querySelectorAll("button, [role=button]")];
      const classes = buttons.find(node => /^Classes\s*\d+\s*teams$/i.test((node.textContent ?? "").replace(/\s+/g, " ").trim()));
      const panel = classes?.parentElement?.parentElement?.querySelector(".fui-AccordionPanel");
      const teamRows = panel ? [...panel.querySelectorAll(":scope > div > div > div")] : [];
      return { found: !!classes, expanded: classes?.getAttribute("aria-expanded"), button: classes ? shape(classes, 0) : null, parent: classes?.parentElement ? shape(classes.parentElement, 0) : null, grandparent: classes?.parentElement?.parentElement ? shape(classes.parentElement.parentElement, 0) : null, firstTeam: teamRows[0] ? shape(teamRows[0], 0) : null, teamRowCount: teamRows.length, surroundingLinks: classes?.parentElement?.parentElement ? [...classes.parentElement.parentElement.querySelectorAll("a")].slice(0, 30).map(node => ({ classes: safeClasses(node), hrefShape: (node.getAttribute("href") ?? "").split("/").map(segment => segment.length > 30 || /\d/.test(segment) ? "*" : segment).join("/"), textLength: (node.textContent ?? "").trim().length })) : [] };
    })()`);
    console.log(JSON.stringify({ provider, sidebar }));
  } else if (args.get("teams-tree-only") === "true" && provider === "teams") {
    const tree = await page.evaluate(() => {
      const items = [...document.querySelectorAll<HTMLElement>('[role="treeitem"]')];
      const navigationLabels = [...document.querySelectorAll<HTMLElement>("button, a, [role=button]")].map(element => (element.getAttribute("aria-label") ?? element.getAttribute("title") ?? element.textContent ?? "").replace(/\s+/g, " ").trim()).filter(label => label.length < 100 && /teams|team|chat|kanal|channel|klasse|class|assignment|oppgav|posts|innlegg|files|filer|grades|karakter/i.test(label)).slice(0, 40);
      return { treeCount: document.querySelectorAll('[role="tree"]').length, itemCount: items.length, navigationLabels, items: items.slice(0, 100).map(element => {
        const label = (element.getAttribute("aria-label") ?? element.textContent ?? "").trim();
        const href = element instanceof HTMLAnchorElement ? element.getAttribute("href") ?? "" : "";
        return {
          tag: element.tagName.toLowerCase(), level: element.getAttribute("aria-level"), expanded: element.getAttribute("aria-expanded"), selected: element.getAttribute("aria-selected"),
          category: /^(general|generelt)$/i.test(label) ? "general" : /^(assignments|oppgaver)$/i.test(label) ? "assignments" : /^(chat|teams|classes|kanaler|channels)$/i.test(label) ? "navigation" : "other",
          hrefShape: href.split("/").map(segment => /\d/.test(segment) || segment.length > 40 ? "*" : segment).join("/").slice(0, 120),
          classes: (element.getAttribute("class") ?? "").split(/\s+/).filter(token => /^[a-zA-Z][a-zA-Z0-9_-]{0,60}$/.test(token)).slice(0, 4),
        };
      }) };
    });
    console.log(JSON.stringify({ provider, tree }));
  } else if (args.get("tab-inventory") === "true") {
    const tabs = browser.contexts().flatMap(context => context.pages()).map(candidate => {
      try { const url = new URL(candidate.url()); return { origin: url.origin, routeShape: `${url.pathname}${url.hash}`.split("/").map(segment => /\d/.test(segment) || segment.length > 40 ? "*" : segment).join("/").slice(0, 120) }; }
      catch { return { origin: "non-http", routeShape: "" }; }
    });
    console.log(JSON.stringify({ provider, tabs }));
  } else if (args.get("probe-all-teams") === "true" && provider === "teams") {
    const probe = await browser.contexts()[0].newPage();
    try {
      await probe.goto(page.url(), { waitUntil: "domcontentloaded" });
      if (!["https://teams.microsoft.com", "https://teams.cloud.microsoft"].includes(new URL(probe.url()).origin)) throw new Error("teams_probe_left_registered_origin");
      const back = probe.locator('[aria-label="Back to All teams"], [title="Back to All teams"]');
      await back.waitFor({ timeout: 15_000 });
      if (await back.count() !== 1) throw new Error("teams_all_teams_navigation_ambiguous");
      await back.click();
      await probe.waitForTimeout(6_000);
      const structure = await probe.evaluate(() => {
        const candidate = document.querySelector<HTMLElement>('[class*="team-card" i], [class*="teamCard" i], [role="gridcell"], [role="listitem"]');
        return {
          routeShape: `${location.pathname}${location.hash}`.split("/").map(segment => /\d/.test(segment) || segment.length > 40 ? "*" : segment).join("/").slice(0, 120),
          counts: { teamClasses: document.querySelectorAll('[class*="team" i]').length, listItems: document.querySelectorAll('[role="listitem"]').length, gridCells: document.querySelectorAll('[role="gridcell"]').length, anchors: document.querySelectorAll("a").length, iframes: document.querySelectorAll("iframe").length, bodyCharacters: document.body?.innerText?.length ?? 0 },
          candidateShape: candidate ? { tag: candidate.tagName.toLowerCase(), role: candidate.getAttribute("role"), classes: (candidate.getAttribute("class") ?? "").split(/\s+/).filter(token => /^[a-zA-Z][a-zA-Z0-9_-]{0,60}$/.test(token)).slice(0, 8), attributes: [...candidate.attributes].map(attribute => attribute.name).filter(name => name !== "style" && name !== "class").slice(0, 12) } : null,
        };
      });
      const frames = await Promise.all(probe.frames().map(async frame => { try { return { origin: new URL(frame.url()).origin, counts: await frame.evaluate(() => ({ teamClasses: document.querySelectorAll('[class*="team" i]').length, listItems: document.querySelectorAll('[role="listitem"]').length, buttons: document.querySelectorAll("button").length, bodyCharacters: document.body?.innerText?.length ?? 0 })) }; } catch { return { origin: "unavailable", counts: null }; } }));
      console.log(JSON.stringify({ provider, structure, frames }));
    } finally { await probe.close(); }
  } else if (args.get("probe-assignments") === "true" && provider === "teams") {
    const probe = await browser.contexts()[0].newPage();
    try {
      await probe.goto(page.url(), { waitUntil: "domcontentloaded" });
      if (!["https://teams.microsoft.com", "https://teams.cloud.microsoft"].includes(new URL(probe.url()).origin)) throw new Error("teams_probe_left_registered_origin");
      await probe.locator("button").filter({ hasText: /Assignments/ }).first().waitFor({ timeout: 20_000 });
      const appNavigation = probe.getByRole("button", { name: /^Assignments \(Ctrl\+Shift\+4\)$/ });
      const appTextNavigation = probe.locator("button").filter({ hasText: /^Assignments\s*\(Ctrl\+Shift\+4\)$/ });
      const legacyNavigation = probe.getByRole("treeitem", { name: "Assignments", exact: true });
      const assignments = await appNavigation.count() === 1 ? appNavigation : await appTextNavigation.count() === 1 ? appTextNavigation : legacyNavigation;
      if (await assignments.count() !== 1) throw new Error("teams_assignments_navigation_ambiguous");
      await assignments.click();
      await probe.waitForTimeout(8_000);
      if (args.get("probe-assignment-list") === "true") {
        const assignmentsFrame = probe.frames().find(frame => {
          try { return new URL(frame.url()).origin === "https://assignments.edu.cloud.microsoft"; } catch { return false; }
        });
        if (!assignmentsFrame) throw new Error("teams_assignments_frame_missing");
        const viewAssignments = assignmentsFrame.getByRole("link", { name: /^View assignments$/i });
        if (await viewAssignments.count() !== 1) throw new Error("teams_view_assignments_navigation_ambiguous");
        await viewAssignments.click();
        await probe.waitForTimeout(8_000);
        if (args.get("probe-assignment-controls") === "true") {
          const controls = await assignmentsFrame.evaluate(() => ({
            routeShape: location.pathname,
            cards: document.querySelectorAll(".aui-assignmentListCard").length,
            buttons: [...document.querySelectorAll<HTMLElement>("button, [role=button]")].slice(0, 50).map(element => ({ label: (element.getAttribute("aria-label") ?? element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80), classes: (element.getAttribute("class") ?? "").split(/\s+/).filter(token => /filter|assignment|tab|dropdown|select|course|class/i.test(token)).slice(0, 6), expanded: element.getAttribute("aria-expanded") })),
            tabs: [...document.querySelectorAll<HTMLElement>("[role=tab]")].map(element => ({ label: (element.getAttribute("aria-label") ?? element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80), selected: element.getAttribute("aria-selected") })),
            selects: [...document.querySelectorAll<HTMLSelectElement>("select")].map(element => ({ options: [...element.options].map(option => option.textContent?.trim().slice(0, 80)), valueLength: element.value.length })),
            links: [...document.querySelectorAll<HTMLAnchorElement>("a")].slice(0, 30).map(element => ({ label: (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80), routeShape: (() => { try { return new URL(element.href).pathname.replace(/\/[a-f0-9-]{20,}/gi, "/*"); } catch { return ""; } })() })),
          }));
          console.log(JSON.stringify({ provider, assignmentControls: controls }));
          const tabCounts = [];
          for (const label of ["Upcoming", "Past due", "Completed"]) {
            const tab = assignmentsFrame.getByRole("tab", { name: new RegExp(label, "i") });
            if (await tab.count() !== 1) throw new Error("teams_assignment_tab_ambiguous");
            await tab.click();
            await probe.waitForTimeout(2_500);
            tabCounts.push({ label, routeShape: new URL(assignmentsFrame.url()).pathname, cards: await assignmentsFrame.locator(".aui-assignmentListCard").count() });
          }
          const filter = assignmentsFrame.getByRole("button", { name: "Open filter pane" });
          if (await filter.count() === 1) await filter.click();
          const filterControls = await assignmentsFrame.evaluate(() => [...document.querySelectorAll<HTMLElement>("[role=checkbox], input[type=checkbox], [role=combobox], select, [role=option]")].slice(0, 60).map(element => ({ tag: element.tagName.toLowerCase(), role: element.getAttribute("role"), label: (element.getAttribute("aria-label") ?? element.parentElement?.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80), checked: element.getAttribute("aria-checked"), classes: (element.getAttribute("class") ?? "").split(/\s+/).filter(token => /filter|course|class/i.test(token)).slice(0, 5) })));
          console.log(JSON.stringify({ provider, tabCounts, filterControls }));
        }
        if (args.get("probe-assignment-detail") === "true") {
          const firstCard = assignmentsFrame.locator(".aui-assignmentListCard").first();
          if (await firstCard.count() !== 1) throw new Error("teams_assignment_card_missing");
          await firstCard.click();
          await probe.waitForTimeout(8_000);
        }
      }
      const structure = await probe.evaluate(() => {
        const known = /^(assignments|assigned|completed|upcoming|past due|returned|turned in|to do|due|all|oppgaver|tildelt|fullført|kommende|forsinket|levert|alle)$/i;
        const labels = [...document.querySelectorAll<HTMLElement>("button, a, [role=tab]")].map(element => (element.getAttribute("aria-label") ?? element.getAttribute("title") ?? element.textContent ?? "").trim()).filter(label => known.test(label));
        const candidate = document.querySelector<HTMLElement>('[class*="assignment" i], [class*="task-card" i], [role="listitem"]');
        return {
          routeShape: `${location.pathname}${location.hash}`.split("/").map(segment => /\d/.test(segment) || segment.length > 40 ? "*" : segment).join("/").slice(0, 120),
          knownLabels: [...new Set(labels)],
          testIds: [...new Set([...document.querySelectorAll<HTMLElement>("[data-testid]")].map(element => element.getAttribute("data-testid")).filter((value): value is string => Boolean(value && /^[a-zA-Z][a-zA-Z0-9_-]{0,60}$/.test(value))))].slice(0, 60),
          counts: { assignmentClasses: document.querySelectorAll('[class*="assignment" i]').length, listItems: document.querySelectorAll('[role="listitem"]').length, links: document.querySelectorAll("main a").length, buttons: document.querySelectorAll("main button").length, iframes: document.querySelectorAll("iframe").length },
          candidateShape: candidate ? { tag: candidate.tagName.toLowerCase(), classes: (candidate.getAttribute("class") ?? "").split(/\s+/).filter(token => /^[a-zA-Z][a-zA-Z0-9_-]{0,60}$/.test(token)).slice(0, 8), attributes: [...candidate.attributes].map(attribute => attribute.name).filter(name => name !== "style" && name !== "class").slice(0, 12) } : null,
        };
      });
      const frames = await Promise.all(probe.frames().map(async frame => {
        try {
          const origin = new URL(frame.url()).origin;
          const layout = await frame.evaluate(() => {
            const candidate = document.querySelector<HTMLElement>('[class*="assignment" i], [role="listitem"]');
            const known = /^(assignments|upcoming|past due|completed|view assignments|oppgaver|kommende|forsinket|fullført|se oppgaver)$/i;
            return {
              counts: { assignmentClasses: document.querySelectorAll('[class*="assignment" i]').length, listItems: document.querySelectorAll('[role="listitem"]').length, buttons: document.querySelectorAll("button").length, bodyCharacters: document.body?.innerText?.length ?? 0 },
              knownLabels: [...new Set([...document.querySelectorAll<HTMLElement>("button, a, [role=tab]")].map(element => (element.getAttribute("aria-label") ?? element.textContent ?? "").trim()).filter(label => known.test(label)))],
              knownControlShape: [...document.querySelectorAll<HTMLElement>("button, a, [role=tab], [role=button]")].filter(element => known.test((element.getAttribute("aria-label") ?? element.textContent ?? "").trim())).slice(0, 12).map(element => ({ tag: element.tagName.toLowerCase(), role: element.getAttribute("role"), classes: (element.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).slice(0, 5) })),
              tabLabels: [...document.querySelectorAll<HTMLElement>('[role="tab"]')].map(element => ({ label: (element.getAttribute("aria-label") ?? element.textContent ?? "").trim(), selected: element.getAttribute("aria-selected") })).filter(item => /^(assigned|past due|completed|returned|drafts|upcoming|to do|tildelt|forsinket|fullført|returnert|kommende)$/i.test(item.label)).slice(0, 12),
              candidateShape: candidate ? { tag: candidate.tagName.toLowerCase(), classes: (candidate.getAttribute("class") ?? "").split(/\s+/).filter(token => /^[a-zA-Z][a-zA-Z0-9_-]{0,60}$/.test(token)).slice(0, 8), attributes: [...candidate.attributes].map(attribute => attribute.name).filter(name => name !== "style" && name !== "class").slice(0, 12) } : null,
              structuralClasses: [...new Set([...document.querySelectorAll<HTMLElement>('[class*="assignment" i], [class*="course" i], [class*="task" i]')].flatMap(element => (element.getAttribute("class") ?? "").split(/\s+/)).filter(token => /assignment|course|task|filter|list/i.test(token) && /^[a-zA-Z][a-zA-Z0-9_-]{0,70}$/.test(token)))].slice(0, 60),
              listItemShape: [...document.querySelectorAll<HTMLElement>('[role="listitem"]')].slice(0, 4).map(element => ({ tag: element.tagName.toLowerCase(), classes: (element.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).slice(0, 6), attributes: [...element.attributes].map(attribute => attribute.name).filter(name => name !== "style" && name !== "class"), childTags: [...element.children].slice(0, 8).map(child => child.tagName.toLowerCase()) })),
              cardTree: (() => { const card = document.querySelector<HTMLElement>(".aui-assignmentListCard"); const shape = (element: Element, depth: number): unknown => ({ tag: element.tagName.toLowerCase(), classes: (element.getAttribute("class") ?? "").split(/\s+/).filter(token => /^[a-zA-Z][a-zA-Z0-9_-]{0,70}$/.test(token)).slice(0, 5), role: element.getAttribute("role"), attributes: [...element.attributes].map(attribute => attribute.name).filter(name => !["style", "class"].includes(name)).slice(0, 8), textLength: element.children.length ? null : (element.textContent ?? "").trim().length, children: depth < 3 ? [...element.children].slice(0, 10).map(child => shape(child, depth + 1)) : [] }); return card ? shape(card, 0) : null; })(),
              detailFields: [...document.querySelectorAll<HTMLElement>('[class*="assignment-details" i], [class*="assignment-title" i]')].slice(0, 45).map(element => ({ tag: element.tagName.toLowerCase(), classes: (element.getAttribute("class") ?? "").split(/\s+/).filter(token => /assignment|metadata|due|file|resource/i.test(token)).slice(0, 5), attributes: [...element.attributes].map(attribute => attribute.name).filter(name => !["style", "class"].includes(name)).slice(0, 8), textLength: (element.textContent ?? "").trim().length, label: /^(instructions|due|due date|assigned|points|my work|files|resources|description|class|status|handed in|not handed in)$/i.test((element.textContent ?? "").trim()) ? (element.textContent ?? "").trim() : null, children: [...element.children].slice(0, 8).map(child => ({ tag: child.tagName.toLowerCase(), classes: (child.getAttribute("class") ?? "").split(/\s+/).filter(token => /assignment|metadata|due|file|resource/i.test(token)).slice(0, 4), textLength: (child.textContent ?? "").trim().length })) })),
              metadataShape: (() => { const element = document.querySelector<HTMLElement>('[class*="assignment-metadata-container" i]'); if (!element) return null; const shape = (node: Element, depth: number): unknown => ({ tag: node.tagName.toLowerCase(), classes: (node.getAttribute("class") ?? "").split(/\s+/).filter(token => /^[a-zA-Z][a-zA-Z0-9_-]{0,70}$/.test(token)).slice(0, 5), attributes: [...node.attributes].map(attribute => attribute.name).filter(name => !["style", "class"].includes(name)).slice(0, 8), textLength: (node.textContent ?? "").trim().length, children: depth < 3 ? [...node.children].slice(0, 8).map(child => shape(child, depth + 1)) : [] }); return shape(element, 0); })(),
            };
          });
          const routeShape = `${new URL(frame.url()).pathname}${new URL(frame.url()).hash}`.split("/").map(segment => /\d/.test(segment) || segment.length > 35 ? "*" : segment).join("/").slice(0, 160);
          return { origin, routeShape, ...layout };
        } catch { return { origin: "unavailable", counts: null }; }
      }));
      console.log(JSON.stringify({ provider, structure, frames }));
    } finally { await probe.close(); }
  } else if (args.get("navigation-only") === "true" && provider === "teams") {
    const navigation = await page.evaluate(() => {
      const known = /^(activity|chat|teams|assignments|calendar|files|onedrive|classes|school|aktivitet|samtale|team|oppgaver|kalender|filer|klasser|skole)$/i;
      const labels = [...document.querySelectorAll<HTMLElement>("button, a, [role=button]")].map(element => ({ label: (element.getAttribute("aria-label") ?? element.getAttribute("title") ?? element.textContent ?? "").trim(), tag: element.tagName.toLowerCase(), role: element.getAttribute("role") })).filter(item => known.test(item.label));
      return {
        routeShape: `${location.pathname}${location.hash}`.split("/").map(segment => /\d/.test(segment) || segment.length > 40 ? "*" : segment).join("/").slice(0, 120),
        knownNavigation: labels,
        messageElements: document.querySelectorAll('[data-tid="chat-pane-message"], [data-tid="message-pane-list-runway"] [role="listitem"], [role="log"] [role="listitem"]').length,
      };
    });
    console.log(JSON.stringify({ provider, navigation }));
  } else if (args.get("probe-next-week") === "true" && provider === "inschool") {
    const heading = page.locator(".userTimetable_currentWeek");
    const before = (await heading.textContent())?.trim();
    const counts: Array<{ milliseconds: number; heading: string | null; lessons: number; busy: number }> = [];
    const responses: Array<{ milliseconds: number; status: number; resourceType: string; pathShape: string }> = [];
    const started = Date.now();
    const onResponse = (response: import("playwright-core").Response) => {
      const resourceType = response.request().resourceType();
      if ((resourceType === "xhr" || resourceType === "fetch") && new URL(response.url()).origin === expectedOrigin) responses.push({ milliseconds: Date.now() - started, status: response.status(), resourceType, pathShape: new URL(response.url()).pathname.split("/").map(segment => /\d/.test(segment) || segment.length > 40 ? "*" : segment).join("/") });
    };
    page.on("response", onResponse);
    try {
      await page.locator('button.userTimetable_moveWeekButton[aria-label="Neste uke"]').click();
      for (let index = 0; index < 32; index++) {
        counts.push(await page.evaluate(milliseconds => ({
          milliseconds,
          heading: document.querySelector(".userTimetable_currentWeek")?.textContent?.trim() ?? null,
          lessons: document.querySelectorAll(".Timetable-TimetableItem[starttimeanddateunix]").length,
          busy: document.querySelectorAll('[aria-busy="true"], [class*="loading" i], [class*="spinner" i]').length,
        }), index * 250));
        await page.waitForTimeout(250);
      }
    } finally {
      page.off("response", onResponse);
      await page.locator('button.userTimetable_moveWeekButton[aria-label="Forrige uke"]').click();
      await page.waitForFunction(previous => document.querySelector(".userTimetable_currentWeek")?.textContent?.trim() === previous, before, { timeout: 15_000 });
    }
    console.log(JSON.stringify({ provider, before, counts, responses }));
  } else if (args.get("inschool-nav-only") === "true" && provider === "inschool") {
    const navigation = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('nav a, nav button, [class*="nav-item"]')].map(element => {
      const label = (element.getAttribute("aria-label") ?? element.textContent ?? "").replace(/\s+/g, " ").trim();
      const href = element instanceof HTMLAnchorElement ? element.getAttribute("href") ?? "" : "";
      return { label, tag: element.tagName.toLowerCase(), hrefShape: href.split("/").map(segment => /\d/.test(segment) || segment.length > 40 ? "*" : segment).join("/").slice(0, 120) };
    }).filter(item => item.label.length <= 80 && /^(timeplan|timetable|fravær|absence|karakterer|grades|vurderinger|assessment|historikk|history|fag|subjects|oversikt|overview|oppgaver|assignments)/i.test(item.label)).slice(0, 30));
    console.log(JSON.stringify({ provider, navigation }));
  } else if (args.get("navigation-only") === "true" && provider === "inschool") {
    const navigation = await page.evaluate(() => ({
      routeShape: `${location.pathname}${location.hash}`.split("/").map(segment => /\d/.test(segment) || segment.length > 40 ? "*" : segment).join("/").slice(0, 120),
      passwordFields: document.querySelectorAll('input[type="password"]').length,
      loginPrompt: /logg inn|sign in|feide/i.test(document.body?.innerText?.slice(0, 3_000) ?? ""),
      weekHeading: document.querySelector(".userTimetable_currentWeek")?.textContent?.trim() ?? null,
      lessonCount: document.querySelectorAll(".Timetable-TimetableItem[starttimeanddateunix]").length,
      controls: [...document.querySelectorAll<HTMLButtonElement>(".userTimetable_moveWeekButton")].map((button, index) => ({
        index,
        ariaLabel: button.getAttribute("aria-label"),
        title: button.getAttribute("title"),
        disabled: button.disabled,
        svgClasses: [...button.querySelectorAll("svg")].map(svg => svg.getAttribute("class")),
      })),
    }));
    console.log(JSON.stringify({ provider, navigation }));
  } else {
  const structure = await page.evaluate(String.raw`(() => {
    const clean = value => (value ?? "").split(/\s+/).filter(token => /^[a-zA-Z][a-zA-Z0-9_-]{0,60}$/.test(token)).slice(0, 6);
    const candidates = [...document.querySelectorAll("nav a, nav button, [role=navigation] a, [role=navigation] button, [data-testid], [class*=timetable i], [class*=schedule i], [class*=lesson i], [class*=absence i], [class*=frav i], [role=log]")].slice(0, 600);
    const shape = candidates.map(element => ({ tag: element.tagName.toLowerCase(), role: element.getAttribute("role"), testid: clean(element.getAttribute("data-testid")), classes: clean(element.getAttribute("class")), match: /timeplan|timetable|schedule|lesson|frav[æa]|absence|assignment|oppgave/i.test(element.textContent ?? "") ? "relevant_label" : "other" }));
    const counts = Object.fromEntries(["[role=log]", "[data-testid]", "[class*=timetable i]", "[class*=schedule i]", "[class*=lesson i]", "[class*=absence i]", "[class*=frav i]"].map(selector => [selector, document.querySelectorAll(selector).length]));
    const item = document.querySelector(".Timetable-TimetableItem");
    const hierarchy = []; let ancestor = item;
    for (let index = 0; index < 6 && ancestor; index++, ancestor = ancestor.parentElement) hierarchy.push({ tag: ancestor.tagName.toLowerCase(), classes: clean(ancestor.getAttribute("class")), attributes: [...ancestor.attributes].map(attribute => attribute.name).filter(name => !["class", "style"].includes(name)) });
    const headings = [...document.querySelectorAll(".Timetable-TimetableHeader-day, .Timetable-TimetableDays_day, .TimetableDaySelector_cell")].slice(0, 15).map(element => ({ classes: clean(element.getAttribute("class")), attributes: [...element.attributes].map(attribute => attribute.name).filter(name => !["class", "style"].includes(name)), children: [...element.children].slice(0, 5).map(child => clean(child.getAttribute("class"))) }));
    const itemProperties = item ? {
      unixLength: (item.getAttribute("starttimeanddateunix") ?? "").length,
      hasFutureAbsence: item.getAttribute("hasfutureabsence"),
      timetableType: item.getAttribute("tttype"),
      childClasses: [...item.querySelectorAll("[class]")].slice(0, 15).map(child => clean(child.getAttribute("class"))),
      hoursPattern: (item.querySelector(".Timetable-TimetableItem-hours")?.textContent ?? "").replace(/[0-9]/g, "#").replace(/[A-Za-zÀ-ž]/g, "x"),
    } : null;
    return { counts, shape, hierarchy, headings, itemProperties };
  })()`);
  console.log(JSON.stringify({ provider, origin: new URL(page.url()).origin, tabCount: browser.contexts().reduce((count, context) => count + context.pages().length, 0), structure }));
  }
  }
} finally {
  await browser.close();
}
