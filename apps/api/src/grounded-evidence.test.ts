import { describe, expect, it } from "vitest";
import { focusGroundedEvidence } from "./grounded-evidence.js";

const candidates = [
  { id: "older-maths", title: "Matematikk 2P", text: "Uke 34: prosent og vekstfaktor" },
  { id: "unrelated-test", title: "Historie", text: "Prøve i uke 39" },
  { id: "maths-test", title: "Matematikk 2P", text: "Uke 39: skriftlig prøve i kapittel 1 og sentralmål" },
  { id: "maths-prep", title: "Matematikk 2P", text: "Øveoppgaver til prøven 24. sep" }
];

describe("grounded evidence focus", () => {
  it("keeps only subject-specific assessment evidence when available", () => {
    expect(focusGroundedEvidence("What is my maths test about?", candidates).map((item) => item.id)).toEqual(["maths-test", "maths-prep"]);
    expect(focusGroundedEvidence("Hva er matematikkprøven om?", candidates).map((item) => item.id)).toEqual(["maths-test", "maths-prep"]);
  });

  it("does not narrow ordinary questions or discard all evidence when no assessment matches", () => {
    expect(focusGroundedEvidence("What did we study in maths?", candidates).map((item) => item.id)).toEqual(candidates.map((item) => item.id));
    expect(focusGroundedEvidence("What is my science test about?", candidates)).toEqual([]);
  });
});
