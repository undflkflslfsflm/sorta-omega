import { idSchema } from "@sorta/contracts";
import { pool, transaction } from "./db.js";
import { migrateNoteToRich } from "./rich-note-migration.js";

// Explicit, one-note rollout only until browser binding and live acceptance pass.
try {
  const [vault, note, revisionText, ...extra] = process.argv.slice(2);
  const revision = Number(revisionText);
  if (extra.length || !Number.isSafeInteger(revision) || revision < 1) {
    throw new Error("Usage: notes:migrate-rich <vault-id> <note-id> <expected-revision>");
  }
  const vaultId = idSchema.parse(vault), noteId = idSchema.parse(note);
  const result = await transaction(client => migrateNoteToRich(client, vaultId, noteId, revision));
  console.log(JSON.stringify({ noteId, ...result }));
} finally {
  await pool.end();
}
