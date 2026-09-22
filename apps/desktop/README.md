# Sorta Omega desktop shell

This package is the Windows Tauri 2 shell for the same application served by the local Fastify host. It does not create a second data store or bypass the API domain rules.

## Implemented boundary

- `Ctrl+Shift+Space` opens the hidden quick-capture window.
- The tray menu opens Sorta, opens quick capture, or exits.
- Clipboard text is read only after the visible **Paste clipboard** action invokes `clipboard_capture_selection`; there is no clipboard watcher.
- File selection uses an owner-visible native picker and returns only the selected path and display name. Reading/importing it still belongs to the canonical capture service and is not claimed by this picker alone.
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

`native:build` requires Rust through rustup, Visual Studio Build Tools with the MSVC C++ workload and Windows SDK, and WebView2. MSI/NSIS artifacts, signing, install/upgrade/rollback/uninstall, shortcut-conflict handling, command-permission generation and the quick-capture latency target remain unverified until that toolchain is present. TypeScript bridge tests do not substitute for compiling the Rust command set.

Do not broaden the remote capability URL to an arbitrary web origin. A desktop shell that targets another PC must use the scoped pairing/native-token flow before private IPC is enabled for that origin.
