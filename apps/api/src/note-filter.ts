import type { z } from "zod";
import { noteFilterSchema } from "@sorta/contracts";

export function compileNoteFilter(filter: z.infer<typeof noteFilterSchema>, firstParameter = 2) {
  const values: unknown[] = [];
  const clauses = filter.conditions.map((condition) => {
    const parameter = (value: unknown) => { const reference = `$${firstParameter + values.length}`; values.push(value); return reference; };
    if (condition.type === "classification") {
      if (condition.value === null) return "n.classification IS NULL";
      return `n.classification = ${parameter(condition.value)}`;
    }
    if (condition.type === "label") {
      return `EXISTS (SELECT 1 FROM note_labels filter_nl WHERE filter_nl.note_id = n.id AND filter_nl.label_id = ${parameter(condition.labelId)}::uuid)`;
    }
    if (condition.type === "text_contains") {
      return `position(lower(${parameter(condition.value)}::text) in lower(n.title || ' ' || n.body)) > 0`;
    }
    return `n.status = ${parameter(condition.value)}`;
  });
  return { sql: clauses.length ? `(${clauses.join(filter.operator === "and" ? " AND " : " OR ")})` : "true", values };
}

export function filterLabelIds(filter: z.infer<typeof noteFilterSchema>) {
  return [...new Set(filter.conditions.flatMap((condition) => condition.type === "label" ? [condition.labelId] : []))];
}
