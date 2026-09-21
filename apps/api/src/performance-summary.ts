type GradeRow = { gradeValue: string; gradeScale: string; officialWeight: number | null };

export function summarizeGrades(rows: GradeRow[]) {
  const byScale = new Map<string, GradeRow[]>();
  for (const row of rows) byScale.set(row.gradeScale, [...(byScale.get(row.gradeScale) ?? []), row]);
  return [...byScale.entries()].map(([scale, grades]) => {
    const parsed = grades.map(grade => Number(grade.gradeValue));
    const completeWeights = grades.every(grade => grade.officialWeight !== null);
    const numeric = parsed.every(Number.isFinite); const knownWeightTotal = grades.reduce((sum, grade) => sum + (grade.officialWeight ?? 0), 0);
    const weightedNumericMean = numeric && completeWeights && knownWeightTotal > 0 ? grades.reduce((sum, grade, index) => sum + parsed[index] * grade.officialWeight!, 0) / knownWeightTotal : null;
    return { scale, count: grades.length, observedValues: grades.map(grade => grade.gradeValue), knownWeightTotal, weightedNumericMean };
  });
}
