export type AssessmentScopePart = { heading: string | null; text: string };

export function assessmentScopeParts(description: string): AssessmentScopePart[] {
  return description
    .trim()
    .split(/\n+|(?<=[.!?])\s+(?=[A-ZÆØÅ«])/u)
    .map(value => value.trim())
    .filter(Boolean)
    .map(value => {
      const labelled = /^(Kilder|To deler|Kap\.\s*\d+[^:]{0,40}|Øv i boka|Tema|Omfang|Hjelpemidler|Forberedelse):\s*(.+)$/iu.exec(value);
      return labelled ? { heading: labelled[1], text: labelled[2] } : { heading: null, text: value };
    });
}
