const CACHE = "sorta-shell-v2";
const SHELL = ["/", "/manifest.webmanifest", "/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("sorta-shell-") && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  // Only public shell resources belong in Cache Storage. Private records use
  // the explicitly enrolled IndexedDB replica, never this generic cache.
  if (request.method !== "GET" || url.origin !== self.location.origin || url.search) return;
  const shell = SHELL.includes(url.pathname);
  if (!shell) return;
  const responsePromise = (async () => {
    // Fetch the current shell online so a deployment cannot be pinned behind
    // an indefinitely cached index.html. Keep the last good public shell for
    // offline use; private data is never placed in this cache.
    return fetch(request).then(async (response) => {
    if (response.ok && !response.redirected && response.type !== "opaque") {
      try { await (await caches.open(CACHE)).put(request, response.clone()); }
      catch { /* A full cache must not turn a successful online load into an error. */ }
    }
    return response;
  }).catch(async () => {
    const cached = await (await caches.open(CACHE)).match(request, { ignoreVary: true });
    // Never return HTML for a missing script, stylesheet, or image.
    return cached ?? Response.error();
    });
  })();
  event.respondWith(responsePromise);
  event.waitUntil(responsePromise.then(() => undefined));
});
