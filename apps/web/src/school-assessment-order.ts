import type { SchoolAssessment } from "@sorta/contracts";

type OrderedAssessment = Pick<SchoolAssessment, "id" | "timeSpec" | "updatedAt">;
type CategorizedAssessment = OrderedAssessment & Pick<SchoolAssessment, "title">;

function localDate(assessment: OrderedAssessment): string | null {
  if (assessment.timeSpec.kind === "unknown") return null;
  if (assessment.timeSpec.kind === "date_only") return assessment.timeSpec.date;
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: assessment.timeSpec.timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date(assessment.timeSpec.dueAt));
}

export function orderSchoolAssessments<T extends OrderedAssessment>(items: T[], today: string): T[] {
  return [...items].sort((left, right) => {
    const leftDate = localDate(left), rightDate = localDate(right);
    const leftGroup = leftDate === null ? 2 : leftDate >= today ? 0 : 1;
    const rightGroup = rightDate === null ? 2 : rightDate >= today ? 0 : 1;
    if (leftGroup !== rightGroup) return leftGroup - rightGroup;
    if (leftDate !== null && rightDate !== null && leftDate !== rightDate) {
      return leftGroup === 1 ? rightDate.localeCompare(leftDate) : leftDate.localeCompare(rightDate);
    }
    return right.updatedAt.localeCompare(left.updatedAt) || left.id.localeCompare(right.id);
  });
}

export function partitionSchoolAssessments<T extends CategorizedAssessment>(items: T[], today: string, gradedAssessmentIds: ReadonlySet<string>): { attention: T[]; history: T[] } {
  const attention: T[] = [], history: T[] = [];
  for (const item of items) {
    const date = localDate(item);
    const routineEvaluation = /^(halvårsvurdering|standpunkt)\b/i.test(item.title.trim());
    if (routineEvaluation || gradedAssessmentIds.has(item.id) || date !== null && date < today) history.push(item);
    else attention.push(item);
  }
  return { attention, history };
}
