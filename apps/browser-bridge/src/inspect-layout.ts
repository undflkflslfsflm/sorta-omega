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
  if (args.get("navigation-only") === "true" && provider === "inschool") {
    const navigation = await page.evaluate(() => ({
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
