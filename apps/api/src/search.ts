export function buildExcerpt(text: string, query: string, maxLength = 240): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const terms = query.toLocaleLowerCase().split(/\s+/).filter((term) => term.length > 1);
  const lower = normalized.toLocaleLowerCase();
  const matches = terms.map((term) => lower.indexOf(term)).filter((index) => index >= 0);
  const center = matches.length ? Math.min(...matches) : 0;
  const start = Math.max(0, Math.min(center - Math.floor(maxLength / 3), normalized.length - maxLength));
  const prefix = start > 0 ? "…" : "";
  const suffix = start + maxLength < normalized.length ? "…" : "";
  return `${prefix}${normalized.slice(start, start + maxLength).trim()}${suffix}`;
}
