export type RankedCandidate = Record<string, any> & { kind: string; id: string; searchable_text: string };

export function reciprocalRankFusion(lexical: RankedCandidate[], semantic: RankedCandidate[], limit: number) {
  const fused = new Map<string, RankedCandidate & { score: number }>();
  lexical.forEach((row, rank) => fused.set(`${row.kind}:${row.id}`, { ...row, score: 1 / (60 + rank + 1) }));
  semantic.forEach((row, rank) => {
    const key = `${row.kind}:${row.id}`;
    const existing = fused.get(key);
    fused.set(key, { ...(existing ?? row), searchable_text: row.searchable_text, score: (existing?.score ?? 0) + 1 / (60 + rank + 1) });
  });
  return [...fused.values()].sort((left, right) => right.score - left.score).slice(0, limit);
}
