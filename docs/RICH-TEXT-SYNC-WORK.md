# Rich-text synchronization work

The document endpoint now accepts `format=yjs_update` and returns the exact stored binary Yjs snapshot as base64 with its immutable revision ID. Existing document authorization and trash filtering apply. Missing canonical state returns `canonical_snapshot_missing` rather than constructing different initial histories for separate clients.

This is enabling work, not completed rich-text collaboration. Legacy editor JSON remains a single map value and the legacy text merge can discard formatting. Explicitly migrated snapshots now use the shared ProseMirror fragment for reads, revision-fenced replacements and incremental merges. Legacy-field edits against those snapshots are rejected rather than acknowledged as invisible changes; clients cannot initiate migration through an offline update. Production creation and database migration are not switched over yet.

Remaining implementation:

1. Use a Yjs 13-compatible ProseMirror binding; share a schema containing the existing callout, table, task-list and inline marks. The [upstream binding documentation](https://github.com/yjs/y-prosemirror/blob/master/README.md) distinguishes stable Yjs 13 support from the newer Yjs 14 development binding.
2. Migrate each canonical document once under a database lock to a shared rich-text fragment. Preserve old immutable revisions. Never independently initialize the same document from JSON on multiple clients.
3. Return that persisted snapshot to clients, bind Tiptap to it, persist local updates before reporting saved state, and enqueue incremental updates with stable operation IDs.
4. Reuse enrolled-device authorization, sync acknowledgements and bounded document updates. Merge remote updates without echoing them as new owner edits. Retain explicit handling for tombstones, revoked devices, invalid schemas and old clients.
5. Prove two-client convergence for formatted text, tables, checklists and callouts, including opposite delivery orders, offline reload, repeated messages and restore. Verify PostgreSQL transactions and browser rendering as well as unit merges.

Current verification: canonical document, contract and route registry suites passed (82 assertions). No authenticated database-backed request or browser collaboration was run for the new representation.

Additional local verification: 19 document tests pass, including the production merge path in both delivery orders, replay, preserved marks, fragment-based replacement/clear, rejection of legacy edits after migration and rejection of client-initiated migration. API typecheck passes. Executed with Node 24.19.0 and pnpm 10.15.1; this is not pinned Node 22 release validation. Concurrent insertion at a formatting boundary may inherit that mark according to Yjs ordering; tests require identical replicas and preserved explicit marks rather than assuming a particular boundary inheritance.

Full API regression after this change: 42 test files / 193 tests passed with the single-worker test command. No Docker, GPU or live-provider acceptance is implied by this result.

## Explicit migration command (not yet live-validated)

After applying SQL migrations through `0094`, an operator can run `pnpm --filter @sorta/api notes:migrate-rich <vault-id> <note-id> <expected-revision>` against the configured database. This is a database-administrator operation, not a browser endpoint. It uses the normal transaction wrapper, locks a vault-scoped active note, checks the expected revision for first migration, updates its canonical snapshot and appends a new `migration` revision. Old revisions are never rewritten. Repeating it for an already migrated note is a no-op. Invalid or divergent legacy editor content fails instead of being silently flattened. The CLI logs identifiers and outcome only, not note content or credentials.

Do not bulk-migrate production notes yet: browser rich-text binding, durable offline updates, restore behavior and actual PostgreSQL concurrency/rollback acceptance remain to be verified. In particular, old offline text edits against a migrated note are rejected and need explicit recovery. New-note creation remains legacy until the complete client rollout is ready.

Migration verification: 91 focused document, migration and contract tests passed; contracts build, generated-artifact checks and dependency-inventory checks passed. Migration query tests use a mock client and prove query ordering/error propagation, not actual PostgreSQL locking or rollback. The migration command has not been run against a live database.

## Durable browser edit storage

`persistLocalNoteEdit` atomically commits an edited canonical snapshot and its incremental sync operation to IndexedDB. It resolves only after transaction completion, preserves operation IDs across retries, and compares the previous local operation ID to reject competing stale tabs. The local draft is separate from the remote snapshot cache, so background refresh cannot replace unacknowledged work. Explicit trusted storage is required, and replica erasure clears drafts too. A local commit means saved on this device, not accepted by the server. The Tiptap binding still needs to call this storage path with actual Yjs updates; it is not enabled in the current editor yet.

Verification: all 10 web storage tests and web typechecking passed locally. New tests cover snapshot/outbox atomic rollback, retries before and after server acknowledgement, operation-ID payload reuse rejection, stale competing editors, ordered subsequent edits, remote refresh isolation and trusted-replica erasure. These use fake IndexedDB; browser crash/reload and real multi-tab tests remain outstanding.

## Shared browser session and schema

`RichNoteSession` now loads the persisted server fragment plus the local draft, collects actual local Yjs updates, and persists them through the atomic storage path. Initialization and explicitly applied remote updates do not enter the outgoing queue. Failed transactions retain the exact operation ID/update for retry; newer edits remain ordered behind that failed write. Closing with unsaved changes is rejected. The shared extension factory retains existing callouts, tables and task lists, and selects collaboration-owned undo history when given a migrated Y.Doc. The current visible editor uses its legacy mode; session lifecycle, status wording, navigation guards and enrolled-device syncing still need wiring before rollout.

All 16 web tests passed, including real Yjs edit/reload, remote-update suppression, failed-write retry, missing-migration rejection, and schema equality between legacy and collaboration modes. Storage tests still use fake IndexedDB, not a real browser crash. Dependencies are pinned to the existing Tiptap 3.31.3 family and Yjs 13.6.32.

Web typechecking, production build and dependency-inventory verification also passed on local Node 24.19.0 / pnpm 10.15.1. The later production build splits React, Tiptap, ProseMirror, Yjs, icons, WebAuthn and Tauri dependencies into stable vendor chunks. Its largest chunk is approximately 441 kB uncompressed, so the prior Vite 500 kB warning is resolved without raising the warning threshold.

## Navigation guard

The current editor registers a live-state guard used by application view changes, changing/closing the selected note, and explicit sign-out. In-flight saves block those transitions; unsaved content requires an explicit discard confirmation. Same-note metadata refreshes remain permitted. Initial editor normalization establishes a clean baseline rather than generating a false dirty prompt. Browser unload warnings remain in place. Authentication revocation is deliberately not suppressed by a navigation guard. Historical restore/trash workflows and session-driven local-save status still need coordinated lifecycle work before collaborative rollout.

All 17 web tests passed after adding guard-state/discard/cleanup coverage. These are unit checks, not real browser interaction acceptance.

## Editor session mode

`RichDocumentEditor` now accepts a shared session: it binds Tiptap to that session's fragment, observes Yjs dirty state, and saves through local atomic persistence instead of the legacy replacement API. It never applies incoming editor JSON over a shared fragment. Save and unload/navigation state use pending local changes, and success is labeled "Saved locally" with an explicit separate-server-sync notice. Opening a shared session requires trusted storage and durably caches the initial snapshot before returning, so even the initially clean status is backed by storage. Failed persistence remains dirty and retryable.

The parent note screen does not select this mode yet. It still needs enrolled-device gating, remote refresh/restore handling, and ownership of session cleanup; activation must happen before editing rather than switching a dirty editor between legacy and shared mode. All 19 web unit tests pass, including local status notification only after commit, listener cleanup, initial snapshot persistence and trust gating. Real Tiptap interaction and reload acceptance remain outstanding.

## Revision restore history

The restore API now applies historical editor content as a new transaction in the current Yjs document rather than replacing its binary state with an older snapshot. This preserves rich migration and causal history, derives the body from restored content, and enforces document size bounds. Existing note-row locking, expected-revision fencing, immutable revision insertion and processing-job creation remain in place. Tests cover legacy history restored into migrated notes, retained formatting, unchanged historical/current input buffers, monotonic Yjs client clocks, replay without content resurrection, and delivery of the restored state to an existing replica. Live PostgreSQL restore and browser refresh/restore acceptance remain outstanding.

Verification after the restore change: all 43 API test files / 201 tests passed with one worker; API typechecking passed. This remains local Node 24.19.0 validation, not deployment-host acceptance.

## Note-screen activation

The note screen now chooses the shared editor before showing editable content when trusted offline storage, a recorded replica enrollment and a migrated canonical snapshot are available. Unmigrated notes remain legacy; failed shared initialization displays a retry error rather than silently replacing a local draft. Locally committed edits request the existing replica synchronization flow, then refresh the shared snapshot without echoing it. Overlapping local saves request a follow-up sync. Reconnect and an explicit sync button retry failures; conflicts point to the existing Settings review UI, and no server-synced claim is shown.

Shared edits must commit locally before ordinary navigation. Forced unmount attempts local persistence; a failure retains the live session in memory for reopening and warns against closing the browser. That memory fallback does not survive a process crash. Restore/trash actions are blocked while this note has queued updates or stored conflicts. Real browser lifecycle, authentication-revocation, offline-open, multi-tab and database-backed acceptance are still required; unit tests and a production bundle are not proof of those workflows.

Activation verification: 24 web tests pass, including trust/enrollment gating, legacy-mode preservation, migrated-session selection, initialization failure propagation, and non-discardable shared-edit navigation. Web typechecking and a production build passed locally; large-chunk warnings remain. No live notes were migrated as part of this change.

## Editor defaults contract regression

Tests using the actual Tiptap schema found two autosave blockers missed by hand-authored document fixtures: default table cells/headers emit `align: null`, and default links emit `title: null`. The contract now accepts table alignment only as null/left/center/right and a link title only as null or bounded text. Unsafe link schemes, event attributes and arbitrary alignment style strings remain rejected. Every installed block and mark's generated defaults are checked against the API contract; a Yjs table migration/reload regression verifies that default cell attributes and alignment survive serialization. These checks exercise the real schema but are not DOM interaction tests.

Verification: all 27 web tests and 73 focused API contract/rich-document tests passed. Contracts build, web/API typechecking and generated OpenAPI/client checks passed on the local Node 24 toolchain.

## Mounted editor checks

DOM-level tests now mount the actual Tiptap collaboration plugin in jsdom, use real editor commands, persist through the local session, destroy/reopen the editor, and compare rendered text and canonical JSON. Coverage includes bold typing, tables with alignment/default attributes, checked tasks, warning callouts, and remote typing without outgoing echo. Link commands reject unsupported schemes before they enter saved content; the extension no longer re-registers built-in URL schemes and uses the API's supported URL forms.

This uses jsdom plus fake IndexedDB, not a real browser or PostgreSQL. The mixed table-first fixture emits `TextSelection endpoint not pointing into a node with inline content (table)` even though content/reload assertions pass. Selection/caret behavior remains an explicit investigation item; the warning is not suppressed. The added jsdom development dependency also reports the transitive `whatwg-encoding` deprecation during installation.

Verification: 31 web tests passed, web typechecking passed, and the regenerated dependency inventory passes its consistency check.

## Table-first cursor correction

The selection warning was traced to the binding's initial forced render: an empty paragraph's cursor offset was copied into the canonical table node. Shared editor views now start with JSON projected from the existing Yjs fragment, rather than an empty paragraph. This does not initialize or replace Yjs history. The regression asserts a valid inline cursor, no selection warning, unchanged encoded canonical state, and no unsaved update after mounting the table-first document. All 31 web tests and web typechecking pass after the correction. This resolves the jsdom reproduction above; real-browser caret/navigation acceptance is still required.

## Offline reopening

Trusted, enrolled browsers can reopen a previously cached migrated note when canonical snapshot requests fail at the transport layer or return a server outage. The note-screen loading failure path now builds editor content from that snapshot plus its locally committed draft; missing history/organization are explicitly labeled unavailable. A failure in an ancillary request is followed by a canonical-note check so it cannot mask an explicit note-access denial. HTTP 401/403/404/410 and malformed responses do not trigger cached fallback. Legacy notes without a shared fragment are not silently converted for offline editing.

All 35 web tests and typechecking passed, including persisted local content recovery, trust/enrollment gating, explicit denial/deletion refusal and server-outage versus malformed-response behavior. Real browser offline reload still requires acceptance testing; these tests mock network responses and IndexedDB.

## Remembered access denial

Explicit canonical-note 401/403/404/410 responses now record a per-note cached-access block. A later transport outage cannot reopen that cached snapshot; a fresh successful canonical response clears the block. The active shared editor disables editing on a denial and records the same restriction. Unsent drafts are retained rather than deleted. This is an application access guard, not cryptographic erasure of previously downloaded data. If storage fails, the in-memory block remains for this tab, and durable blocking cannot be claimed until storage works again.

All 36 web tests pass, including denial followed by outage, persisted blocking across module reload, authorized recovery, and retained unsent content. Revocation and recovery still require real-browser acceptance.

## React editor lifecycle checks

Tests now render `RichDocumentEditor` itself with React DOM in jsdom, drive editor commands and click its actual save button. They verify that newer edits remain dirty when an older save finishes, an incoming legacy revision does not overwrite unsaved text, blocked access disables the contenteditable surface and save button, and failed local persistence does not announce success or allow navigation. Retrying that shared save commits the outbox, announces local-only success and releases navigation protection without calling the legacy replacement API. All 40 web tests pass. This extends component coverage but does not replace real-browser or database-backed acceptance.

## Two mounted editors

A two-editor DOM regression starts both replicas from one canonical Yjs history, applies concurrent local formatting and remote text edits, delivers their updates in opposite orders and repeats delivery. Both rendered editor documents converge. Undo on the formatting editor removes only its local bold change and preserves the other editor's inserted text; delivering that undo converges both editors again. This tests the installed collaboration/undo plugins, not a mocked merge function. It does not exercise transport authentication, separate browser storage, or PostgreSQL persistence.

Verification: all 41 web tests and web typechecking passed. The release ledger distinguishes this scoped run from its older full-workspace baseline; no live acceptance scenario was promoted on the strength of these component tests.
