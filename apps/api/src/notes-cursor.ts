import { z } from "zod";

const cursorSchema = z.object({ updatedAt: z.string().datetime(), id: z.string().uuid() });

export function encodeNotesCursor(value: { updatedAt: string; id: string }) {
  return Buffer.from(JSON.stringify(cursorSchema.parse(value))).toString("base64url");
}

export function decodeNotesCursor(value: string) {
  return cursorSchema.parse(JSON.parse(Buffer.from(value, "base64url").toString("utf8")));
}
