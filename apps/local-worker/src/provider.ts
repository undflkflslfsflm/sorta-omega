export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
export type JsonSchema = Record<string, unknown>;

export interface AiProvider {
  generate(prompt: string): Promise<string>;
  chat(messages: ChatMessage[]): Promise<string>;
  embed(input: string | string[], dimensions?: number): Promise<number[][]>;
  extract<T>(prompt: string, schema: JsonSchema, validate: (value: unknown) => T): Promise<T>;
  classify<T>(text: string, schema: JsonSchema, validate: (value: unknown) => T): Promise<T>;
}

export class OllamaProvider implements AiProvider {
  constructor(private readonly baseUrl: URL, private readonly chatModel: string, private readonly embeddingModel: string) {}

  private async post(path: string, body: unknown) {
    const response = await fetch(new URL(path, this.baseUrl), {
      method: "POST",
      redirect: "error",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120_000)
    });
    if (!response.ok) throw new Error(`ollama_http_${response.status}`);
    return response.json() as Promise<any>;
  }

  async generate(prompt: string) { return this.chat([{ role: "user", content: prompt }]); }

  async chat(messages: ChatMessage[]) {
    const result = await this.post("api/chat", { model: this.chatModel, messages, stream: false, think: false, options: { temperature: 0 } });
    if (typeof result.message?.content !== "string") throw new Error("ollama_invalid_chat_response");
    return result.message.content;
  }

  async embed(input: string | string[], dimensions = 1024) {
    const result = await this.post("api/embed", { model: this.embeddingModel, input, dimensions, truncate: false });
    if (!Array.isArray(result.embeddings) || result.embeddings.length !== (Array.isArray(input) ? input.length : 1) || result.embeddings.some((vector: unknown) => !Array.isArray(vector) || vector.length !== dimensions || vector.some((value) => typeof value !== "number" || !Number.isFinite(value)))) {
      throw new Error("ollama_invalid_embedding_response");
    }
    return result.embeddings as number[][];
  }

  async extract<T>(prompt: string, schema: JsonSchema, validate: (value: unknown) => T) {
    const result = await this.post("api/chat", {
      model: this.chatModel,
      messages: [{ role: "system", content: `Return only JSON matching this schema: ${JSON.stringify(schema)}` }, { role: "user", content: prompt }],
      stream: false,
      think: false,
      format: schema,
      options: { temperature: 0 }
    });
    if (typeof result.message?.content !== "string") throw new Error("ollama_invalid_structured_response");
    return validate(JSON.parse(result.message.content));
  }

  classify<T>(text: string, schema: JsonSchema, validate: (value: unknown) => T) {
    return this.extract(`Classify this saved note without adding facts.\n\n${text}`, schema, validate);
  }
}

export class OpenAiCompatibleProvider implements AiProvider {
  constructor(
    private readonly baseUrl: URL,
    private readonly chatModel: string,
    private readonly apiKey?: string,
    private readonly embeddingModel?: string
  ) {}

  private async post(path: string, body: unknown) {
    const response = await fetch(new URL(path, this.baseUrl), {
      method: "POST",
      redirect: "error",
      headers: {
        "content-type": "application/json",
        ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {})
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120_000)
    });
    if (!response.ok) throw new Error(`openai_compatible_http_${response.status}`);
    return response.json() as Promise<any>;
  }

  async generate(prompt: string) { return this.chat([{ role: "user", content: prompt }]); }

  async chat(messages: ChatMessage[]) {
    const result = await this.post("chat/completions", {
      model: this.chatModel,
      messages,
      stream: false,
      temperature: 0
    });
    const content = result.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("openai_compatible_invalid_chat_response");
    return content;
  }

  async embed(input: string | string[], dimensions = 1024) {
    if (!this.embeddingModel) throw new Error("openai_compatible_embedding_model_not_configured");
    const result = await this.post("embeddings", { model: this.embeddingModel, input, dimensions });
    const data = result.data;
    if (!Array.isArray(data) || data.length !== (Array.isArray(input) ? input.length : 1)) throw new Error("openai_compatible_invalid_embedding_response");
    const ordered = [...data].sort((a, b) => Number(a?.index) - Number(b?.index));
    if (ordered.some((item, index) => item?.index !== index)) throw new Error("openai_compatible_invalid_embedding_response");
    const vectors = ordered.map((item) => item?.embedding);
    if (vectors.some((vector) => !Array.isArray(vector) || vector.length !== dimensions || vector.some((value) => typeof value !== "number" || !Number.isFinite(value)))) {
      throw new Error("openai_compatible_invalid_embedding_response");
    }
    return vectors as number[][];
  }

  async extract<T>(prompt: string, schema: JsonSchema, validate: (value: unknown) => T) {
    const result = await this.post("chat/completions", {
      model: this.chatModel,
      messages: [
        { role: "system", content: `Return only JSON matching this schema: ${JSON.stringify(schema)}` },
        { role: "user", content: prompt }
      ],
      stream: false,
      temperature: 0,
      response_format: {
        type: "json_schema",
        json_schema: { name: "omega_response", strict: true, schema }
      }
    });
    const content = result.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("openai_compatible_invalid_structured_response");
    return validate(JSON.parse(content));
  }

  classify<T>(text: string, schema: JsonSchema, validate: (value: unknown) => T) {
    return this.extract(`Classify this saved note without adding facts.\n\n${text}`, schema, validate);
  }
}
