import { describe, expect, it } from "vitest";
import { entityMergeApplyResultSchema, previewEntityMergeSchema, proposalSchema } from "@sorta/contracts";

const first = "00000000-0000-4000-8000-000000000011";
const target = "00000000-0000-4000-8000-000000000012";
const vaultId = "00000000-0000-4000-8000-000000000001";

describe("entity merge contracts", () => {
  it("requires a unique included target and an explicit reason", () => {
    expect(previewEntityMergeSchema.safeParse({ entityIds: [first, target], targetId: target, reason: "Owner confirmed duplicate people" }).success).toBe(true);
    expect(previewEntityMergeSchema.safeParse({ entityIds: [first, first], targetId: first, reason: "duplicate" }).success).toBe(false);
    expect(previewEntityMergeSchema.safeParse({ entityIds: [first, target], targetId: vaultId, reason: "missing target" }).success).toBe(false);
  });

  it("keeps the preview non-writing and the application receipt explicit", () => {
    const proposal = proposalSchema.parse({ id: first, vaultId, kind: "entity_merge", status: "draft", revision: 1, diff: { targetEntityId: target, sourceEntityIds: [first], reason: "Owner confirmed duplicate people", affectedEventIds: [], affectedCommitmentIds: [], writesApplied: false }, expectedRevisions: { [first]: 1, [target]: 2 }, affectedRecordIds: [first, target], requiredPermissions: ["identity:merge"], stale: false, expiresAt: "2026-09-21T12:00:00.000Z", rejectionReason: null, createdAt: "2026-09-20T12:00:00.000Z", updatedAt: "2026-09-20T12:00:00.000Z" });
    expect(proposal.diff.writesApplied).toBe(false);
    expect(entityMergeApplyResultSchema.parse({ type: "entity_merge_apply", proposalId: first, targetEntityId: target, mergedEntityIds: [first], affectedEventIds: [], affectedCommitmentIds: [], writesApplied: true }).writesApplied).toBe(true);
  });
});
