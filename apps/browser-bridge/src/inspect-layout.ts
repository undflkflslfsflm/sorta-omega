import { chromium } from "playwright-core";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Development-only structural probe. It never prints page text, cookies, request
// headers, response bodies, account identifiers, or raw provider URLs.
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
  const page = browser.contexts().flatMap(context => context.pages()).find(candidate => {
    try { const origin = new URL(candidate.url()).origin; return provider === "teams" ? ["https://teams.microsoft.com", "https://teams.cloud.microsoft"].includes(origin) : origin === expectedOrigin; } catch { return false; }
  });
  if (!page) throw new Error("matching_tab_not_found");
  if (args.get("tab-inventory") === "true") {
    const tabs = browser.contexts().flatMap(context => context.pages()).map(candidate => {
      try { const url = new URL(candidate.url()); return { origin: url.origin, routeShape: `${url.pathname}${url.hash}`.split("/").map(segment => /\d/.test(segment) || segment.length > 40 ? "*" : segment).join("/").slice(0, 120) }; }
      catch { return { origin: "non-http", routeShape: "" }; }
    });
    console.log(JSON.stringify({ provider, tabs }));
  } else if (args.get("probe-assignments") === "true" && provider === "teams") {
    const probe = await browser.contexts()[0].newPage();
    try {
      await probe.goto(page.url(), { waitUntil: "domcontentloaded" });
      if (!["https://teams.microsoft.com", "https://teams.cloud.microsoft"].includes(new URL(probe.url()).origin)) throw new Error("teams_probe_left_registered_origin");
      const assignments = probe.getByRole("treeitem", { name: "Assignments", exact: true });
      await assignments.waitFor({ timeout: 15_000 });
      if (await assignments.count() !== 1) throw new Error("teams_assignments_navigation_ambiguous");
      await assignments.click();
      await probe.waitForTimeout(8_000);
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
          const counts = await frame.evaluate(() => ({ assignmentClasses: document.querySelectorAll('[class*="assignment" i]').length, listItems: document.querySelectorAll('[role="listitem"]').length, buttons: document.querySelectorAll("button").length, bodyCharacters: document.body?.innerText?.length ?? 0 }));
          const bodySample = origin === "https://assignments.edu.cloud.microsoft" ? await frame.evaluate(() => (document.body?.innerText ?? "").slice(0, 160).replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")) : null;
          return { origin, counts, bodySample };
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
} finally {
  await browser.close();
}
