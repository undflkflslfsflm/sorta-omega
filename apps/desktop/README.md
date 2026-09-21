# Sorta Omega desktop shell

This package is the Windows Tauri 2 shell for the same application served by the local Fastify host. It does not create a second data store or bypass the API domain rules.

## Implemented boundary

- `Ctrl+Shift+Space` opens the hidden quick-capture window.
- The tray menu opens Sorta, opens quick capture, or exits.
- Clipboard text is read only after the visible **Paste clipboard** action invokes `clipboard_capture_selection`; there is no clipboard watcher.
- File selection uses an owner-visible native picker and returns only the selected path and display name. Reading/importing it still belongs to the canonical capture service and is not claimed by this picker alone.
- Workspace navigation accepts a closed workspace enum and an optional UUID. It cannot open arbitrary URLs or execute native commands.
- Start-at-login is an explicit native setting. It is not enabled by default.
- Main and quick-capture windows have separate capability manifests, both limited to the loopback production origin.

The production windows load `http://127.0.0.1:3210`, so WebAuthn origin and strict session cookies remain aligned with the local host. A later canonical-origin change must update and retest the API configuration, passkeys, desktop capability URL and client caches together.

## Commands

```powershell
pnpm --filter @sorta/desktop typecheck
pnpm --filter @sorta/desktop test
pnpm --filter @sorta/desktop native:info
pnpm --filter @sorta/desktop native:build
```

`native:build` requires Rust through rustup, Visual Studio Build Tools with the MSVC C++ workload and Windows SDK, and WebView2. MSI/NSIS artifacts, signing, install/upgrade/rollback/uninstall, shortcut-conflict handling and the quick-capture latency target remain unverified until that toolchain is present.

Do not broaden the remote capability URL to an arbitrary web origin. A desktop shell that targets another PC must use the scoped pairing/native-token flow before private IPC is enabled for that origin.
