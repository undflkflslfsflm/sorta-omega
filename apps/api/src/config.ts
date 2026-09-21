import "dotenv/config";
import { z } from "zod";

const optionalEnv=(schema:z.ZodTypeAny)=>z.preprocess(value=>value===""?undefined:value,schema.optional());

const configSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_HOST: z.string().default("127.0.0.1"),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3210),
  APP_ORIGIN: z.string().url().default("http://127.0.0.1:5173"),
  OLLAMA_BASE_URL: z.string().url().default("http://127.0.0.1:11434"),
  OLLAMA_CHAT_MODEL: z.string().min(1).default("qwen3.5:4b"),
  OLLAMA_EMBEDDING_MODEL: z.string().min(1).default("qwen3-embedding:0.6b"),
  LOCAL_CHAT_BACKEND: z.enum(["ollama", "openai_compatible"]).default("ollama"),
  OPENAI_COMPATIBLE_BASE_URL: z.string().url().default("http://127.0.0.1:8000/v1/"),
  OPENAI_COMPATIBLE_CHAT_MODEL: z.string().min(1).default("Qwen/Qwen3.8-Flash-Next"),
  OPENAI_COMPATIBLE_CHAT_MODEL_DIGEST: z.preprocess(value=>value===""?undefined:value,z.string().min(16).max(256).optional()),
  OPENAI_COMPATIBLE_API_KEY: z.preprocess(value=>value===""?undefined:value,z.string().min(16).max(4096).optional()),
  OAUTH_CREDENTIAL_KEY_HEX: optionalEnv(z.string().regex(/^[0-9a-fA-F]{64}$/)),
  MICROSOFT_CLIENT_ID: optionalEnv(z.string().uuid()),
  MICROSOFT_TENANT_ID: optionalEnv(z.string().uuid()),
  MICROSOFT_CLIENT_SECRET: optionalEnv(z.string().min(1)),
  GOOGLE_CLIENT_ID: optionalEnv(z.string().min(1)),
  GOOGLE_CLIENT_SECRET: optionalEnv(z.string().min(1)),
  PUBLIC_PROVIDER_CALLBACKS_ENABLED: z.string().transform(value=>value==="true").default("false"),
  BLOB_STORAGE_DIR: z.string().min(1).default("./data/blob-storage"),
  BOOTSTRAP_SECRET: z.string().min(16).optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
}).superRefine((value,context)=>{if(value.LOCAL_CHAT_BACKEND==="openai_compatible"&&!value.OPENAI_COMPATIBLE_CHAT_MODEL_DIGEST)context.addIssue({code:"custom",path:["OPENAI_COMPATIBLE_CHAT_MODEL_DIGEST"],message:"A verified immutable model artifact digest is required"});});

export const config = configSchema.parse(process.env);
