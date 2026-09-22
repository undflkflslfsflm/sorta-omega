# Sorta Omega acceptance evidence

This file is the release ledger for the 133 scenarios in Appendix C of `OMEGA-APP-SPEC.md`. A route, unit test, fixture, or document does not by itself make an end-to-end scenario pass.

## Status vocabulary

| Status | Meaning |
| --- | --- |
| `passed-live` | The complete scenario ran in the stated production-like environment and its evidence was retained. |
| `passed-fixture` | The complete scenario ran with controlled fixtures; this does not establish provider or hardware availability. |
| `partial-automated` | Relevant contract/unit/component assertions pass, but the complete scenario has not run. |
| `not-run` | The complete scenario has not run in an available environment. |
| `externally-blocked` | Completion needs an account, consent, permission, service, or owner-controlled environment that is not available here. |
| `failed` | The scenario ran and did not meet its required result. |

No scenario is currently recorded as `passed-live` or `passed-fixture`. The present repository has broad automated component coverage, but PostgreSQL, Docker, the RTX 4090 host, provider accounts, and a second authenticated client were not available in this environment. This distinction is intentional.

## Recorded automated evidence

Rows below describe scoped runs, not a claim that every command was rerun against the latest commit. Recent rich-text component evidence is detailed in `RICH-TEXT-SYNC-WORK.md`; full release acceptance remains open.

| Evidence | Current result | Scope |
| --- | --- | --- |
| Earlier full-workspace `pnpm test` | 217 passing tests at that earlier snapshot: API 181, local worker 22, maintenance worker 2, browser bridge 2, desktop 7, web 2, client 1 | Historical baseline; not the latest test inventory |
| Latest scoped web suite | 88 tests passed; web typecheck passed on local Node 24.19.0 / pnpm 10.15.1 | Includes two mounted Tiptap editors, opposite-order/repeated updates, local-only undo, React save lifecycle, generated service-worker shell, authorization gates and quota-serialized offline cache writes; jsdom/fake IndexedDB, not a real browser/server scenario |
| `pnpm typecheck` | Passed | All workspace TypeScript projects |
| `pnpm contracts:check` | Passed at 420 implemented HTTP operations | Generated OpenAPI, generated client, and API inventory drift |
| Master operation audit | 355 expected, 420 implemented, 0 missing | Operation names only; not an effects test |
| `pnpm deps:check` | Passed | Dependency/license inventory drift |
| `pnpm build` | Passed; largest JavaScript chunk 441.22 kB uncompressed with no Vite size warning | Manual vendor splitting and generated offline-shell buildability, not installation or runtime acceptance |
| Real Chromium host-off startup | Passed at commit `b4f7478` in the Codex in-app Chromium browser, 1280×720 CSS px at DPR 2 | With Vite available but the API/database unavailable and no enrolled cache, only the locked “Home host unavailable” screen rendered; retry remained locked and the browser console contained no warnings/errors. This is a scoped startup boundary, not NOTE-04/OPS-02 or phone/PWA acceptance. |
| PowerShell parser checks | Passed for backup and restore scripts | Syntax/fixture validation only; no database or clean-host restore |
| Live RTX 4090 backup validation | Passed at commit `a8f7357`; retained in `docs/evidence/BACKUP-VALIDATION-2026-09-22.md` | The production PostgreSQL custom archive and zero-blob manifest passed hash and `pg_restore --list` validation without applying a restore. This is not the required representative clean-host restore. |

## Scenario ledger

The following ledger enumerates every required ID exactly once. “Partial” refers only to automated evidence; the full scenario remains open unless explicitly marked passed.

### Retained notes gates (16)

| IDs | Status | Current evidence and remaining execution |
| --- | --- | --- |
| NOTE-01, NOTE-03, NOTE-05, NOTE-06, NOTE-07, NOTE-08, NOTE-09, NOTE-10, NOTE-11, NOTE-12 | `partial-automated` | Capture, idempotency, proposal, retrieval/citation, lease, revision-fence, purge, and owner/vault guards have automated coverage. Run with migrated PostgreSQL and process interruption. |
| NOTE-02, NOTE-04, NOTE-15 | `not-run` | Require two authenticated clients, offline replicas, reconnection, and host-off/cache testing. |
| NOTE-13 | `partial-automated` | Import/export contracts, originals, and per-item outcomes exist; the complete mixed-file corpus has not run. |
| NOTE-14 | `not-run` | Requires a real backup restored into a clean installation. |
| NOTE-16 | `not-run` | Requires clean Windows install, upgrade, rollback, and uninstall evidence. |

### Retained calendar gates (62)

