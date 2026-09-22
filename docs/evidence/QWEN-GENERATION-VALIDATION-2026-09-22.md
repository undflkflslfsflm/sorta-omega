# Qwen generation runtime validation — 2026-09-22

## Artifact identity

- Required API identity: `Qwen/Qwen3.8-Flash-Next`
- GGUF source: `peasantsmith/Qwen3.8-Flash-Next-PS-IQ2_XXS-GGUF`
- Source revision: `c8122ffc62ae9befdf8b6017119e186bcf002a20`
- File: `Qwen3.8-Flash-Next-IQ2_XXS.gguf`
- Bytes: `75216526912`
- Published LFS SHA-256: `2e0f14e7eeddce8f80fc88cf96a9cc641b4f60549318fb53e30af85649883586`
- Computed SHA-256: `2e0f14e7eeddce8f80fc88cf96a9cc641b4f60549318fb53e30af85649883586`
- Integrity result: exact match

This is a community GGUF conversion of the required upstream model, not an official Qwen-distributed GGUF. That provenance distinction remains visible and is not replaced by the API alias.

## Runtime and host

- Host: `SILENT-4090`
- GPU: NVIDIA GeForce RTX 4090, 24,564 MiB reported total VRAM
- Runtime: llama.cpp server `0.4.1-dev`, build `11057`, commit `59657a613`
- Backend: Vulkan
- Bind: `127.0.0.1:8000` only
- Context: `4096`
- Parallel slots: `1`
- GPU layer policy: `auto`; the bundled fit estimator recommended 49 GPU layers with selective expert tensors on CPU
- Observed loaded resources: approximately 22.6 GiB VRAM and 22.3 GiB process working set

## Live API checks

The loaded `/v1/models` response exposed exactly `Qwen/Qwen3.8-Flash-Next`, format `gguf`, quantization `IQ2_XXS - 2.0625 bpw`, 176,943,899,520 parameters, 4,096 runtime context and 262,144 training context. `/health` returned `{"status":"ok"}`.

An initial 16-token chat request with default reasoning enabled exhausted its output budget in `reasoning_content` and returned empty `content`. Repeating with `chat_template_kwargs.enable_thinking=false` returned exactly `OK` in 0.95 seconds. The local-worker OpenAI-compatible adapter now sends that explicit setting for ordinary and schema-constrained generation.

A strict `response_format.type=json_schema` request with thinking disabled returned valid parsed content `{"answer":"OK"}` in 1.78 seconds. Runtime fingerprint was `b11057-59657a613`; usage was 28 prompt tokens and 12 completion tokens. This establishes real loopback chat and strict structured-output compatibility. It does not establish the complete held-out evaluation corpus or every application job.

## Process-lifetime note

Windows OpenSSH terminates child processes when the initiating SSH job ends. The successful load/API checks kept that session open. Production operation still requires a durable Windows service or scheduled task plus an authenticated worker enrollment after owner bootstrap; a detached child PID from an SSH command is not accepted as persistence evidence.

