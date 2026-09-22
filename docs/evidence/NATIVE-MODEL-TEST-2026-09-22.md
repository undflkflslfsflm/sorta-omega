# Native model capability test — 2026-09-22

Host: `SILENT-4090`

The desktop command `model.test` is implemented as a closed, read-only probe. It accepts no URL, model name, prompt, credential or shell input from the renderer. It contacts only:

- `http://127.0.0.1:8000/v1/chat/completions` with model `Qwen/Qwen3.8-Flash-Next`, a fixed marker prompt, thinking disabled, temperature zero and a 16-token ceiling.
- `http://127.0.0.1:11434/api/embed` with model `qwen3-embedding:0.6b` and one fixed input.

Both requests reject redirects, use a 60-second timeout, reject responses over 1 MiB and send no credentials. The command reports wall-clock latency and actual token/dimension metadata without pretending to measure GPU, VRAM or RAM.

## Validation

- Node 22.23.2 and pnpm 10.15.1: all 14 desktop bridge tests passed; desktop and contracts typechecks passed.
- Serial locked Rust check passed on the Windows host.
- The exact generation request returned `OMEGA_OK`, four completion tokens, in 1,293 ms.
- The exact embedding request returned 1,024 numeric dimensions in 3,793 ms.
- The first generation probe without `chat_template_kwargs.enable_thinking=false` exhausted the 16-token budget in hidden reasoning and returned empty visible content. The request was corrected rather than relabeled successful.
- The first embedding probe found no listener. A loopback-only persistent `SortaOmega-OllamaEmbedding` task was then installed from the checked-in launcher, and the real request passed.

The command compiles and its renderer contract is fixture-tested. Invoking the command through an installed Tauri build remains a separate installed-runtime acceptance check.
