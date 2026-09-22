# Ollama embedding validation — 2026-09-22

## Environment

- Host: `SILENT-4090`.
- GPU: NVIDIA GeForce RTX 4090, 24,564 MiB VRAM.
- NVIDIA driver: `581.80`.
- Ollama API version: `0.34.2`, reachable only through host loopback during this validation.

## Exact model evidence

- Requested model: `qwen3-embedding:0.6b`.
- Ollama digest: `sha256:ac6da0dfba84a81fdbfbaf330198c33cd77c4cdfc53e8bc50eb581914a15621d`.
- Stored bytes: `639,150,858`.
- Reported parameter size: `595.78M`.
- Quantization: `Q8_0`.

The model was pulled through the local Ollama API and then invoked with a real embedding request. The response contained exactly 1,024 numeric dimensions and every value was finite. This satisfies the database and worker dimension invariant; it does not by itself validate retrieval quality.

The required generation model remains a separate gate. Existing unrelated local models were inspected but not changed, selected or represented as substitutes for `Qwen/Qwen3.8-Flash-Next`.
