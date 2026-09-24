import type { z } from "zod";
import { commitmentCandidateSchema } from "@sorta/contracts";

type Candidate = z.infer<typeof commitmentCandidateSchema>;

export function groundedReturnCandidates(sourceText: string, candidates: Candidate[]): Candidate[] {
  const seen = new Set<string>();
  return candidates.filter(candidate => {
    const quote = candidate.evidenceQuote.trim();
    const lower = quote.toLocaleLowerCase("nb-NO");
    if (!sourceText.includes(quote) || !lower.includes(candidate.personName.toLocaleLowerCase("nb-NO")) || !lower.includes(candidate.objectLabel.toLocaleLowerCase("nb-NO"))) return false;
    if (/\b(?:not|never|might|maybe|perhaps|ikke|aldri|kanskje)\b/iu.test(quote)) return false;
    if (!/(?:next time|neste gang)/iu.test(quote) || !/(?:meet|see|møt|treff)/iu.test(quote) || !/(?:return|give.{0,30}back|levere.{0,30}tilbake|gi.{0,30}tilbake)/iu.test(quote)) return false;
    const key = `${candidate.personName.toLocaleLowerCase("nb-NO")}\u0000${candidate.objectLabel.toLocaleLowerCase("nb-NO")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