| IDs | Status | Current evidence and remaining execution |
| --- | --- | --- |
| CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06, CORE-07, CORE-08, CORE-09, CORE-10, CORE-11, CORE-12, CORE-13, CORE-14, CORE-15, CORE-16, CORE-17, CORE-18, CORE-19 | `partial-automated` | Canonical source links, time unions, reference dates, identity/encounter matching, commitment lifecycle, idempotency, locks, proposals, and language/date helpers have component coverage. Run the complete continuity corpus against PostgreSQL and the selected model. |
| CAL-01, CAL-02, CAL-03, CAL-04, CAL-05, CAL-07 | `partial-automated` | Recurrence, DST/fold validation, TimeSpec distinctions, and deterministic capacity logic have tests; run full API/UI scenarios. |
| CAL-06 | `not-run` | Requires two disconnected editing clients and convergence/conflict evidence. |
| CAL-08 | `partial-automated` | ICS parsing/export boundaries have coverage; full recurrence-and-exception round trip has not run. |
| PRIV-01, PRIV-02, PRIV-03, PRIV-04, PRIV-05, PRIV-06, PRIV-07, PRIV-08, PRIV-09, PRIV-10 | `partial-automated` | Private-sidecar, invitation review, authorization, OAuth state binding, local-only policy, bounded-fetch controls, and bounded Google revocation behavior have component coverage. Complete renderer/log/storage inspection and live provider-side invalidation remain open. |
| MS-01, MS-02, MS-03, MS-04, MS-05, MS-06, MS-07, MS-08, MS-09, MS-10, MS-11, MS-12 | `externally-blocked` | Adapter contracts and notification boundaries have fixture coverage, but Microsoft tenant consent, selected real resources, pagination, throttling, delta, document corpus, and write reconciliation need an authorized test account. |
| VIS-01, VIS-02, VIS-04 | `partial-automated` | Unverified/import-only capability reporting and snapshot preview are implemented; run with representative authorized exports. |
| VIS-03, VIS-05 | `externally-blocked` | Need an authorized InSchool account/interface and interactive reauthentication. Browser-profile session retention is allowed, but credentials/cookies must not enter logs, exports, or model context. |
| OPS-01, OPS-03, OPS-05, OPS-06 | `partial-automated` | Worker-off behavior, notification limitations, dependency invalidation/purge, scope checks, generated contracts, and malformed-input checks have component evidence. Full migrated-database scenarios remain open. |
| OPS-02 | `not-run` | Requires offline event persistence and one-time reconnect/writeback on two clients. |
| OPS-04 | `not-run` | Requires clean-host backup restore and provider-send safety verification. |
| OPS-07 | `not-run` | Reserved for the RTX 4090 handoff: run real Qwen/embedding evaluation and record exact digests/runtime/hardware. |
| OPS-08 | `not-run` | Requires supported Windows installation plus authenticated phone-sized PWA testing. |

### Merged-product gates (55)

| IDs | Status | Current evidence and remaining execution |
| --- | --- | --- |
| OMEGA-01, OMEGA-02, OMEGA-03, OMEGA-04, OMEGA-05, OMEGA-06, OMEGA-07, OMEGA-08, OMEGA-09, OMEGA-10, OMEGA-11, OMEGA-12, OMEGA-13, OMEGA-14, OMEGA-15, OMEGA-16, OMEGA-17, OMEGA-18, OMEGA-19, OMEGA-20 | `partial-automated` | Unified identities, originals, source ownership, school opt-ins/manual import, attendance/grade semantics, source-grounded study modes, answer durability, feedback correction, flashcard revisions, and execution state have contract/component tests. Run the complete cross-screen workflows on migrated storage. |
| OMEGA-21, OMEGA-22, OMEGA-23, OMEGA-24, OMEGA-25, OMEGA-26, OMEGA-27 | `partial-automated` | Deterministic scheduler, hard constraints, uncertainty, replan fences/coalescing, shared scheduling, and social-time proposal logic are tested at component level. Run end-to-end with persisted calendars and UI acceptance. |
| OMEGA-28, OMEGA-29, OMEGA-30, OMEGA-31, OMEGA-32, OMEGA-33, OMEGA-34, OMEGA-35, OMEGA-36, OMEGA-37, OMEGA-38, OMEGA-39, OMEGA-40, OMEGA-41, OMEGA-42 | `partial-automated` | Memory locks, observation semantics/dedup, sparse-profile limits, coverage-aware trends, sensitive-trait exclusion, job policy, honest capabilities, browser boundary, transcript provenance, and recording consent have component/contract coverage. Scheduled-time and browser-execution scenarios remain unrun. |
| OMEGA-43 | `externally-blocked` | Requires a permitted Google Calendar test account for recurrence/read/write/private-event parity. |
| OMEGA-44, OMEGA-45, OMEGA-46, OMEGA-47, OMEGA-48, OMEGA-49, OMEGA-50, OMEGA-52, OMEGA-53 | `partial-automated` | Cloud-default/consent boundaries, tool grants, structured command results, previewed promotion, dependency purge, demo isolation, and generated-operation coverage have component evidence. Full route-effects run remains open. |
| OMEGA-51 | `not-run` | Requires expanded clean-install restore across all modules. |
| OMEGA-54 | `not-run` | Requires keyboard-only accessibility and phone-sized primary-workflow audit. |
| OMEGA-55 | `not-run` | Requires the retained held-out note/retrieval/citation corpus with measured coverage and exact model digests. |

Count check: 16 notes + 62 calendar + 55 merged-product scenarios = 133 total.

## Evidence record template

For every executed scenario, append a record with:

- scenario ID and spec revision;
- exact environment, commit/tree identity, schema version, time, and operator;
- fixture IDs or provider resource IDs with private content redacted;
- commands/actions performed and the actual result;
- retained logs, screenshots, database assertions, and artifact hashes;
- one of the status values above, plus every failure or limitation;
- exact model name, digest, runtime, and hardware when AI participates.

Provider fixture success must stay separate from live-provider verification. A blocked provider must report its missing consent/account/interface; it must never substitute fabricated production data.
