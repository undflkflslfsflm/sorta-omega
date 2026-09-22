# Sorta Omega — RTX 4090 completion handoff

Prepared: 2026-09-21

This is the continuation brief for a Codex session running on the owner's Windows 11 Pro home host. It is an execution checklist, not evidence that deployment or acceptance has already passed.

## Continuation instruction

Continue the active Sorta Omega goal from this repository. Read `OMEGA-APP-SPEC.md` completely and treat it as the authoritative product specification; use `OMEGA-MASTER-SPEC.md` as its consolidated companion. Preserve all current files and user changes. Do not replace the stack, fabricate provider/model results, expose private ports, send invitations, or mark acceptance scenarios passed without retained evidence.

The owner requires the generation model **`Qwen/Qwen3.8-Flash-Next`**. Do not silently substitute a different model. Verify the official artifact, runtime compatibility, quantization, actual immutable digest and 24 GB VRAM fit on this machine before enabling it. Keep **Qwen3-Embedding-0.6B** on the loopback Ollama embedding adapter unless the owner explicitly changes that choice.

## Intended host — verify, do not assume

Expected owner-provided profile:

- Windows 11 Pro, build 26200, 64-bit
- Intel Core i9-13900KF, 24 cores / 32 threads
- NVIDIA GeForce RTX 4090, 24 GB VRAM
- 64 GB RAM
- 2 TB Kingston NVMe SSD
- 16 TB Seagate HDD

Start with the deterministic preflight below. It runs the host doctor, validates the expected hardware and required toolchain, checks the authoritative specs, runs every repository gate, verifies the selected storage paths and model configuration, and writes timestamped JSON evidence under `docs/evidence/`. It exits nonzero whenever a required item is missing.

```powershell
& .\infra\windows-host\run-rtx4090-preflight.ps1 `
  -CanonicalOrigin 'https://<final-reviewed-origin>' `
  -BlobRoot 'D:\SortaOmega\blobs' `
  -BackupRoot '<owner-approved-path-on-an-independent-volume>' `
  -PrepareStorage
```

Run the command from an ordinary PowerShell session first. Elevate only if a separately reviewed installation or service action actually requires it. Do not weaken the execution policy, firewall, ACLs or browser security to make a check pass. The Windows CIM VRAM figure can truncate; the preflight therefore uses `nvidia-smi` as GPU-memory evidence.

Do not assume the 2 TB or 16 TB drive letter. Put the repository, PostgreSQL, active model files and build caches on the NVMe. Use the HDD only for owner-approved bulk originals and encrypted backup retention after measuring the consequence; keep PostgreSQL off the HDD. Never store the sole backup beside the live database.

## Current verified repository state

- Schema version: **93**; migrations currently end at `0093_study_withdrawal_application.sql`.
- Generated OpenAPI/API inventory: **420 implemented HTTP operations**.
- Master operation-name audit: **355 expected, 420 implemented, zero missing names**. This is not effects evidence.
- `pnpm typecheck`: passed across all eight TypeScript workspace projects.
- `pnpm test`: **217 passed** — API 181, local worker 22, maintenance worker 2, browser bridge 2, desktop 7, web 2, generated client 1.
- `pnpm contracts:check`: passed; OpenAPI, API inventory and generated TypeScript client are current.
- `pnpm deps:check`: passed.
- `pnpm build`: passed; Vite reported only a large-chunk warning.
- No PostgreSQL/Docker/Rust/provider-account/model execution was available on the prior Surface client, so none of those are claimed live.
- Google disconnect now performs bounded fixed-endpoint OAuth revocation and records success/failure honestly. Microsoft account-side cleanup is still unsupported by an equivalent endpoint and must remain explicit.
- Teams and InSchool have a visible Edge persistent-profile snapshot bridge. It retains the authenticated browser profile locally but does not serialize cookies/tokens or claim live synchronization.

The preflight runs this exact repository sequence automatically:

```powershell
pnpm install --frozen-lockfile
pnpm client:generate
pnpm typecheck
pnpm test
pnpm contracts:check
pnpm deps:check
pnpm build
```

If generated artifacts change unexpectedly, stop and inspect the diff; do not accept drift blindly.

## Phase 1 — host prerequisites and private storage

