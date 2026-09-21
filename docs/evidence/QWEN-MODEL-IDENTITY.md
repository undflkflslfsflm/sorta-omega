# Required generation model verification

Checked 2026-09-22 against the [official Qwen model repository](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) and [Hugging Face model metadata API](https://huggingface.co/api/models/Qwen/Qwen3.8-Flash-Next).

- Exact identity exists: `Qwen/Qwen3.8-Flash-Next`.
- Observed repository revision: `de4b8e4d43b917e7706784d8bb445c9af86a3540`.
- Metadata reports 179,999,981,459 stored parameters and no access gate.
- The model card labels its license `qwen-community-1.0`; metadata uses `other`. License terms still require review before distribution.
- The card describes 125B language parameters (6B activated), 51B n-gram embedding parameters and 4B MTP parameters.

Calculated storage estimate: 179,999,981,459 parameters at exactly four bits each require approximately 90.0 GB / 83.8 GiB, excluding quantization metadata, cache and runtime buffers. Activated parameter count does not establish weight residency. This rules out full four-bit weight residency in 24 GiB VRAM; it does not establish whether a particular mixed-precision or CPU/disk offload implementation is usable.

No weights were downloaded or executed. No quantized artifact, weight-file digest, runtime compatibility, strict JSON-schema behavior, performance or 4090 fit has been verified. The repository revision above is provenance, not a verified installed-weight digest; do not put it in the worker's artifact-digest field as proof of installation. Preserve the required model identity until the owner explicitly changes it.
