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

Web typechecking, production build and dependency-inventory verification also passed on local Node 24.19.0 / pnpm 10.15.1. Vite reports chunks over 500 kB (editor approximately 558 kB and main approximately 666 kB uncompressed); bundle optimization remains outstanding rather than hiding the warning.