1. Preserve the current checkout before moving it. This repository may have no baseline commit and many untracked implementation files; do not use reset/clean/checkout commands that could erase them.
2. Install/verify Docker Desktop with WSL2 support, Git, **Node 22.x**, Corepack/pnpm 10.15.1, current NVIDIA driver, Rust through rustup, Visual Studio Build Tools with the MSVC C++ workload and Windows SDK, and WebView2. Node 22 remains the release baseline. The owner reports that parallel API tests crash with `ERR_IPC_CHANNEL_CLOSED` on both Node 22.23.2 and Node 24; the cause is unresolved and must not be attributed solely to Node 24. All 181 API tests passed with one worker on the 4090 host. The default API test command now runs every test with one worker and file parallelism disabled; `pnpm --filter @sorta/api test:parallel` preserves the diagnostic parallel run. Require a successful process exit as well as passing assertions.
3. Choose absolute owner-only paths for live blobs, model artifacts, evidence and encrypted backups. Verify ACLs and available capacity.
4. Create `.env` with `infra/windows-host/initialize-live-environment.ps1 -WorkspaceRoot <absolute-checkout> -AppOrigin <canonical-origin>`. It generates independent high-entropy values for `POSTGRES_PASSWORD`, `BOOTSTRAP_SECRET`, `OAUTH_CREDENTIAL_KEY_HEX` and `BACKUP_ENCRYPTION_KEY_HEX`, writes them without printing them and restricts the file ACL to the current owner plus `SYSTEM`. Do not paste them into chat, logs, screenshots, git, the model prompt, or backup bundles. The script refuses to replace an existing file unless `-Force` is explicitly supplied.
5. Choose one canonical origin before passkey bootstrap. For local-only validation use the loopback origin. For two-PC use, prefer the reviewed Tailscale Serve HTTPS name and keep it stable. OAuth redirects, cookies, WebAuthn RP ID, PWA caches and Tauri capability URLs must agree with that origin.

## Phase 2 — PostgreSQL, migrations and persistence

The empty-volume loopback deployment, all 94 migrations, health/readiness, schema metadata, port scope and a joint PostgreSQL/application restart now pass on `SILENT-4090`; see `docs/evidence/LOOPBACK-DEPLOYMENT-2026-09-22.md`. Continue with the interactive owner bootstrap and authenticated scenarios below.

1. Start PostgreSQL and the application with the reviewed Compose profile. PostgreSQL must have no published host port; the app must publish only `127.0.0.1:3210`.
2. Run all migrations from an empty database and prove schema version 93 through `/api/v1/meta` and `/api/v1/status`.
3. Restart PostgreSQL and the app. Verify `/health/live` and `/health/ready`, then perform owner bootstrap with a passkey and save recovery codes outside the app.
4. Run persistence/effects tests against the real database: capture, immutable revision, task/event mutations, recurrence/DST, source import, proposal acceptance/rejection, jobs, sync cursors, purge, disconnect retention choices and study withdrawal.
5. Specifically verify the corrected study-withdrawal guard refuses events that have provider actions in `pending`, `in_flight`, `delivery_unknown` or `acknowledged` state.
6. Retain command output, safe database assertions and restart evidence. Do not put note contents, tokens or recovery codes in evidence.

## Phase 3 — required Qwen generation runtime and embeddings

Identity verification is recorded in `docs/evidence/QWEN-MODEL-IDENTITY.md`. The official artifact exists and contains roughly 180B parameters. Full four-bit weights exceed 24 GiB VRAM; deployment requires a verified offload/quantization path and measurements. A model listing or configured digest alone does not prove this requirement passes.

The application worker already supports a loopback OpenAI-compatible chat endpoint and a separate loopback Ollama embedding endpoint.

1. Verify from official model/runtime sources that the exact model ID `Qwen/Qwen3.8-Flash-Next` exists, which revision is being used, its license, architecture, context requirements and a 4090-compatible serving path. Record the immutable model revision and SHA-256/digest. If it cannot fit or cannot produce strict JSON-schema responses on 24 GB VRAM, report the exact failure; do not substitute or claim success.
2. Start the selected OpenAI-compatible server on loopback only. It must implement:
   - `GET /v1/models`
   - `POST /v1/chat/completions`
   - `response_format.type=json_schema` with strict schema output
   - non-streaming responses used by the worker
3. Set the host worker environment:

```text
LOCAL_CHAT_BACKEND=openai_compatible
OPENAI_COMPATIBLE_BASE_URL=http://127.0.0.1:<reviewed-port>/v1/
OPENAI_COMPATIBLE_CHAT_MODEL=Qwen/Qwen3.8-Flash-Next
OPENAI_COMPATIBLE_CHAT_MODEL_DIGEST=<verified immutable digest>
OPENAI_COMPATIBLE_API_KEY=<optional loopback secret, if configured>
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_EMBEDDING_MODEL=qwen3-embedding:0.6b
```

