# Backup and restore

Run from the repository root on the Windows host. Backups contain both the PostgreSQL snapshot and every finalized immutable original blob. They contain private vault data and must be stored on an owner-controlled encrypted destination.

```powershell
.\infra\backup\backup.ps1 -Destination 'D:\SortaBackups'
.\infra\backup\restore.ps1 -BackupDirectory 'D:\SortaBackups\sorta-omega-YYYYMMDDTHHMMSSZ'
```

The first restore command validates the manifest hash and asks `pg_restore` to read the archive without changing data. After stopping other clients and taking a fresh backup, apply only with:

```powershell
.\infra\backup\restore.ps1 -BackupDirectory 'D:\SortaBackups\sorta-omega-YYYYMMDDTHHMMSSZ' -Apply -ConfirmExact 'RESTORE SORTA'
```

Validation checks the database dump plus the exact size and SHA-256 of every listed blob and refuses unlisted files. The apply path stops the app, restores with `--clean --if-exists --exit-on-error`, replaces temporary/blob storage from the verified bundle, and restarts only after database, files, permissions, and provider-send safety locks succeed. It does not include provider secrets or automatically enable external writes. A clean-host restore test and representative source/citation verification remain mandatory on the 4090 host before release.
