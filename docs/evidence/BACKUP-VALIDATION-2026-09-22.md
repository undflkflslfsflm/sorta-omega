# Live backup validation — 2026-09-22

## Scope

This record covers a non-destructive backup and archive-readability check against the running RTX 4090 deployment. It does **not** claim that the clean-host restore acceptance gate has passed.

## Environment

- Host: `SILENT-4090`
- Repository commit at execution: `a8f7357` (`Record live embedding model validation`)
- Repository: `C:\Users\vikto\Documents\Codex\2026-09-21\th\sorta-omega-git`
- Backup destination: `D:\SortaBackups\sorta-omega-20260922T154649Z`
- Production service readiness before the run: `{"status":"ready","database":"available"}`

## Execution and result

The supplied `infra/backup/backup.ps1` script produced a PostgreSQL custom-format dump and blob manifest. The supplied `infra/backup/restore.ps1` script was then run without `-Apply`; it verified the manifest and hashes, staged the dump in the database container, and successfully read its archive table with `pg_restore --list`.

- Backup format: `sorta-omega-backup-v2`
- Database dump bytes: `446009`
- Database dump SHA-256: `d8d5e8a7dde40b008df41b6fe308e23889b6c6e6dd5221b4a74b1827d924fb2c`
- Immutable blob count: `0`
- Immutable blob bytes: `0`
- Validation result: passed; no production data was changed

The zero-blob result is expected for the current pre-bootstrap deployment and does not exercise representative original-file restoration.

## Remaining release gate

Run an isolated clean-host restore after owner bootstrap and representative content creation. Verify database objects, source/citation continuity, immutable blob bytes and hashes, provider-send safety locks, application readiness, and post-restore authentication. That future run—not this archive-readability check—is the evidence required for `NOTE-14`, `OPS-04`, and `OMEGA-51`.
