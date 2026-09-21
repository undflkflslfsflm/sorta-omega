export type MatchableCommitment = {
  id: string;
  status: "active" | "fulfilled" | "cancelled" | "superseded";
  personEntityId: string;
  objectLabel: string;
  conditionKind: "next_meeting_with_person";
};

export function matchesEvent(commitment: MatchableCommitment, eventEntityIds: readonly string[]): boolean {
  return commitment.status === "active"
    && commitment.conditionKind === "next_meeting_with_person"
    && eventEntityIds.includes(commitment.personEntityId);
}

export function commitmentPrepText(commitment: MatchableCommitment): string {
  return `Bring ${commitment.objectLabel}`;
}

export type CommitmentEvidenceKind = "owner_confirmed_action" | "source_note" | "owner_correction" | "superseded_by_new_commitment";

export function commitmentTransitionError(current: MatchableCommitment["status"], next: MatchableCommitment["status"], evidence: CommitmentEvidenceKind) {
  if (current === next) return "commitment_status_unchanged" as const;
  if (current === "active" && next === "fulfilled" && !["owner_confirmed_action", "source_note"].includes(evidence)) return "fulfillment_requires_action_evidence" as const;
  if (current === "active" && next === "superseded" && evidence !== "superseded_by_new_commitment") return "supersession_requires_replacement_evidence" as const;
  if (current !== "active" && next === "active" && evidence !== "owner_correction") return "reopen_requires_owner_correction" as const;
  if (current !== "active" && next !== "active" && evidence !== "owner_correction") return "terminal_transition_requires_owner_correction" as const;
  return null;
}
