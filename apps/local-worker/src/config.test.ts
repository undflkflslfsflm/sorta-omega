import { describe, expect, it } from "vitest";
import { validatedHubUrl, validatedOllamaUrl, validatedOpenAiCompatibleUrl } from "./network-policy.js";

describe("worker network policy", () => {
  it("allows HTTPS hubs and loopback HTTP while keeping Ollama loopback-only", () => {
    expect(validatedHubUrl("https://omega.example.test").protocol).toBe("https:");
    expect(validatedHubUrl("http://127.0.0.1:3210").hostname).toBe("127.0.0.1");
    expect(() => validatedHubUrl("http://192.168.1.20:3210")).toThrow();
    expect(validatedOllamaUrl("http://127.0.0.1:11434").hostname).toBe("127.0.0.1");
    expect(() => validatedOllamaUrl("https://ollama.example.test")).toThrow();
    expect(() => validatedOllamaUrl("http://192.168.1.20:11434")).toThrow();
  });

  it("allows only an exact loopback HTTP v1 root for an OpenAI-compatible runtime", () => {
    expect(validatedOpenAiCompatibleUrl("http://127.0.0.1:8000/v1/").pathname).toBe("/v1/");
    expect(() => validatedOpenAiCompatibleUrl("http://192.168.1.20:8000/v1/")).toThrow();
    expect(() => validatedOpenAiCompatibleUrl("https://example.test/v1/")).toThrow();
    expect(() => validatedOpenAiCompatibleUrl("http://127.0.0.1:8000/other/")).toThrow();
  });
});
