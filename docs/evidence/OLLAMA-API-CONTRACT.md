# Ollama API contract evidence

Checked: 2026-09-18

This records implementation-source evidence, not a live model test.

- The official chat endpoint is `POST /api/chat`; `stream: false` returns one completed response. The request supports `format` as JSON or a JSON Schema and supports `think: false`: <https://docs.ollama.com/api/chat>
- Ollama's structured-output guidance recommends passing the JSON Schema through `format`, grounding the prompt with the schema, validating the returned JSON, and using temperature zero for more deterministic output: <https://docs.ollama.com/capabilities/structured-outputs>
- The official embedding endpoint is `POST /api/embed`, accepts text or text arrays, and returns `embeddings: number[][]`; it supports an explicit `dimensions` request: <https://docs.ollama.com/api/embed>

The local worker follows those shapes and rejects malformed structured output or any embedding whose measured dimension is not exactly 1,024. The current Surface client has no Ollama runtime, so completion quality, actual model digests, GPU behavior and the 1,024-dimension runtime result remain not run.
