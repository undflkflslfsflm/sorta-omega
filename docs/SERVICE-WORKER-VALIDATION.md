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

Browser update lifecycle, interrupted installation, private IndexedDB enrollment,
authentication and note reopening require further browser/backend validation.
No complete acceptance scenario is promoted to passed by these scoped tests.

## Real browser stopped-host check (2026-09-22)

Environment: Codex in-app Chromium browser, production Vite preview bound only to
127.0.0.1, Node 24.19.0, pnpm 10.15.1. Base commit `1bab583` plus the worker fixes
recorded with this evidence. No authenticated vault or provider account was used.

The initial build failed a real stopped-server reload: the root HTML loaded but
script and stylesheet requests reported `net::ERR_FAILED`, leaving the root
empty. Cached resources had `Vary: Origin`. Worker cache matching now ignores
Vary only for the exact public build allowlist. Unlisted asset URLs are no longer
intercepted/cached; the earlier wildcard could store preview HTML fallback as a
successful missing-script response.

Retest actions/results:

1. Built production output; TypeScript and Vite passed (existing large-chunk
   warnings). The focused worker/build suites passed 10 tests.
2. Opened a fresh origin, `http://127.0.0.1:4174/`. Confirmed worker activated and
   controlling the page, cache `sorta-shell-a399c9edbd2cd50d11981f4f` present.
3. Disabled the browser HTTP cache, then stopped the actual preview process.
   This matters: page-level network emulation alone did not reliably prevent
   the worker from reaching the running preview server in the initial test.
4. Reloaded. The app rendered `Home host unavailable` with its retry button and
   explicit warning that uncached private data cannot be opened. No blank root.
5. Fetched cached lazy resources while the server remained stopped:
   `ManagedNoteEditor-2jlNzQdH.js`: HTTP 200, 28,294 bytes;
   `cached-shared-note-CXNWRjHe.js`: HTTP 200, 539,770 bytes.
6. `/api/v1/auth/session` and `/assets/not-in-build.js` both failed with network
   errors, rather than receiving app HTML.
7. Restored temporary browser network/cache settings and closed the test tabs.
   Both preview processes were stopped. Public service-worker caches remain in
   the test browser for the local test origins; no private records were created.

This is real-browser evidence for first installation and public-shell reload
with the host stopped. It is not evidence of NOTE-15 completion: authenticated
private read/edit/search and unavailable-AI behavior remain to be exercised.
