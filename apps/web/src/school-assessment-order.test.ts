import { describe, expect, it } from "vitest";
import { orderSchoolAssessments, partitionSchoolAssessments } from "./school-assessment-order";

const item = (id: string, timeSpec: {kind:"unknown"}|{kind:"date_only";date:string;timezone:string}|{kind:"exact";dueAt:string;timezone:string}) => ({id,timeSpec,updatedAt:"2026-09-24T10:00:00.000Z"});

describe("orderSchoolAssessments", () => {
  it("puts the next known tests first, then past tests and unknown dates", () => {
    const items = [item("unknown",{kind:"unknown"}),item("past",{kind:"date_only",date:"2026-09-20",timezone:"Europe/Oslo"}),item("later",{kind:"date_only",date:"2026-10-01",timezone:"Europe/Oslo"}),item("tomorrow",{kind:"date_only",date:"2026-09-25",timezone:"Europe/Oslo"})];
    expect(orderSchoolAssessments(items,"2026-09-24").map(value=>value.id)).toEqual(["tomorrow","later","past","unknown"]);
    expect(items[0].id).toBe("unknown");
  });

  it("uses the assessment timezone for exact times near midnight", () => {
    const items=[item("local-tomorrow",{kind:"exact",dueAt:"2026-09-24T22:30:00.000Z",timezone:"Europe/Oslo"}),item("today",{kind:"date_only",date:"2026-09-24",timezone:"Europe/Oslo"})];
    expect(orderSchoolAssessments(items,"2026-09-24").map(value=>value.id)).toEqual(["today","local-tomorrow"]);
  });
});

describe("partitionSchoolAssessments", () => {
  it("keeps upcoming and unknown-date work visible but tucks away routine evaluations and results", () => {
    const withTitle = (id: string, title: string, date: string | null) => ({ ...item(id, date ? { kind: "date_only" as const, date, timezone: "Europe/Oslo" } : { kind: "unknown" as const }), title });
    const items = [
      withTitle("half-year", "Halvårsvurdering 1", "2027-01-17"),
      withTitle("tomorrow", "Mathematics test", "2026-10-06"),
      withTitle("graded", "Essay", "2026-10-10"),
      withTitle("past", "Earlier test", "2026-09-24"),
      withTitle("unknown", "Announced test", null),
    ];
    const groups = partitionSchoolAssessments(items, "2026-10-05", new Set(["graded"]));
    expect(groups.attention.map(value => value.id)).toEqual(["tomorrow", "unknown"]);
    expect(groups.history.map(value => value.id)).toEqual(["half-year", "graded", "past"]);
  });
});
