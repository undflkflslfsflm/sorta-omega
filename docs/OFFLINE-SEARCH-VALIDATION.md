# Trusted-browser keyword search

Find previously advertised offline lexical search but always called the API.
It now falls back to local keyword matching only after a network error or server
5xx, only in lexical mode, and only with trusted-device enrollment and cached
core records. Successful server results remain authoritative. Permission,
validation and malformed-response errors do not activate fallback.

Coverage is explicitly limited to cached note titles/bodies, task titles and
calendar titles. Saved local shared-note edits are merged through the existing
cached-document loader; stale server bodies do not override them. Notes with
remembered access denials and trashed calendar events are excluded. Matching is
case-insensitive, Unicode-normalized, requires all whitespace-separated terms,
and ranks title matches above body-only matches with deterministic tie-breaking.
No model, external request, private calendar sidecar or invented result is used
by the local matcher. The UI identifies cache freshness and explains that
revision labels refer to the cached server baseline, not unsynced local edits.

## Evidence and limits

Node 24.19.0 / pnpm 10.15.1: all 58 web tests passed. Seven new tests exercise
real fake-IndexedDB cache/enrollment/access-denial storage with controlled API and
shared-document-loader results. They cover matching, saved draft selection,
denial/trash exclusion, trust/enrollment/cache requirements, fallback error
classification, successful server precedence and trust removal during a search.
Actual shared-document merging is covered by separate existing cache/session
tests; this is not a full browser workflow or supported-Node-22 release run.

NOTE-15 remains incomplete: authenticated browser read/edit/search with a stopped
host, reopening results, permission lifecycle and reconnect need end-to-end
evidence. Uncached and unlisted records, unsaved editor text, pending captures
not yet represented as notes, and non-core domains are not searched. Search
does not silently claim complete-vault coverage or local AI availability.

## Search-result navigation follow-up

The previous click handler silently ignored note results outside the currently
loaded note list. Result opening now resolves the note by ID from the API,
falling back only to the requested trusted/enrolled cached record on network or
5xx failure. A 401/403/404/410 records the existing persistent note-access block
and never opens the cached copy. Authorized success clears that block. Missing
cache and other failures display an error instead of leaving the click inert.
An asynchronous result does not redirect away from another workspace or replace
a newer search-result click. Task/calendar results retain workspace navigation.

Evidence: the complete web suite passed 64 tests on Node 24.19.0 / pnpm 10.15.1.
Six new resolver tests use fake IndexedDB and controlled API replies to cover
server-only results, outages, persistent denial, authorized recovery, malformed
responses and required trust/enrollment/record presence. The full click-to-editor
browser workflow, pagination and navigation-race UI checks remain unverified.

Security follow-up: a successful note-metadata read no longer clears a remembered
canonical-document access block. Metadata authorization may differ from document
authorization, so only `loadNoteSnapshot` may unblock cached document content
after its own successful request. The editor initialization path also preserves
the canonical denial classification when an ancillary request fails first and
shows an explicit access-denied message instead of a generic initialization
failure. The complete web suite remained at 64 passing tests with typecheck green
on the local unsupported Node 24 runtime; supported Node 22 and live multi-client
permission-revocation testing remain release requirements.
