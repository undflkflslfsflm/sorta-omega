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

## Still open

The initial install currently precaches only HTML, manifest and favicon. A browser
that has not requested all needed built chunks under worker control may still be
unable to reopen offline. A build-specific complete asset precache and real
browser install/update/offline-reload evidence are needed before declaring the
offline shell complete. Private IndexedDB enrollment, authentication and note
reopening also require full browser/backend validation. No acceptance scenario is
promoted to passed by these tests.
