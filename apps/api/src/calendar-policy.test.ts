import { describe, expect, it } from "vitest";
import { calendarDecisionUndoResultSchema, calendarPolicyRuleSchema, policyDryRunInputSchema } from "@sorta/contracts";

const ruleId = "00000000-0000-4000-8000-000000000031";
const sourceId = "00000000-0000-4000-8000-000000000032";

describe("calendar automation policy contracts", () => {
  it("never permits an automatic external calendar action", () => {
    const base = { id: ruleId, sourceKind: "owner_note", action: "queue_external_calendar_action", enabled: true, predicate: { statementKind: "definite_plan", requireResolvedDate: true, requireResolvedIdentity: true, encounterMode: "any" } };
    expect(calendarPolicyRuleSchema.safeParse({ ...base, confirmation: "always_review" }).success).toBe(true);
    expect(calendarPolicyRuleSchema.safeParse({ ...base, confirmation: "auto_local_only" }).success).toBe(false);
  });

  it("keeps dry runs bounded and non-writing undo receipts explicit", () => {
    const policy = { id: ruleId, sourceKind: "owner_note", action: "create_private_event", enabled: true, confirmation: "auto_local_only", predicate: { statementKind: "definite_plan", requireResolvedDate: true, requireResolvedIdentity: true, encounterMode: "in_person" } };
    expect(policyDryRunInputSchema.safeParse({ policy, sourceIds: [sourceId], boundedWindow: { from: "2026-09-01T00:00:00.000Z", to: "2026-10-01T00:00:00.000Z" } }).success).toBe(true);
    expect(policyDryRunInputSchema.safeParse({ policy, sourceIds: [sourceId], boundedWindow: { from: "2026-01-01T00:00:00.000Z", to: "2026-10-01T00:00:00.000Z" } }).success).toBe(false);
    expect(calendarDecisionUndoResultSchema.parse({ decisionId: ruleId, compensation: "event_trashed", affectedRecordId: sourceId, writesApplied: true, undoneAt: "2026-09-20T12:00:00.000Z" }).writesApplied).toBe(true);
  });
});
