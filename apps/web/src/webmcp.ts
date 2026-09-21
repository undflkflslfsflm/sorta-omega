import { api } from "./api";

type ToolDefinition = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute(input: unknown): Promise<unknown>;
};

type ModelContext = {
  registerTool(tool: ToolDefinition, options?: { signal?: AbortSignal }): void | Promise<void>;
};

declare global {
  interface Document { readonly modelContext?: ModelContext }
}

function objectInput(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Input must be an object");
  return input as Record<string, unknown>;
}

export function registerOmegaTools(onChanged: () => Promise<void>): () => void {
  const context = document.modelContext;
  if (!context?.registerTool) return () => undefined;
  const lifecycle = new AbortController();

  const tools: ToolDefinition[] = [
    {
      name: "capture_note",
      title: "Capture note",
      description: "Save plain text into the signed-in owner's Sorta inbox as a canonical note and original source.",
      inputSchema: {
        type: "object",
        properties: { text: { type: "string", minLength: 1, maxLength: 200000 } },
        required: ["text"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      async execute(input) {
        const value = objectInput(input);
        if (typeof value.text !== "string" || !value.text.trim() || value.text.length > 200_000) throw new Error("text must be 1 to 200000 characters");
        const note = await api.capture(value.text.trim());
        await onChanged();
        return { noteId: note.id, revision: note.revision, status: note.status };
      }
    },
    {
      name: "create_task",
      title: "Create task",
      description: "Create a local task for the signed-in owner. This does not send messages or change an external provider.",
      inputSchema: {
        type: "object",
        properties: { title: { type: "string", minLength: 1, maxLength: 500 } },
        required: ["title"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        const value = objectInput(input);
        if (typeof value.title !== "string" || !value.title.trim() || value.title.length > 500) throw new Error("title must be 1 to 500 characters");
        const task = await api.createTask(value.title.trim());
        await onChanged();
        return { taskId: task.id, title: task.title, completed: task.completed };
      }
    },
    {
      name: "read_today",
      title: "Read Today",
      description: "Read the signed-in owner's current next action, upcoming local events, and open tasks.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      async execute() {
        const today = await api.today();
        return {
          nextAction: today.nextAction,
          upcomingEvents: today.upcomingEvents,
          dueTasks: today.dueTasks,
          noteCount: today.noteCount
        };
      }
    },
    {
      name: "search_local",
      title: "Search local records",
      description: "Run lexical search over the signed-in owner's authorized notes, tasks, and local calendar events. This does not invoke AI or send the query to another service.",
      inputSchema: {
        type: "object",
        properties: { query: { type: "string", minLength: 1, maxLength: 500 } },
        required: ["query"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      async execute(input) {
        const value = objectInput(input);
        if (typeof value.query !== "string" || !value.query.trim() || value.query.length > 500) throw new Error("query must be 1 to 500 characters");
        const result = await api.search(value.query.trim(), "lexical");
        if (!("items" in result)) throw new Error("lexical search unexpectedly queued");
        return { query: result.query, items: result.items, coverage: result.coverage };
      }
    }
  ];

  for (const tool of tools) {
    try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); }
    catch { /* Unsupported or disabled tool registration must not block the visible app. */ }
  }
  return () => lifecycle.abort();
}
