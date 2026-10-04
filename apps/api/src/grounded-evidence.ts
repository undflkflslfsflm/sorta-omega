export type GroundedEvidenceCandidate = { title: string; text: string };

const assessmentTerms = /(?:\b(?:test|exam|quiz|assessment|prøve|prøven|eksamen|vurdering)\b|(?:matematikk|matte|historie|norsk|naturfag|økonomi)prøve[nr]?)/iu;
const subjectAliases = [
  { question: /\b(?:math|maths|mathematics|matte|matematikk)(?:prøve[nr]?|test)?\b/iu, evidence: /\b(?:math|maths|mathematics|matte|matematikk)\b/iu },
  { question: /\b(?:history|historie)\b/iu, evidence: /\b(?:history|historie)\b/iu },
  { question: /\b(?:norwegian|norsk)\b/iu, evidence: /\b(?:norwegian|norsk)\b/iu },
  { question: /\b(?:science|naturfag)\b/iu, evidence: /\b(?:science|naturfag)\b/iu },
  { question: /\b(?:economics|økonomi|økonomistyring)\b/iu, evidence: /\b(?:economics|økonomi|økonomistyring)\b/iu }
];

export function focusGroundedEvidence<T extends GroundedEvidenceCandidate>(question: string, candidates: T[], limit = 8): T[] {
  if (!assessmentTerms.test(question)) return candidates.slice(0, limit);
  const subject = subjectAliases.find((alias) => alias.question.test(question));
  const subjectCandidates = subject
    ? candidates.filter((candidate) => subject.evidence.test(`${candidate.title} ${candidate.text}`))
    : candidates;
  if (subject && !subjectCandidates.length) return [];
  const relevantSubject = subjectCandidates;
  const namedAssessment = relevantSubject.filter((candidate) => assessmentTerms.test(`${candidate.title} ${candidate.text}`));
  return (namedAssessment.length ? namedAssessment : relevantSubject).slice(0, limit);
}
