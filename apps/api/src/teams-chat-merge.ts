function parts(body: string): { header: string; messages: string[] } {
  const divider = body.indexOf("\n\n");
  if (divider < 0) throw new Error("teams_chat_body_invalid");
  const header = body.slice(0, divider);
  const messages = body.slice(divider + 2).split(/\n\n(?=\[[0-9a-f]{16}\] )/);
  if (!messages.length || messages.some(message => !/^\[[0-9a-f]{16}\] /.test(message))) throw new Error("teams_chat_message_format_invalid");
  return { header, messages };
}

export function mergeTeamsChatBodies(previousBody: string, capturedBody: string): string {
  const previous = parts(previousBody), captured = parts(capturedBody);
  const messages = new Map<string, string>();
  for (const message of [...previous.messages, ...captured.messages]) {
    const id = message.slice(1, 17);
    const older = messages.get(id);
    if (!older || message.length > older.length) messages.set(id, message);
  }
  const result = `${captured.header}\n\n${[...messages.values()].join("\n\n")}`;
  if (Buffer.byteLength(result) > 1_000_000) throw new Error("teams_chat_merged_note_too_large");
  return result;
}
