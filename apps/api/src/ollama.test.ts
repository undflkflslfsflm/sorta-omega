import { describe, expect, it } from "vitest";
import { assertPrivateOllamaUrl, configuredModelProfiles } from "./ollama.js";

describe("Ollama boundary", () => {
  it("accepts loopback HTTP and rejects LAN, cloud, credentials and paths", () => {
    expect(assertPrivateOllamaUrl("http://127.0.0.1:11434").origin).toBe("http://127.0.0.1:11434");
    expect(() => assertPrivateOllamaUrl("http://192.168.1.20:11434")).toThrow("ollama_url_must_be_loopback_http_origin");
    expect(() => assertPrivateOllamaUrl("https://example.com")).toThrow("ollama_url_must_be_loopback_http_origin");
    expect(() => assertPrivateOllamaUrl("http://user:secret@localhost:11434")).toThrow("ollama_url_must_be_loopback_http_origin");
    expect(() => assertPrivateOllamaUrl("http://localhost:11434/api")).toThrow("ollama_url_must_be_loopback_http_origin");
  });

  it("reports configured profiles without claiming untested capability", () => {
    const profiles = configuredModelProfiles("qwen3.5:4b", "qwen3-embedding:0.6b", new Map([["qwen3.5:4b", "sha256:known"]]));
    expect(profiles[0]).toMatchObject({ id: "local-qwen-general", backend: "ollama", installed: true, tested: false, digest: "sha256:known" });
    expect(profiles[1]).toMatchObject({ id: "local-qwen-embedding", backend: "ollama", installed: false, tested: false, digest: null });
  });

  it("represents an OpenAI-compatible general model separately from the Ollama embedding model", () => {
    const profiles = configuredModelProfiles(
      "Qwen/Qwen3.8-Flash-Next",
      "qwen3-embedding:0.6b",
      new Map([["Qwen/Qwen3.8-Flash-Next", "sha256:model"]]),
      "openai_compatible"
    );
    expect(profiles[0]).toMatchObject({ id: "local-qwen-general", backend: "openai_compatible", model: "Qwen/Qwen3.8-Flash-Next", installed: true });
    expect(profiles[1]).toMatchObject({ id: "local-qwen-embedding", backend: "ollama", installed: false });
  });
});
