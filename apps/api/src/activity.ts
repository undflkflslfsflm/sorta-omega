import { z } from "zod";

const cursorSchema = z.object({ createdAt: z.string().datetime(), id: z.string().uuid() });

export function encodeActivityCursor(value: { createdAt: string; id: string }) {
  return Buffer.from(JSON.stringify(cursorSchema.parse(value))).toString("base64url");
}

export function decodeActivityCursor(value: string) {
  return cursorSchema.parse(JSON.parse(Buffer.from(value, "base64url").toString("utf8")));
}
