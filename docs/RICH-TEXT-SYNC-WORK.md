# Rich-text synchronization work

The document endpoint now accepts `format=yjs_update` and returns the exact stored binary Yjs snapshot as base64 with its immutable revision ID. Existing document authorization and trash filtering apply. Missing canonical state returns `canonical_snapshot_missing` rather than constructing different initial histories for separate clients.

This is an enabling API change, not completed rich-text collaboration. Current editor JSON remains a single map value and the legacy text merge can discard formatting.

Remaining implementation:

1. Use a Yjs 13-compatible ProseMirror binding; share a schema containing the existing callout, table, task-list and inline marks. The [upstream binding documentation](https://github.com/yjs/y-prosemirror/blob/master/README.md) distinguishes stable Yjs 13 support from the newer Yjs 14 development binding.
2. Migrate each canonical document once under a database lock to a shared rich-text fragment. Preserve old immutable revisions. Never independently initialize the same document from JSON on multiple clients.
3. Return that persisted snapshot to clients, bind Tiptap to it, persist local updates before reporting saved state, and enqueue incremental updates with stable operation IDs.
4. Reuse enrolled-device authorization, sync acknowledgements and bounded document updates. Merge remote updates without echoing them as new owner edits. Retain explicit handling for tombstones, revoked devices, invalid schemas and old clients.
5. Prove two-client convergence for formatted text, tables, checklists and callouts, including opposite delivery orders, offline reload, repeated messages and restore. Verify PostgreSQL transactions and browser rendering as well as unit merges.

Current verification: canonical document, contract and route registry suites passed (82 assertions). No authenticated database-backed request or browser collaboration was run for the new representation.
