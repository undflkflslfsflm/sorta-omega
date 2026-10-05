export function teamsChannelRevision(existing: { original_text: string; body: string }, incoming: { originalText: string; body: string }): { sourceChanged: boolean; noteChanged: boolean } {
  const sourceChanged = existing.original_text !== incoming.originalText;
  return { sourceChanged, noteChanged: sourceChanged || existing.body !== incoming.body };
}
