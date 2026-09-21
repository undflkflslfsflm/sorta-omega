# Current client preflight

Observed: 2026-09-21

This is evidence for the computer currently running Codex, **not** the required RTX 4090 home host.

| Probe | Observed value |
|---|---|
| Computer | `TAKK-OYVIND`, Microsoft Surface Laptop 5 |
| OS | Windows 11 Pro 64-bit, 10.0.26200 |
| CPU | Intel Core i7-1265U, 10 cores / 12 logical processors |
| Memory | 15.8 GB |
| GPU | Intel Iris Xe Graphics, driver 32.0.101.6737 |
| Storage | C: NTFS, 475.7 GB total, 388.1 GB free |
| Docker / Podman / PostgreSQL | Not found |
| Ollama | Not found |
| Tailscale / cloudflared | Not found |
| WSL executable | Present, but no Linux distribution is installed |
| WebView2 | 153.0.4234.32 |
| Rust / Cargo | Not installed |
| Visual Studio Build Tools / MSVC / Windows SDK | No qualifying installation detected by Tauri CLI |

Consequences:

- This machine must not be reported as the inspected RTX 4090 host.
- PostgreSQL migrations, real Ollama/model evaluation, service startup, and two-PC remote access are not live-verified here.
- The repository can still be compiled and fixture-tested with the bundled development runtime.
- The Tauri source, closed native schemas, TypeScript bridge and web integration can be built and fixture-tested here, but MSI/NSIS output cannot be truthfully claimed until Rust and the MSVC/Windows SDK toolchain are installed on the authorized Windows build host.

Latest repository verification on this client:

- OpenAPI and generated TypeScript client drift checks pass for 420 operations; the master-spec operation-name audit reports 355 expected, 420 implemented and zero missing.
- Full TypeScript type checking and production builds pass.
- 217 executable tests pass: 181 API, 22 local-worker, two maintenance-worker bundle/integrity tests, two browser-bridge normalization tests, seven desktop bridge, two trusted-browser replica tests and one generated-client test.
- The Tauri native pairing/credential implementation is source-complete but has no `Cargo.lock` yet because Cargo is unavailable; dependency resolution, Rust compilation, Windows Credential Manager behavior and installer packaging remain 4090/build-host gates.
