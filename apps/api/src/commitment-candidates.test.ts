import { describe, expect, it } from "vitest";
import { groundedReturnCandidates } from "./commitment-candidates.js";

const candidate = (evidenceQuote:string,personName="Hanako",objectLabel="book") => ({ evidenceQuote, personName, objectLabel, kind:"return_object" as const, conditionKind:"next_meeting_with_person" as const });

describe("grounded return proposals", () => {
  it("retains a quoted explicit promise once", () => {
    const quote="I borrowed Hanako's book. I'll give it back next time I meet her.";
    expect(groundedReturnCandidates(quote,[candidate(quote),candidate(quote)])).toHaveLength(1);
    const norwegian="Jeg skal gi boka til Hanako tilbake neste gang jeg møter henne.";
    expect(groundedReturnCandidates(norwegian,[candidate(norwegian,"Hanako","boka")])).toHaveLength(1);
  });
  it("rejects invented or incomplete evidence", () => {
    const quote="I borrowed Hanako's book. I'll give it back next time I meet her.";
    expect(groundedReturnCandidates("A different note",[candidate(quote)])).toHaveLength(0);
    expect(groundedReturnCandidates(quote,[candidate(quote,"Ember")])).toHaveLength(0);
    expect(groundedReturnCandidates(quote,[candidate(quote,"Hanako","umbrella")])).toHaveLength(0);
    expect(groundedReturnCandidates("I borrowed Hanako's book.",[candidate("I borrowed Hanako's book.")])).toHaveLength(0);
    const uncertain="I might return Hanako's book next time I meet her.";
    expect(groundedReturnCandidates(uncertain,[candidate(uncertain)])).toHaveLength(0);
  });
});
