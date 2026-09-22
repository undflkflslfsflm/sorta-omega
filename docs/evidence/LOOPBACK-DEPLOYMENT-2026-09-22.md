# Loopback deployment evidence — 2026-09-22

## Scope

- Host: `SILENT-4090`, repository commit `2748b4c`.
- Docker Desktop engine: `29.7.2`, Linux containers through WSL2.
- Canonical validation origin: `http://127.0.0.1:3210`.
- Live secrets were independently generated on the host by `infra/windows-host/initialize-live-environment.ps1`. The script did not print their values and restricted `.env` to `Silent-4090\vikto` plus `SYSTEM` with inheritance disabled.
- Public base images:
  - `node:22.19-bookworm-slim` at `sha256:4a4884e8a44826194dff92ba316264f392056cbe243dcc9fd3551e71cea02b90`.
  - `pgvector/pgvector:pg16` at `sha256:ccc6e83d6e35e931dc7c5def2022729d5a6c370318d099181995567ff1fb4d6b`.

## Build findings and corrections

The first context transfer exceeded 1 GiB because generated Rust output was not excluded. It was stopped, and `.dockerignore` now excludes nested dependency, Rust target and generated permission directories. The corrected context was 3.68 MB.

The next build exposed incomplete workspace-manifest staging. All workspace manifests are now copied before the frozen pnpm install. A subsequent parallel recursive build reproduced a V8 fatal compiler-worker failure inside Linux, so production workspace builds now run deterministically with one workspace at a time.

The first running container applied every migration but restarted because Node ESM could not use named imports from the CommonJS `rrule` entrypoint. The import now uses the compatible default namespace form. The API build and all 202 API tests pass after that correction.

The final application image is `sha256:4009523d48d95f31ef740ea7fe205261638f9d3ccec4db54b5d6e51901f80a79`.

## Live verification

- PostgreSQL became healthy and exposes `5432/tcp` only inside the Compose network; `docker port` returned no host binding.
- The application became healthy and exposes only `127.0.0.1:3210->3210/tcp`.
- All 94 ordered migrations from `0001_stage1.sql` through `0094_rich_note_migration_actor.sql` were applied to an empty persistent volume.
- `GET /health/live` returned `{"status":"ok"}`.
- `GET /health/ready` returned `{"status":"ready","database":"available"}`.
- `GET /api/v1/meta` returned API `1.0.0`, minimum client `0.1.0` and schema version `93`.
- The unauthenticated `GET /api/v1/status` request returned HTTP `401`, as required before owner bootstrap.
- PostgreSQL and the app were restarted together. Both returned healthy afterward, and readiness plus metadata remained unchanged.

## Remaining acceptance gates

Owner bootstrap requires an interactive passkey ceremony and owner-controlled recovery-code storage. Authenticated persistence/effects scenarios, backup/restore, two-client private access, model runtimes, worker enrollment and provider accounts remain separate gates. No public port, router rule, provider account or model substitution was introduced during this validation.
