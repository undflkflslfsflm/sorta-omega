import type { ModelProfile } from "@sorta/contracts";

export type OllamaInspection =
  | { state: "available" | "model_missing"; models: Array<{ name: string; digest: string | null }> }
  | { state: "worker_offline" | "error"; models: []; detail: string };

export function assertPrivateOllamaUrl(value: string): URL {
  const url = new URL(value);
  const loopback = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
  if (url.protocol !== "http:" || !loopback || url.username || url.password || url.pathname !== "/") {
    throw new Error("ollama_url_must_be_loopback_http_origin");
  }
  return url;
}

export function configuredModelProfiles(
  chatModel: string,
  embeddingModel: string,
  installed: ReadonlyMap<string, string | null> = new Map(),
  chatBackend: "ollama" | "openai_compatible" = "ollama"
): ModelProfile[] {
  return [
    {
      id: "local-qwen-general",
      label: "Qwen local general",
      backend: chatBackend,
      model: chatModel,
      digest: installed.get(chatModel) ?? null,
      capabilities: ["generate", "chat", "extract", "classify"],
      enabled: true,
      installed: installed.has(chatModel),
      tested: false
    },
    {
      id: "local-qwen-embedding",
      label: "Qwen local embedding",
      backend: "ollama",
      model: embeddingModel,
      digest: installed.get(embeddingModel) ?? null,
      capabilities: ["embed"],
      enabled: true,
      installed: installed.has(embeddingModel),
      tested: false
    }
  ];
}

export async function inspectOllama(baseUrl: string, timeoutMs = 1_500): Promise<OllamaInspection> {
  const origin = assertPrivateOllamaUrl(baseUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(new URL("api/tags", origin), { signal: controller.signal });
    if (!response.ok) return { state: "error", models: [], detail: `ollama_http_${response.status}` };
    const payload = await response.json() as { models?: Array<{ name?: unknown; model?: unknown; digest?: unknown }> };
    const models = (payload.models ?? []).flatMap((entry) => {
      const name = typeof entry.name === "string" ? entry.name : typeof entry.model === "string" ? entry.model : null;
      return name ? [{ name, digest: typeof entry.digest === "string" ? entry.digest : null }] : [];
    });
    return { state: models.length ? "available" : "model_missing", models };
  } catch (error) {
    if (error instanceof Error && error.message === "ollama_url_must_be_loopback_http_origin") throw error;
    return { state: "worker_offline", models: [], detail: "ollama_unreachable" };
  } finally {
    clearTimeout(timeout);
  }
}
