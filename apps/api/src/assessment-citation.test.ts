import { describe, expect, it } from "vitest";
import { chatScopeSchema, citationSchema, resolvedCitationSchema } from "@sorta/contracts";

const id = "11111111-1111-4111-8111-111111111111";

describe("school assessment answer citations", () => {
  it("accepts a revision-anchored assessment citation without pretending it is a note", () => {
    const citation = citationSchema.parse({ citationId: "job.c001", kind: "school_assessment", assessmentId: id,
      revision: 2, title: "Matematikk 2P · Skriftlig prøve", quote: "Date: 2026-09-24\nDetails: Chapter 1" });
    expect(citation.kind).toBe("school_assessment");
    expect(resolvedCitationSchema.parse({ kind: "school_assessment", assessmentId: id, citedRevision: 2,
      currentRevision: 2, title: citation.title, exactExcerpt: citation.quote,
      currentAssessmentLink: { assessmentId: id, title: citation.title, path: "/school" }, historical: false })).toHaveProperty("historical", false);
  });

  it("keeps historical note citations readable and requires explicit assessment scope", () => {
    expect(citationSchema.parse({ citationId: "job.c002", chunkId: id, noteId: id, sourceId: id,
      revision: 1, title: "Note", startOffset: 0, endOffset: 4, quote: "Fact" })).toHaveProperty("noteId", id);
    expect(chatScopeSchema.parse({}).kinds).toEqual(["note", "school_assessment"]);
    expect(chatScopeSchema.parse({ kinds: ["note"] }).kinds).toEqual(["note"]);
  });
});
