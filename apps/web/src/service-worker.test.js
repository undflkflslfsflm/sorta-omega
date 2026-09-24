import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync(new URL("../public/service-worker.js", import.meta.url), "utf8");
function worker() {
  const handlers = {};
  const cache = { put: vi.fn(async () => {}), match: vi.fn(async () => undefined), addAll: vi.fn(async () => {}) };
  const caches = { open: vi.fn(async () => cache), keys: vi.fn(async () => ["sorta-shell-v1", "sorta-shell-v2", "unrelated-cache"]), delete: vi.fn(async () => true) };
  const fetch = vi.fn(async () => new Response("asset"));
  const self = { location: { origin: "https://omega.test" }, addEventListener: (name, handler) => { handlers[name] = handler; }, clients: { claim: vi.fn(async () => {}) }, skipWaiting: vi.fn(async () => {}) };
  const builtSource = source.replace('const SHELL = ["/", "/manifest.webmanifest", "/favicon.svg"];', 'const SHELL = ["/", "/manifest.webmanifest", "/favicon.svg", "/assets/app-123.js"];');
  runInNewContext(builtSource, { self, caches, fetch, URL, Response });
  function request(path, method = "GET") {
    const event = { request: new Request(new URL(path, self.location.origin), { method }), respondWith: vi.fn(), waitUntil: vi.fn() };
    handlers.fetch(event);
    return event;
  }
  return { handlers, cache, caches, fetch, self, request };
}

describe("public-only service worker cache", () => {
  it("fetches current HTML even when an older shell is cached", async () => {
    const w = worker();
    w.cache.match.mockResolvedValue(new Response("installed HTML"));
    expect(await (await w.request("/").respondWith.mock.calls[0][0]).text()).toBe("asset");
    expect(w.fetch).toHaveBeenCalledOnce();
  });

  it("does not intercept private, query-bearing, cross-origin, or write requests", () => {
    const w = worker();
    for (const path of ["/api", "/api/notes", "/health", "/exports/private.pdf", "/assets/not-in-build.js", "/?token=secret", "/assets/app.js?token=secret", "https://other.test/assets/app.js"]) {
      expect(w.request(path).respondWith).not.toHaveBeenCalled();
    }
    expect(w.request("/", "POST").respondWith).not.toHaveBeenCalled();
    expect(w.fetch).not.toHaveBeenCalled();
  });

  it("keeps successful public asset writes alive and uses only its own cache offline", async () => {
    const w = worker();
    const event = w.request("/assets/app-123.js");
    expect(await (await event.respondWith.mock.calls[0][0]).text()).toBe("asset");
    await event.waitUntil.mock.calls[0][0];
    expect(w.cache.put).toHaveBeenCalledOnce();
    w.fetch.mockRejectedValue(new TypeError("offline"));
    w.cache.match.mockResolvedValue(new Response("cached script"));
    expect(await (await w.request("/assets/app-123.js").respondWith.mock.calls[0][0]).text()).toBe("cached script");
    expect(w.caches.open).toHaveBeenLastCalledWith("sorta-shell-v2");
  });

  it("does not poison the cache with HTTP failures or redirects", async () => {
    const w = worker();
    w.fetch.mockResolvedValue(new Response("failure", { status: 503 }));
    expect((await w.request("/").respondWith.mock.calls[0][0]).status).toBe(503);
    const redirected = new Response("sign in");
    Object.defineProperty(redirected, "redirected", { value: true });
    w.fetch.mockResolvedValue(redirected);
    await w.request("/").respondWith.mock.calls[0][0];
    expect(w.cache.put).not.toHaveBeenCalled();
  });

  it("returns a network error for an uncached asset instead of HTML", async () => {
    const w = worker();
    w.fetch.mockRejectedValue(new TypeError("offline"));
    const response = await w.request("/assets/app-123.js").respondWith.mock.calls[0][0];
    expect(response.type).toBe("error");
    expect(w.cache.match).toHaveBeenCalledOnce();
    expect(w.cache.match.mock.calls.every(([, options]) => options.ignoreVary === true)).toBe(true);
  });

  it("keeps online responses usable when cache storage is full", async () => {
    const w = worker();
    w.cache.put.mockRejectedValue(new Error("quota"));
    expect(await (await w.request("/").respondWith.mock.calls[0][0]).text()).toBe("asset");
  });

  it("activates the new worker and deletes only previous Sorta shell caches", async () => {
    const w = worker();
    const install = { waitUntil: vi.fn() };
    w.handlers.install(install);
    await install.waitUntil.mock.calls[0][0];
    expect(w.self.skipWaiting).toHaveBeenCalledOnce();
    const event = { waitUntil: vi.fn() };
    w.handlers.activate(event);
    await event.waitUntil.mock.calls[0][0];
    expect(w.caches.delete.mock.calls).toEqual([["sorta-shell-v1"]]);
    expect(w.self.clients.claim).toHaveBeenCalledOnce();
  });
});
