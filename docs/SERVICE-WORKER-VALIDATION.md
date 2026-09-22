# Public app-shell cache hardening

The former service worker cached every GET outside `/api/`, including arbitrary
same-origin private downloads and cross-origin responses. It also returned the
root HTML document for missing scripts and deleted unrelated origin caches.

The replacement caches only query-free, same-origin public shell paths and built
asset paths. Non-success responses and redirects do not replace cached resources.
Missing assets produce a network error instead of HTML. Cache writes participate
in the fetch event lifetime; quota failures do not break successful online loads.
Activation removes only old `sorta-shell-` caches and awaits client claiming.
Updates no longer force immediate activation over clients using older assets.

## Evidence

Local Node 24.19.0 / pnpm 10.15.1: web suite passed 47 tests, including six tests
executing the actual public worker script in a Node VM with controlled Cache and
Fetch implementations. This is component evidence, not a browser acceptance run
and not supported-Node-22 release validation.

## Build-specific precache follow-up

Production Vite builds now emit a worker containing all generated scripts and
styles, including lazy editor chunks, plus the public HTML/manifest/favicon.
The cache identity hashes the worker template and included build/public content.
An incomplete precache rejects installation. The installed shell is cache-first
to avoid fetching newer HTML that references unavailable chunks while an update
waits for old clients to close.

Evidence: the 50-test web suite passed before one additional cache-first test was
added; the final focused worker/build suites passed all 10 tests (7 worker and 3
build tests). Production `tsc -b && vite build` passed on Node 24.19.0 with the
existing large-chunk warnings. Inspection of the emitted worker confirmed its
hashed cache identity and all four generated JS/CSS asset paths. No dependency
was added.

## Still open

Real browser install/update/offline-reload evidence is still needed before
declaring the offline shell complete. Private IndexedDB enrollment,
authentication and note reopening require full browser/backend validation.
No acceptance scenario is promoted to passed by these tests.
