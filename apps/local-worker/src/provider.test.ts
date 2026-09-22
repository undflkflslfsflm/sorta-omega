import { afterEach, describe, expect, it, vi } from "vitest";
import { OllamaProvider, OpenAiCompatibleProvider } from "./provider.js";

afterEach(() => vi.unstubAllGlobals());

describe("Ollama provider", () => {
  it("requests schema-constrained non-streaming output and validates it", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: { content: '{"ok":true}' } }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const provider = new OllamaProvider(new URL("http://127.0.0.1:11434/"), "chat-model", "embed-model");
    const schema = { type: "object", properties: { ok: { const: true } }, required: ["ok"] };
    const result = await provider.extract("test", schema, (value) => value as { ok: true });
    expect(result.ok).toBe(true);
    expect(fetchMock.mock.calls[0][1].redirect).toBe("error");
    const request = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(request).toMatchObject({ model: "chat-model", stream: false, think: false, format: schema, options: { temperature: 0 } });
  });

  it("rejects an embedding with the wrong runtime dimension", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ embeddings: [[0.1, 0.2]] }), { status: 200 })));
    const provider = new OllamaProvider(new URL("http://127.0.0.1:11434/"), "chat-model", "embed-model");
    await expect(provider.embed("test", 1024)).rejects.toThrow("ollama_invalid_embedding_response");
  });
});

describe("OpenAI-compatible provider", () => {
  it("uses strict JSON-schema output without sending an API key when none is configured", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: '{"ok":true}' } }] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const provider = new OpenAiCompatibleProvider(new URL("http://127.0.0.1:8000/v1/"), "Qwen/Qwen3.8-Flash-Next");
    const schema = { type: "object", properties: { ok: { const: true } }, required: ["ok"], additionalProperties: false };
    const result = await provider.extract("test", schema, (value) => value as { ok: true });
    expect(result.ok).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.href).toBe("http://127.0.0.1:8000/v1/chat/completions");
    expect(init.headers).not.toHaveProperty("authorization");
    expect(init.redirect).toBe("error");
    expect(JSON.parse(init.body as string)).toMatchObject({
      model: "Qwen/Qwen3.8-Flash-Next",
      stream: false,
      temperature: 0,
      chat_template_kwargs: { enable_thinking: false },
      response_format: { type: "json_schema", json_schema: { name: "omega_response", strict: true, schema } }
    });
  });

  it("rejects malformed chat and embedding responses", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [{ index: 0, embedding: [0.1] }] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const provider = new OpenAiCompatibleProvider(new URL("http://127.0.0.1:8000/v1/"), "chat", "local-secret-value", "embed");
    await expect(provider.chat([{ role: "user", content: "test" }])).rejects.toThrow("openai_compatible_invalid_chat_response");
    await expect(provider.embed("test", 1024)).rejects.toThrow("openai_compatible_invalid_embedding_response");
  });
});

describe("embedding batch correspondence", () => {
  it.each([{embeddings:[]}, {embeddings:[[0.1,0.2]]}, {embeddings:[[0.1,0.2],[0.3,0.4],[0.5,0.6]]}])("rejects missing or extra Ollama vectors: %j", async ({embeddings}) => {
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response(JSON.stringify({embeddings}),{status:200})));
    const provider=new OllamaProvider(new URL("http://127.0.0.1:11434/"),"chat","embed");
    await expect(provider.embed(["one","two"],2)).rejects.toThrow("ollama_invalid_embedding_response");
  });
  it("rejects duplicate embedding indices and restores valid response order",async()=>{
    const fetchMock=vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({data:[{index:0,embedding:[1,2]},{index:0,embedding:[3,4]}]})))
      .mockResolvedValueOnce(new Response(JSON.stringify({data:[{index:1,embedding:[3,4]},{index:0,embedding:[1,2]}]})));
    vi.stubGlobal("fetch",fetchMock);
    const provider=new OpenAiCompatibleProvider(new URL("http://127.0.0.1:8000/v1/"),"chat",undefined,"embed");
    await expect(provider.embed(["one","two"],2)).rejects.toThrow("openai_compatible_invalid_embedding_response");
    expect(await provider.embed(["one","two"],2)).toEqual([[1,2],[3,4]]);
  });
});
