export function validatedHubUrl(value: string) {
  const url = new URL(value);
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.username || url.password || url.pathname !== "/" || (url.protocol !== "https:" && !(url.protocol === "http:" && loopback))) throw new Error("hub_url_must_be_https_or_loopback_http_origin");
  return url;
}

export function validatedOllamaUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "http:" || url.pathname !== "/" || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || url.username || url.password) throw new Error("ollama_url_must_be_loopback_http_origin");
  return url;
}

export function validatedOpenAiCompatibleUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "http:" || url.pathname !== "/v1/" || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || url.username || url.password || url.search || url.hash) {
    throw new Error("openai_compatible_url_must_be_loopback_http_v1_origin");
  }
  return url;
}
