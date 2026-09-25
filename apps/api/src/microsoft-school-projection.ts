import { createHash } from "node:crypto";
import type { PoolClient } from "pg";
import type { GraphSource } from "./microsoft-graph.js";

function dueSpec(value: unknown): { kind: "unknown" } | { kind: "exact"; dueAt: string; timezone: "Europe/Oslo" } {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) return { kind: "unknown" };
  return { kind: "exact", dueAt: new Date(value).toISOString(), timezone: "Europe/Oslo" };
}

// Graph source objects remain the originals. These rows only make a class and its
// assignments visible in the school workspace; no school-side write is attempted.
export async function projectMicrosoftSchoolSource(client: PoolClient, vaultId: string, connectionId: string, sourceObjectId: string, source: GraphSource, contentHash: string): Promise<"projected" | "unchanged" | "class_missing" | "not_school"> {
  if (source.kind !== "school_class" && source.kind !== "assignment") return "not_school";
  await client.query("SELECT pg_advisory_xact_lock(hashtext($1),hashtext($2))", [vaultId, "microsoft_school_projection"]);
  const linked = (await client.query("SELECT * FROM school_microsoft_links WHERE source_object_id=$1 AND vault_id=$2 FOR UPDATE", [sourceObjectId, vaultId])).rows[0];

  if (source.kind === "school_class") {
    if (linked) return "unchanged";
    const label = source.title.trim().slice(0, 500);
    if (!label) return "not_school";
    let subjectId = (await client.query("SELECT id FROM school_subjects WHERE vault_id=$1 AND lower(name)=lower($2) AND archived_at IS NULL", [vaultId, label])).rows[0]?.id as string | undefined;
    if (!subjectId) {
      subjectId = (await client.query("INSERT INTO school_subjects(vault_id,name,origin) VALUES ($1,$2,'provider') ON CONFLICT DO NOTHING RETURNING id", [vaultId, label])).rows[0]?.id as string | undefined;
      subjectId ??= (await client.query("SELECT id FROM school_subjects WHERE vault_id=$1 AND lower(name)=lower($2) AND archived_at IS NULL", [vaultId, label])).rows[0]?.id as string | undefined;
    }
    if (!subjectId) throw new Error("microsoft_school_subject_unavailable");
    let courseId = (await client.query("SELECT id FROM school_courses WHERE vault_id=$1 AND subject_id=$2 AND lower(name)=lower($3) AND academic_period IS NULL AND archived_at IS NULL", [vaultId, subjectId, label])).rows[0]?.id as string | undefined;
    if (!courseId) {
      courseId = (await client.query("INSERT INTO school_courses(vault_id,subject_id,name,origin) VALUES ($1,$2,$3,'provider') ON CONFLICT DO NOTHING RETURNING id", [vaultId, subjectId, label])).rows[0]?.id as string | undefined;
      courseId ??= (await client.query("SELECT id FROM school_courses WHERE vault_id=$1 AND subject_id=$2 AND lower(name)=lower($3) AND academic_period IS NULL AND archived_at IS NULL", [vaultId, subjectId, label])).rows[0]?.id as string | undefined;
    }
    if (!courseId) throw new Error("microsoft_school_course_unavailable");
    await client.query("INSERT INTO school_microsoft_links(source_object_id,vault_id,record_kind,subject_id,course_id,content_hash) VALUES ($1,$2,'class',$3,$4,$5)", [sourceObjectId, vaultId, subjectId, courseId, contentHash]);
    return "projected";
  }

  const classId = source.containerId;
  if (!classId) return "class_missing";
  const classLink = (await client.query(`SELECT l.course_id FROM school_microsoft_links l
    JOIN source_objects s ON s.id=l.source_object_id
    JOIN school_courses c ON c.id=l.course_id AND c.archived_at IS NULL
    WHERE l.vault_id=$1 AND s.connection_id=$2 AND s.provider_object_id=$3 AND l.record_kind='class'`, [vaultId, connectionId, `education-class:${classId}`])).rows[0];
  if (!classLink?.course_id) return "class_missing";
  if (linked?.content_hash === contentHash) return "unchanged";
  if (linked) {
    const active = await client.query("SELECT id FROM school_assignments WHERE vault_id=$1 AND id=$2 AND origin='provider' AND archived_at IS NULL", [vaultId, linked.assignment_id]);
    if (!active.rowCount) return "unchanged";
  }

  const sourceTextHash = createHash("sha256").update(source.content).digest("hex");
  const stored = (await client.query("INSERT INTO sources(vault_id,kind,original_text,content_hash) VALUES ($1,'provider',$2,$3) RETURNING id", [vaultId, source.content, sourceTextHash])).rows[0];
  const sourceId = stored.id as string;
  const due = JSON.stringify(dueSpec((source.metadata.detail as Record<string, unknown> | undefined)?.dueDateTime));
  const title = source.title.trim().slice(0, 500) || "Assignment";
  if (linked) {
    const updated = await client.query(`UPDATE school_assignments SET course_id=$3,title=$4,due=$5::jsonb,
      instructions_source_ids=ARRAY[$6]::uuid[],material_source_ids=ARRAY[$6]::uuid[],revision=revision+1,updated_at=now()
      WHERE vault_id=$1 AND id=$2 AND origin='provider' AND archived_at IS NULL`, [vaultId, linked.assignment_id, classLink.course_id, title, due, sourceId]);
    if (!updated.rowCount) return "unchanged";
    await client.query("UPDATE school_microsoft_links SET source_id=$3,content_hash=$4,updated_at=now() WHERE source_object_id=$1 AND vault_id=$2", [sourceObjectId, vaultId, sourceId, contentHash]);
    return "projected";
  }
  const assignment = (await client.query(`INSERT INTO school_assignments(vault_id,course_id,title,due,instructions_source_ids,material_source_ids,origin)
    VALUES ($1,$2,$3,$4::jsonb,ARRAY[$5]::uuid[],ARRAY[$5]::uuid[],'provider') RETURNING id`, [vaultId, classLink.course_id, title, due, sourceId])).rows[0];
  await client.query("INSERT INTO school_microsoft_links(source_object_id,vault_id,record_kind,assignment_id,source_id,content_hash) VALUES ($1,$2,'assignment',$3,$4,$5)", [sourceObjectId, vaultId, assignment.id, sourceId, contentHash]);
  return "projected";
}
