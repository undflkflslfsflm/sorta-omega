import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";
import { renderOfflineWorker } from "../offline-shell-plugin.mjs";

const template = readFileSync(new URL("../public/service-worker.js", import.meta.url), "utf8");
const bundle = {
  "index.html": { type: "asset", source: "<script src='/assets/main.js'></script>" },
  "assets/main.js": { type: "chunk", code: "import('./lazy.js')" },
  "assets/lazy.js": { type: "chunk", code: "export default 1" },
  "assets/main.css": { type: "asset", source: "body{}" },
  "assets/main.js.map": { type: "asset", source: "{}" }
};
const publicContents = { "favicon.svg": "<svg/>", "manifest.webmanifest": "{}" };
const render = (entries = bundle, contents = publicContents) => renderOfflineWorker(template, entries, contents);
const cacheName = source => source.match(/const CACHE = "([^"]+)"/)[1];

describe("build-specific offline shell", () => {
  it("includes initial and lazy chunks and styles, but not source maps", () => {
    const shell = JSON.parse(render().match(/const SHELL = (\[[^;]+\]);/)[1]);
    expect(shell).toEqual(["/", "/manifest.webmanifest", "/favicon.svg", "/assets/lazy.js", "/assets/main.css", "/assets/main.js"]);
  });
  it("uses deterministic cache identity sensitive to HTML, assets, and public resources", () => {
    expect(cacheName(render(Object.fromEntries(Object.entries(bundle).reverse())))).toBe(cacheName(render()));
    for (const name of ["index.html", "assets/main.css", "assets/lazy.js"]) {
      const changed = structuredClone(bundle);
      if (changed[name].type === "chunk") changed[name].code += " changed";
      else changed[name].source += " changed";
      expect(cacheName(render(changed))).not.toBe(cacheName(render()));
    }
    expect(cacheName(render(bundle, { ...publicContents, "favicon.svg": "new" }))).not.toBe(cacheName(render()));
  });
  it("requires HTML and makes incomplete precache reject installation", async () => {
    expect(() => render({})).toThrow("index.html");
    const handlers = {};
    const addAll = vi.fn(async () => { throw new Error("missing lazy chunk"); });
    runInNewContext(render(), { self: { addEventListener: (name, fn) => { handlers[name] = fn; } }, caches: { open: async () => ({ addAll }) } });
    const event = { waitUntil: vi.fn() };
    handlers.install(event);
    await expect(event.waitUntil.mock.calls[0][0]).rejects.toThrow("missing lazy chunk");
    expect(addAll.mock.calls[0][0]).toContain("/assets/lazy.js");
  });
});
