import { describe, expect, it } from "vitest";
import { matchTeamsCourse, teamsAssignmentDue, teamsCourseBaseName } from "./teams-assignment-normalize.js";

describe("Teams assignment normalization", () => {
  it("resolves relative due time in Oslo against the captured timestamp", () => {
    expect(teamsAssignmentDue("Due tomorrow at 11:59 PM • Multiple submissions allowed", "2026-10-04T19:32:26.572Z")).toEqual({ kind: "exact", dueAt: "2026-10-05T21:59:00.000Z", timezone: "Europe/Oslo" });
  });
  it("resolves absolute dates and never invents an unknown due time", () => {
    expect(teamsAssignmentDue("Due October 13, 2026 11:59 PM • Multiple submissions allowed", "2026-10-04T19:32:26.572Z")).toEqual({ kind: "exact", dueAt: "2026-10-13T21:59:00.000Z", timezone: "Europe/Oslo" });
    expect(teamsAssignmentDue("No due date", "2026-10-04T19:32:26.572Z")).toEqual({ kind: "unknown" });
  });
  it("matches existing courses only when unambiguous", () => {
    const courses = [{ id: "economics", name: "Økonomistyring" }, { id: "marketing", name: "Markedsføring og ledelse 1" }, { id: "math", name: "Matematikk 2P" }];
    expect(teamsCourseBaseName("Økonomistyring 2026/27 - VGMAI")).toBe("Økonomistyring");
    expect(matchTeamsCourse("Økonomistyring 2026/27 - VGMAI", courses)).toBe("economics");
    expect(matchTeamsCourse("MALE 1 26/27 - VGMAI", courses)).toBe("marketing");
    expect(matchTeamsCourse("Unknown 26/27 - VGMAI", courses)).toBeNull();
    expect(matchTeamsCourse("MALE 1 26/27 - VGMAI", [...courses, { id: "another", name: "Maleriet og lek 1" }])).toBeNull();
  });
});
