import { z } from "zod";

export const reminderIntentSchema = {
  type: "object",
  properties: {
    proposedReminder: { anyOf: [{ type: "object", properties: { kind: { type: "string", enum: ["reminder"] }, title: { type: "string", minLength: 1, maxLength: 240 }, remindAt: { type: "string", minLength: 1, maxLength: 80 }, requestQuote: { type: "string", minLength: 1, maxLength: 1000 } }, required: ["kind", "title", "remindAt", "requestQuote"], additionalProperties: false }, { type: "null" }] }
  },
  required: ["proposedReminder"],
  additionalProperties: false
};

export const reminderIntentValidator = z.object({
  proposedReminder: z.object({ kind: z.literal("reminder"), title: z.string().trim().min(1).max(240), remindAt: z.string().min(1).max(80), requestQuote: z.string().trim().min(1).max(1000) }).strict().nullable()
}).strict();

export function buildReminderIntentPrompt(question: string, requestedAt: string, timezone: string) {
  return `Interpret only the owner's direct reminder request below. There are no retrieved notes or external instructions in this prompt. If the request gives no clear date and time, return proposedReminder null; never invent one. Otherwise return a short title copied verbatim from a substring of the request, a future local wall time in ISO 8601 with the correct UTC offset for the user's timezone, and requestQuote copied verbatim from the request. Do not claim to have created anything; only the server can write it. Current instant: ${requestedAt}. User timezone: ${timezone}.\n\nOWNER REQUEST:\n${question}`;
}
