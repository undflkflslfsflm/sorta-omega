# Windows native build evidence — 2026-09-22

## Scope and environment

- Host: `SILENT-4090`, Windows x64; repository commit `e2c4410`.
- Rust: `rustc 1.98.1 (48a229cea 2026-09-01)`, Cargo `1.98.1 (797e8a9bc 2026-08-05)` installed through the official rustup distribution.
- Microsoft Visual Studio Build Tools 2022 `17.14.41`, C++ workload and recommended Windows components.
- Checksum-verified portable Node `22.23.2` and pnpm `10.15.1` from the retained Node validation environment.
- Cargo dependency resolution is retained in `apps/desktop/src-tauri/Cargo.lock`.

## Commands and observed results

The first default-parallel `cargo check` reached dependency compilation but one `rustc` process exited with Windows `STATUS_ACCESS_VIOLATION` while compiling `time 0.3.55`. The same locked graph completed serially. This is retained as a host parallelism fault, not represented as a source failure or ignored success.

```text
cargo check -j 1 --manifest-path apps/desktop/src-tauri/Cargo.toml
Finished dev profile successfully.

cargo test -j 1 --manifest-path apps/desktop/src-tauri/Cargo.toml
1 Rust unit test passed; 0 failed. Library, binary and doc-test processes exited 0.

CARGO_BUILD_JOBS=1 pnpm --filter @sorta/desktop native:build
Web production build passed; optimized Rust executable linked; NSIS and MSI bundling exited 0.
```

The first native build audit exposed and led to correction of three real packaging gaps: undefined application command permissions, a non-cloneable navigation event payload, and missing/undeclared Windows icon resources. A broken prior pnpm junction tree was removed only under the checkout's generated `node_modules` directories and restored with `pnpm install --frozen-lockfile --child-concurrency=1 --network-concurrency=1`.

## Produced artifacts

| Artifact | Bytes | SHA-256 | Authenticode |
| --- | ---: | --- | --- |
| `Sorta Omega_0.1.0_x64-setup.exe` | 3,781,808 | `604DC88D7BC7121E4D0B4F582476BFA9D118EDEACCA6A22B05BDA26C0316FC8C` | `NotSigned` |
| `Sorta Omega_0.1.0_x64_en-US.msi` | 5,369,856 | `646750420E51E434FB1FF61E446334B7EF06A7896351D9BCA6BE64F7A29B7964` | `NotSigned` |

These are build evidence, not signed release artifacts. Installation, upgrade, rollback, uninstall, shortcut conflict, tray behavior, start-at-login, Credential Manager rotation, native pairing, live file import and quick-capture latency remain separate runtime acceptance gates.
