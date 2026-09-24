import { describe, expect, it } from "vitest";
import { assessmentScopeParts } from "./assessment-scope";

describe("assessment source formatting", () => {
  it("separates cited evidence, exam rules, topics, and practice without changing their words", () => {
    expect(assessmentScopeParts("Kilder: Teams > Matematikk > Generelt. To deler: del 1 uten hjelpemidler; del 2 med kalkulator. Kap. 1 prosent: prosentpoeng og vekstfaktor. Øv i boka: 1A 1.1–1.9. Offisiell vekt ikke oppgitt.")).toEqual([
      { heading: "Kilder", text: "Teams > Matematikk > Generelt." },
      { heading: "To deler", text: "del 1 uten hjelpemidler; del 2 med kalkulator." },
      { heading: "Kap. 1 prosent", text: "prosentpoeng og vekstfaktor." },
      { heading: "Øv i boka", text: "1A 1.1–1.9." },
      { heading: null, text: "Offisiell vekt ikke oppgitt." }
    ]);
  });

  it("preserves unstructured and multiline details", () => {
    expect(assessmentScopeParts("Bring your calculator.\nRoom H370")).toEqual([
      { heading: null, text: "Bring your calculator." },
      { heading: null, text: "Room H370" }
    ]);
  });
});
