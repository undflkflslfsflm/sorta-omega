// A narrow write-intent gate shared by the API and local worker. This is not
// language understanding; the model interprets the date, and the API still
// validates the proposal before any write.
export function isDirectReminderRequest(text: string) {
  return /^\s*(?:(?:please|could\s+you|can\s+you|vil\s+du|kan\s+du|vær\s+så\s+snill)\s+)?(?:remind\s+me|set\s+(?:a\s+)?reminder|add\s+(?:a\s+)?reminder|schedule\s+(?:a\s+)?reminder|minn\s+meg|minne\s+meg|påminn\s+meg|sett\s+(?:en\s+)?påminnelse)\b/iu.test(text);
}
