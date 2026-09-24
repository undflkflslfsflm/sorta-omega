import { describe, expect, it } from "vitest";
import { orderSchoolAssessments } from "./school-assessment-order";

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
