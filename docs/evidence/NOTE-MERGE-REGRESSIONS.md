# Note merge regression evidence

Verified locally on 2026-09-22 using Vitest 3.2.7, Node 24.19.0 and pnpm 11.19.0. This local runtime differs from the pinned Node 22 / pnpm 10.15.1 release baseline.

Command: `pnpm --filter @sorta/api exec vitest run src/note-document.test.ts --maxWorkers=1 --no-file-parallelism`

Result: 12 tests passed; process exit code 0.

The new cases apply actual Yjs updates from independently edited documents. They verify that concurrent plain-text insertions produce the same text and editor projection in either arrival order, repeated delivery leaves the resulting state unchanged, and an offline deletion remains empty after replay and reload despite a stale fallback body. Other cases cover rich-document round trips, legacy upgrades and clearing stored content.

This is unit evidence for the canonical document functions. It does not verify PostgreSQL transactions, authorization, network delivery, browser offline storage, rich-format concurrent edits or two-client end-to-end convergence. Rich editor JSON is still stored as one map value and the merge path can replace mismatched formatting with a plain-text projection; the full rich-text collaboration requirement remains incomplete.
