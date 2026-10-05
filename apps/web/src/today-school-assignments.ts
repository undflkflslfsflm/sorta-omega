import type { SchoolAssignment } from "@sorta/contracts";

function dueKey(assignment: SchoolAssignment): string {
  if (assignment.due.kind === "exact") return assignment.due.dueAt;
  if (assignment.due.kind === "date_only") return `${assignment.due.date}T23:59:59`;
  return "9999-12-31T23:59:59";
}

export function openSchoolAssignmentsForToday(assignments: SchoolAssignment[]): SchoolAssignment[] {
  return assignments
    .filter(assignment => !assignment.archivedAt && assignment.providerListSection !== "completed")
    .sort((left, right) => {
      const leftPastDue = left.providerListSection === "past_due" ? 0 : 1;
      const rightPastDue = right.providerListSection === "past_due" ? 0 : 1;
      return leftPastDue - rightPastDue || dueKey(left).localeCompare(dueKey(right)) || left.title.localeCompare(right.title);
    });
}
