import "dotenv/config";
import { z } from "zod";
export { validatedHubUrl, validatedOllamaUrl, validatedOpenAiCompatibleUrl } from "./network-policy.js";

const schema = z.object({
  OMEGA_API_URL: z.string().url(),
  OMEGA_WORKER_ID: z.string().uuid(),
  OMEGA_WORKER_TOKEN: z.string().min(32),
  OLLAMA_BASE_URL: z.string().url().default("http://127.0.0.1:11434"),
  OLLAMA_CHAT_MODEL: z.string().min(1).default("qwen3.5:4b"),
  OLLAMA_EMBEDDING_MODEL: z.string().min(1).default("qwen3-embedding:0.6b"),
  LOCAL_CHAT_BACKEND: z.enum(["ollama", "openai_compatible"]).default("ollama"),
  OPENAI_COMPATIBLE_BASE_URL: z.string().url().default("http://127.0.0.1:8000/v1/"),
  OPENAI_COMPATIBLE_CHAT_MODEL: z.string().min(1).default("Qwen/Qwen3.8-Flash-Next"),
  OPENAI_COMPATIBLE_CHAT_MODEL_DIGEST: z.preprocess((value) => value === "" ? undefined : value, z.string().min(16).max(256).optional()),
  OPENAI_COMPATIBLE_API_KEY: z.preprocess((value) => value === "" ? undefined : value, z.string().min(16).max(4096).optional())
}).superRefine((value, context) => {
  if (value.LOCAL_CHAT_BACKEND === "openai_compatible" && !value.OPENAI_COMPATIBLE_CHAT_MODEL_DIGEST) {
    context.addIssue({ code: "custom", path: ["OPENAI_COMPATIBLE_CHAT_MODEL_DIGEST"], message: "A verified immutable model artifact digest is required" });
  }
});

export const workerConfig = schema.parse(process.env);