4. Qwen3-Embedding-0.6B is now live-verified in Ollama at digest `ac6da0dfba84a81fdbfbaf330198c33cd77c4cdfc53e8bc50eb581914a15621d`; a real request returned exactly 1,024 finite dimensions. Preserve the evidence in `docs/evidence/OLLAMA-EMBEDDING-VALIDATION-2026-09-22.md` and re-run it after model/runtime changes.
5. Resolve the Docker/host networking boundary deliberately. The native local worker talks to both model runtimes over host loopback. Do not expose either runtime to the LAN. If the containerized API cannot probe host loopback, do not broaden it casually; either use a reviewed host-gateway arrangement with firewall proof or change the health check to rely on authenticated worker-reported model presence. Retain the actual network test.
6. After owner setup, provision one worker:

```powershell
pnpm --filter @sorta/api worker:provision -- --name "Home RTX worker"
```

Store the one-time token in the Windows service secret environment, set `OMEGA_WORKER_ID`, `OMEGA_WORKER_TOKEN` and `OMEGA_API_URL`, then start `@sorta/local-worker` as a restricted service account.
7. Run real capability, classification, structured extraction, study-plan, tutoring, transcript, artifact, grounded-answer and embedding/index jobs. Measure cold/warm latency, peak VRAM/RAM, cancellation, restart lease recovery and foreground-versus-background contention. Record exact runtime/model digests; do not infer quality from model size.
8. Run the retained 200-note/100-question held-out evaluation and report precision, coverage, Recall@10, citation resolution, unauthorized retrieval and no-answer abstention as measurements, not targets achieved by assumption.

## Phase 4 — Windows desktop package and native behavior

1. Rust `cargo check -j 1`, `cargo test -j 1` and `native:build` now pass on `SILENT-4090`; the resolved graph is locked. Regenerate/review the dependency and license inventory after any lockfile change. The host's default-parallel `cargo check` produced one retained `rustc` access violation, so keep release validation serial until that instability is resolved.
2. NSIS and MSI build successfully with hashes retained in `docs/evidence/NATIVE-WINDOWS-BUILD-2026-09-22.md`. They are `NotSigned`; call them signed only after an actual trusted certificate is used and verified.
3. Test install, upgrade, rollback and uninstall while preserving data unless separate removal is confirmed.
4. Verify Windows Credential Manager storage/rotation, one-time pairing, replay revocation, tray actions, shortcut conflict behavior, start-at-login and deliberate clipboard read. Exercise `file_import` with a small file, a file above the browser's 64 MiB limit, a changed-during-read file, cancellation, host loss between parts and a rejected/revoked `capture:write` grant; prove the renderer never receives a local path and the completed immutable blob hash matches the selected original.
5. Measure quick-capture appearance against the under-500-ms target.
6. The full Appendix A.4 native command set is not yet implemented. Finish commands only through validated shared domain behavior—especially local vault/sync controls, folder watches, model controls, audio, authorized export save, backup/restore, local reminder delivery, update, calendar/commitment/source navigation, focus control and personal-export import. Do not add name-only IPC stubs or arbitrary path/URL/command execution.

## Phase 5 — two-client, PWA, offline and remote access

1. Follow `infra/remote-access/REMOTE-ACCESS.md`. Default to Tailscale Serve HTTPS; never use Funnel, router port forwarding, a public dev server or firewall disablement.
2. Prove an unauthorized tailnet identity is denied and only the app is reachable. Confirm PostgreSQL, Ollama, the OpenAI-compatible server, worker endpoints and debug ports are not reachable from the second PC.
3. Enroll the second client with the final canonical origin and test passkey login, PWA install, upload recovery, host restart, reconnect and powered-off-host behavior.
4. Run true two-client Yjs/offline convergence tests. Rich notes now persist incremental Yjs drafts, merge remote snapshots without echoing them, promote acknowledged drafts atomically and retain conflicting later edits; mounted two-editor convergence/undo and offline-reopen fixtures pass. Live two-client execution, structured-event/task conflicts and broader offline mutation coverage remain and must not be recorded as passed before the complete scenarios run.
5. Run keyboard-only and phone-sized primary-workflow accessibility checks.

## Phase 6 — backup and clean-host restore

1. Configure a destination on an owner-approved absolute path:

```powershell
pnpm --filter @sorta/maintenance-worker backup:configure -- --label "Local encrypted backup" --root "<absolute-backup-root>"
```

2. Run the maintenance worker with `DATABASE_URL`, `BACKUP_ENCRYPTION_KEY_HEX` and `OMEGA_WORKSPACE_ROOT`. Prove create, encrypted bundle authentication, verify, retention and cancellation.
3. Replacement restore remains an operator maintenance action because restoring PostgreSQL replaces the job registry. Use `infra/backup/restore.ps1`, first without `-Apply`, then on a disposable clean installation with exact confirmation only after a fresh backup.
4. Verify database, every blob hash, note/source revisions, citations, attachments, school records, jobs and histories. Confirm pending provider sends remain disabled and require reauthorization/reconciliation after restore.
5. Preserve rollback instructions and restore status outside the database being replaced.

