# Sorta Omega desktop shell

This package is the Windows Tauri 2 shell for the same application served by the local Fastify host. It does not create a second data store or bypass the API domain rules.

## Implemented boundary

- `Ctrl+Shift+Space` opens the hidden quick-capture window.
- The tray menu opens Sorta, opens quick capture, or exits.
- Clipboard text is read only after the visible **Paste clipboard** action invokes `clipboard_capture_selection`; there is no clipboard watcher.
- `file_import` uses an owner-visible native picker, streams the selected file through the canonical resumable upload contract, verifies per-part and whole-file SHA-256, and returns only the immutable blob record to the renderer. Local paths and native credentials never enter renderer state; failed open uploads receive a bounded cancellation attempt.
- Workspace navigation accepts a closed workspace enum and an optional UUID. It cannot open arbitrary URLs or execute native commands.
- `launch_calendar_view`, `open_calendar_event`, and `open_commitment` emit the same validated navigation event. The renderer validates it again, respects unsaved-editor guards, and focuses the exact loaded calendar/commitment record; requested notes are loaded through the authenticated API.
- Start-at-login is an explicit native setting. It is not enabled by default.
- Native Settings displays the registered quick-capture shortcut and the actual Windows start-at-login state; changes are reread from the native layer before the UI reports their result.
- Main and quick-capture windows have separate capability manifests, both limited to the loopback production origin.

The production windows load `http://127.0.0.1:3210`, so WebAuthn origin and strict session cookies remain aligned with the local host. A later canonical-origin change must update and retest the API configuration, passkeys, desktop capability URL and client caches together.

## Commands

```powershell
pnpm --filter @sorta/desktop typecheck
pnpm --filter @sorta/desktop test
pnpm --filter @sorta/desktop native:info
pnpm --filter @sorta/desktop native:build
```

`native:build` requires Rust through rustup, Visual Studio Build Tools with the MSVC C++ workload and Windows SDK, and WebView2. The Rust crate, finite command permissions, optimized executable, MSI and NSIS bundles were compiled on `SILENT-4090` at commit `e2c4410`; see `docs/evidence/NATIVE-WINDOWS-BUILD-2026-09-22.md`. The artifacts are explicitly unsigned. Install/upgrade/rollback/uninstall, shortcut-conflict behavior, live Credential Manager/pairing/import flows and the quick-capture latency target remain runtime acceptance gates.

Do not broaden the remote capability URL to an arbitrary web origin. A desktop shell that targets another PC must use the scoped pairing/native-token flow before private IPC is enabled for that origin.
