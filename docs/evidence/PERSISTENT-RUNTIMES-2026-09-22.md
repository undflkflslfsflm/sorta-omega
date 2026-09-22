# Persistent Windows runtimes — 2026-09-22

Host: `SILENT-4090` (`vikto`), Windows scheduled tasks running with S4U tokens in session 0.

## Docker Desktop and production stack

- Docker Desktop engine: `29.7.2`.
- Scheduled task: `SortaOmega-DockerDesktop`, state `Running`; Task Scheduler result `267009` (`0x41301`, task is currently running).
- The task starts `com.docker.service`, launches Docker Desktop when its Linux engine is unavailable, and keeps the owning PowerShell process alive independently of SSH.
- A new SSH session verified the engine after the temporary launch session had ended.
- `sorta-omega-git-app-1`: healthy, published only as `127.0.0.1:3210->3210/tcp`.
- `sorta-omega-git-postgres-1`: healthy, with no published host port.

## Qwen generation runtime

- Scheduled task: `SortaOmega-QwenGeneration`, state `Running`; Task Scheduler result `267009` (`0x41301`).
- Runtime: llama.cpp server build `11057`, commit `59657a613`, Vulkan.
- Model alias returned by `GET /v1/models`: `Qwen/Qwen3.8-Flash-Next`.
- `GET /health` returned `status: ok` from a separate SSH session after the installer session had ended.
- A non-streaming completion with `chat_template_kwargs.enable_thinking=false` returned exactly `OK`, model `Qwen/Qwen3.8-Flash-Next`, finish reason `stop`, in 828 ms.
- The pinned GGUF and digest remain recorded in `QWEN-GENERATION-VALIDATION-2026-09-22.md`.

## Ollama embedding runtime

- Scheduled task: `SortaOmega-OllamaEmbedding`, state `Running`; Task Scheduler result `267009` (`0x41301`).
- Runtime: Ollama `0.34.2`, explicitly bound to `127.0.0.1:11434` by the task launcher.
- Model: `qwen3-embedding:0.6b`, digest `sha256:ac6da0dfba84a81fdbfbaf330198c33cd77c4cdfc53e8bc50eb581914a15621d`.
- A fresh request after task registration returned exactly 1,024 finite dimensions in 3,793 ms.
- The registered task and launcher keep the embedding runtime independent of an SSH session and restart it after failure.

## Reliability corrections made during deployment

- Runtime discovery no longer depends on wildcard expansion embedded in a path string, and the installer accepts an explicit absolute runtime directory.
- The launchers treat native process exit codes as authoritative because Windows PowerShell 5.1 otherwise promotes ordinary native stderr status messages to terminating `NativeCommandError` records.
- The Qwen readiness deadline is ten minutes so the first-run checksum of the 75.2 GB model can complete before the installer reports failure.
- A temporary `SortaOmega-StartDocker` diagnostic task was removed after the persistent task passed.
- The model capability request disables Qwen thinking explicitly; otherwise the small fixed output budget can be consumed by hidden reasoning while returning an empty visible response.

Owner bootstrap, worker enrollment, Tailscale authorization, clean-host restore and authenticated acceptance scenarios are not proven by this evidence.