## Phase 7 — authorized integrations

Only proceed for accounts/resources the owner explicitly authorizes.

- **Google Calendar:** register the exact canonical redirect URI, validate least-privilege read/write scopes, pagination, recurrence and lost-response reconciliation. Test disconnect and confirm the provider actually invalidates the token after a 200 revocation response.
- **Microsoft:** validate tenant/client registration, least-privilege resources, delta/pagination/throttling/subscriptions and outbox reconciliation. Keep account-side cleanup marked incomplete unless an official applicable mechanism is implemented and live-tested.
- **Provider calendar outbox:** implement the real delivery/reconciliation executor. Preserve reviewed recipients/public fields, idempotency and `delivery_unknown`; never blindly retry after a lost response.
- **Teams browser snapshot:** run visible Edge with a dedicated persistent profile, let the owner sign in, open the exact chat/channel, export bounded content, inspect the JSON and import it through preview/apply. Session files stay local and never enter model context.
- **InSchool browser snapshot:** use the exact authorized `https://<county>.inschool.visma.no` origin, interactive Feide sign-in and exact timetable view. Verify selectors/layout before import. Keep the capability labeled snapshot/import-only, not live API synchronization.
- Keep `PUBLIC_PROVIDER_CALLBACKS_ENABLED=false` until the public callback path, channel/client-state validation and provider subscription have been deliberately tested.

Example bridge commands, with owner-chosen private paths:

```powershell
pnpm --filter @sorta/browser-bridge start -- --provider teams --profile "<absolute-profile-dir>" --output "<absolute-output.json>"
pnpm --filter @sorta/browser-bridge start -- --provider inschool --profile "<absolute-profile-dir>" --output "<absolute-output.json>" --origin "https://<county>.inschool.visma.no"
```

## Known incomplete product work that must stay visible

- Real Microsoft/Google provider fetch, delivery and lost-response reconciliation executors.
- Live Teams/InSchool selector/account validation.
- Live two-client Yjs convergence plus broader offline edits/conflicts; mounted-editor convergence/undo and offline-reopen fixtures already pass.
- The remaining native command set (including folder watches, model install/test, worker/audio/export/backup/update/focus operations) and installed runtime behavior. Calendar view, exact calendar-event, exact commitment and finite event-source navigation compile through a doubly validated renderer event. The bounded read-only `host.preflight` command explicitly leaves hardware/service readiness unknown when it cannot prove them; `model.inspect` is restricted to two fixed loopback listing endpoints and cannot install or mutate models. These commands compile but still require an installed runtime test.
- Clean-host replacement restore evidence.
- Full security/privacy review: renderer/log/cache/backup inspection, CSP/origin checks, secret scanning, dependency/container/Rust/model licenses and attack tests.
- Complete Appendix C route-effects and acceptance runs. `docs/ACCEPTANCE-TESTS.md` currently records all 133 scenarios honestly; update a row only after the complete scenario executes.

Do not turn these into success-shaped mocks. A blocked live provider can coexist with a finished import adapter, but it remains externally blocked.

## Final release gates

Before calling the goal complete, all of the following must be true or explicitly recorded as owner/external blockers with working manual alternatives:

1. Fresh install, migrations and restart persistence pass.
2. Exact Qwen model and embedding artifacts are verified and measured on the 4090.
3. The defining journey passes end to end: offline messy-note capture on Windows; exact-source retrieval from the second client; private calendar plan; correct person-linked commitment; authorized school-material import; constrained source-grounded study plan; actual focus/practice/catch-up; owner correction; encrypted clean-install recovery.
4. Every enabled UI control reaches real behavior or shows its actual prerequisite.
5. No private provider/model/database/debug port is publicly reachable.
6. Backup restore, provider-send safety, installer preservation and recovery are proven.
7. `pnpm typecheck`, `pnpm test`, `pnpm contracts:check`, `pnpm deps:check` and `pnpm build` are green after final changes.
8. `docs/IMPLEMENTATION-STATUS.md`, `docs/FEATURE-COVERAGE.md`, `docs/ACCEPTANCE-TESTS.md`, generated OpenAPI/client/inventory and retained evidence match reality.

Finish with a concise report separating: implemented, fixture-tested, live-verified, failed, not-run and externally blocked. Include exact artifact/runtime versions and digests, but no secrets or private content.
