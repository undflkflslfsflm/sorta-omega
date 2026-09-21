# Sorta Omega

Windows-first, local-first personal command center. The repository now implements the master-spec API surface and the core unified notes, calendar, tasks, school/study, planning, profile, integration, sync, backup, web/PWA and Windows-client architecture. Release readiness still requires the live PostgreSQL, model, provider, two-client, backup/restore and Windows packaging checks listed in `docs/IMPLEMENTATION-STATUS.md`.

The exact continuation checklist for the owner's RTX 4090 Windows host is in `docs/RTX-4090-HANDOFF.md`.

## Start locally

1. Copy `.env.example` to `.env` and replace `BOOTSTRAP_SECRET` and `POSTGRES_PASSWORD`.
2. Run `docker compose up -d postgres`.
3. Run `pnpm install`, then `pnpm db:migrate`.
4. Run `pnpm dev`.

The web app runs at `http://127.0.0.1:5173`; the API listens only on `127.0.0.1:3210` by default.

No external provider, private remote-access route, or cloud AI is enabled by default.

Owner Settings includes an explicit privacy/sync policy and a live host-status view. The status view reports unavailable workers and unconfigured backups honestly; it is evidence for setup, not a substitute for the 4090-host migration, model, backup, and recovery checks.

Finalized original files live under `BLOB_STORAGE_DIR`; the production Compose profile mounts that directory from the separate `sorta-blobs` volume. Browser capture supports deliberate files up to 64 MB, while the resumable generated API supports validated originals up to 2 GiB. Back up and restore the database and blob volume as one consistent private dataset with the scripts in `infra/backup`.

Run `pnpm deps:check` before release to verify that the generated dependency and license inventory still matches the installed lockfile graph. Regenerate it with `pnpm deps:inventory`; the human-readable summary and full package metadata are in `docs/DEPENDENCY-INVENTORY.md` and `docs/DEPENDENCY-INVENTORY.json`.

## Enroll the local AI worker

After owner setup and database migration, provision one host worker with `pnpm --filter @sorta/api worker:provision -- --name "Home RTX worker"`. Save the returned token once, then set `OMEGA_WORKER_ID`, `OMEGA_WORKER_TOKEN`, and the loopback `OMEGA_API_URL` for the native worker service. Run `pnpm --filter @sorta/local-worker start` only on the approved host after the selected runtimes and models have been verified. Ollama remains the default generation and embedding adapter. For the owner-selected Qwen3.8-Flash-Next target, set `LOCAL_CHAT_BACKEND=openai_compatible`, point `OPENAI_COMPATIBLE_BASE_URL` at an exact loopback `/v1/` endpoint, and record the verified immutable artifact digest in `OPENAI_COMPATIBLE_CHAT_MODEL_DIGEST`; keep Qwen3-Embedding-0.6B on the loopback Ollama adapter. Set the same backend and model name for the API container. Neither runtime may be exposed on the LAN by this application.

New workers can classify notes, run harmless model capability tests, build a shadow semantic index after the embedding capability succeeds, calculate query embeddings, and generate grounded answers. Each indexed chunk is checked against its exact source offsets/hash; the old active index remains available until every requested revision is present and the new generation is atomically activated. For semantic search and grounded answers, the worker returns a query vector to the server; the server enforces vault scope, checks the exact model digest, and selects a bounded evidence packet. Generated citation IDs must belong to that packet, and their note revision, offsets, and quote are checked again before the answer is saved. Brainstorm mode is explicitly ungrounded and cannot attach citations.

## Run the host maintenance worker

Backups are executed by a separate Windows host process because it must invoke Docker Compose without placing host control inside the API container. Set `DATABASE_URL`, a recovery-recorded 32-byte `BACKUP_ENCRYPTION_KEY_HEX`, and the absolute `OMEGA_WORKSPACE_ROOT`. Configure an owner-approved absolute destination with `pnpm --filter @sorta/maintenance-worker backup:configure -- --label "Local encrypted backup" --root "D:\\SortaOmegaBackups"`, then run `pnpm --filter @sorta/maintenance-worker start` under the selected Windows service account. The worker claims only the closed backup-create, backup-verify, and restore-plan job kinds, validates every dump/blob hash, and writes authenticated AES-256-GCM bundles. Replacement restore stays an explicit maintenance command because restoring the database replaces the job registry itself; do not run it while the application is serving requests.

## Windows home-host profile

Run `infra/windows-host/host-doctor.ps1` on the intended host first. Set `APP_ORIGIN` to the one reviewed canonical origin, then run `docker compose up -d --build`. The production container serves both the web interface and API from port 3210; Docker publishes that port only on `127.0.0.1`. PostgreSQL has no host port. Follow `infra/remote-access/REMOTE-ACCESS.md` to expose only the application through private Tailscale Serve or the documented Access-protected alternative.
