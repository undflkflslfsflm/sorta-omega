import type { PoolClient } from "pg";
import { migrateDocumentToRich } from "./note-document.js";

// Caller must hold a transaction for this entire operation. The row lock serializes
// initialization with both other migrations and normal owner/sync edits.
export async function migrateNoteToRich(client: Pick<PoolClient, "query">, vaultId: string, noteId: string, expectedRevision: number) {
  const current = await client.query<{
    title: string; body: string; revision: number; yjs_state: Buffer | null;
  }>("SELECT title,body,revision,yjs_state FROM notes WHERE vault_id=$1 AND id=$2 AND trashed_at IS NULL FOR UPDATE", [vaultId, noteId]);
  const note = current.rows[0];
  if (!note) throw new Error("note_not_found");
  const changed = migrateDocumentToRich(note.yjs_state, note.body);
  if (!changed.migrated) return { migrated: false, revision: note.revision };
  if (note.revision !== expectedRevision) throw new Error("stale_revision");
  const revision = note.revision + 1;
  await client.query(
    "UPDATE notes SET body=$3,yjs_state=$4,revision=$5,updated_at=now() WHERE vault_id=$1 AND id=$2",
    [vaultId, noteId, changed.text, changed.state, revision]
  );
  await client.query(
    "INSERT INTO note_revisions(note_id,revision,title,body,yjs_state,actor_kind) VALUES ($1,$2,$3,$4,$5,'migration')",
    [noteId, revision, note.title, changed.text, changed.state]
  );
  return { migrated: true, revision };
}
