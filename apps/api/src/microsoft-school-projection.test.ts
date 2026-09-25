import { describe, expect, it } from "vitest";
import type { PoolClient } from "pg";
import type { GraphSource } from "./microsoft-graph.js";
import { projectMicrosoftSchoolSource } from "./microsoft-school-projection.js";

const digest = (character: string) => character.repeat(64);
const schoolClass: GraphSource = { providerObjectId: "education-class:maths", containerId: null, kind: "school_class", title: "Matematikk 2P", deepLink: null, content: "Matematikk 2P", metadata: { class: { id: "maths" } } };
const assignment: GraphSource = { providerObjectId: "education-assignment:maths:test", containerId: "maths", kind: "assignment", title: "Chapter test", deepLink: null, content: "Chapter test\nPractice percentages", metadata: { detail: { dueDateTime: "2026-09-28T10:00:00Z" } } };

describe("Microsoft school projection", () => {
  it("shows imported classes and assignments once and refreshes due dates without resetting preparation", async () => {
    const links = new Map<string, Record<string, any>>();
    const assignments = new Map<string, Record<string, any>>();
    let sourceCount = 0;
    const client = { query: async (sql: string, values: unknown[] = []) => {
      if (sql.includes("pg_advisory_xact_lock")) return { rows: [] };
      if (sql.startsWith("SELECT * FROM school_microsoft_links")) return { rows: links.has(String(values[0])) ? [links.get(String(values[0]))] : [] };
      if (sql.startsWith("SELECT id FROM school_subjects")) return { rows: links.has("class-source") ? [{ id: "subject-id" }] : [] };
      if (sql.startsWith("INSERT INTO school_subjects")) return { rows: [{ id: "subject-id" }] };
      if (sql.startsWith("SELECT id FROM school_courses")) return { rows: links.has("class-source") ? [{ id: "course-id" }] : [] };
      if (sql.startsWith("INSERT INTO school_courses")) return { rows: [{ id: "course-id" }] };
      if (sql.startsWith("INSERT INTO school_microsoft_links")) {
        if (sql.includes("'class'")) links.set(String(values[0]), { source_object_id: values[0], record_kind: "class", subject_id: values[2], course_id: values[3], content_hash: values[4] });
        else links.set(String(values[0]), { source_object_id: values[0], record_kind: "assignment", assignment_id: values[2], source_id: values[3], content_hash: values[4] });
        return { rows: [] };
      }
      if (sql.startsWith("SELECT l.course_id")) return { rows: links.has("class-source") ? [{ course_id: "course-id" }] : [] };
      if (sql.startsWith("SELECT id FROM school_assignments")) return { rows: [{ id: "assignment-id" }], rowCount: 1 };
      if (sql.startsWith("INSERT INTO sources")) return { rows: [{ id: `source-${++sourceCount}` }] };
      if (sql.startsWith("INSERT INTO school_assignments")) {
        assignments.set("assignment-id", { courseId: values[1], title: values[2], due: JSON.parse(String(values[3])), sourceId: values[4], preparationStatus: "in_progress" });
        return { rows: [{ id: "assignment-id" }] };
      }
      if (sql.startsWith("UPDATE school_assignments")) {
        assignments.set("assignment-id", { ...assignments.get("assignment-id"), courseId: values[2], title: values[3], due: JSON.parse(String(values[4])), sourceId: values[5] });
        return { rowCount: 1, rows: [] };
      }
      if (sql.startsWith("UPDATE school_microsoft_links")) { links.set(String(values[0]), { ...links.get(String(values[0])), source_id: values[2], content_hash: values[3] }); return { rows: [] }; }
      throw new Error(`Unexpected query: ${sql}`);
    } } as unknown as PoolClient;

    expect(await projectMicrosoftSchoolSource(client, "vault", "connection", "class-source", schoolClass, digest("a"))).toBe("projected");
    expect(await projectMicrosoftSchoolSource(client, "vault", "connection", "class-source", schoolClass, digest("a"))).toBe("unchanged");
    expect(await projectMicrosoftSchoolSource(client, "vault", "connection", "assignment-source", assignment, digest("b"))).toBe("projected");
    expect(assignments.get("assignment-id")).toMatchObject({ title: "Chapter test", due: { kind: "exact", dueAt: "2026-09-28T10:00:00.000Z", timezone: "Europe/Oslo" }, preparationStatus: "in_progress" });
    expect(await projectMicrosoftSchoolSource(client, "vault", "connection", "assignment-source", assignment, digest("b"))).toBe("unchanged");
    expect(sourceCount).toBe(1);
    const revised = { ...assignment, metadata: { detail: { dueDateTime: "2026-09-29T12:00:00Z" } } };
    expect(await projectMicrosoftSchoolSource(client, "vault", "connection", "assignment-source", revised, digest("c"))).toBe("projected");
    expect(assignments.get("assignment-id")).toMatchObject({ due: { dueAt: "2026-09-29T12:00:00.000Z" }, preparationStatus: "in_progress" });
    expect(sourceCount).toBe(2);
  });

  it("does not invent a course when the matching class was not imported", async () => {
    const calls: string[] = [];
    const client = { query: async (sql: string) => {
      calls.push(sql);
      if (sql.includes("pg_advisory_xact_lock")) return { rows: [] };
      if (sql.startsWith("SELECT * FROM school_microsoft_links") || sql.startsWith("SELECT l.course_id")) return { rows: [] };
      throw new Error(`Unexpected write: ${sql}`);
    } } as unknown as PoolClient;
    expect(await projectMicrosoftSchoolSource(client, "vault", "connection", "assignment-source", assignment, digest("a"))).toBe("class_missing");
    expect(calls).toHaveLength(3);
  });
});
