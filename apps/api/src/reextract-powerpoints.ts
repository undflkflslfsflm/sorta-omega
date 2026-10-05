import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";
import { pool, transaction } from "./db.js";
import { extractDocumentText } from "./document-text.js";
import { blobPath } from "./upload-storage.js";

const args = process.argv.slice(2);
if ((args.length !== 2 && args.length !== 4) || args[0] !== "--vault-id" || !/^[0-9a-f-]{36}$/i.test(args[1] ?? "") || (args.length === 4 && (args[2] !== "--dry-run" || args[3] !== "true"))) {
  throw new Error("usage: reextract-powerpoints --vault-id <uuid> [--dry-run true]");
}
const vaultId = args[1];
const dryRun = args.length === 4;
const counts = { candidates: 0, extracted: 0, noEmbeddedText: 0, noteUpdated: 0, notePreserved: 0, failed: 0 };

try {
  const result = await pool.query(`SELECT p.source_id,p.note_id,p.device_key,p.relative_path,b.filename,b.media_type,b.sha256,b.storage_key
    FROM personal_file_imports p JOIN blobs b ON b.id=p.blob_id JOIN sources s ON s.id=p.source_id
    WHERE p.vault_id=$1 AND lower(b.filename) LIKE '%.pptx' AND s.original_text IS NULL
    ORDER BY p.imported_at,p.source_id LIMIT 512`, [vaultId]);
  counts.candidates = result.rowCount ?? 0;
  for (const row of result.rows) {
    try {
      const bytes = await readFile(blobPath(path.resolve(config.BLOB_STORAGE_DIR), row.storage_key));
      if (createHash("sha256").update(bytes).digest("hex") !== row.sha256) throw new Error("stored_original_checksum_mismatch");
      const extracted = await extractDocumentText(bytes, row.filename, row.media_type);
      if (!extracted.text) { counts.noEmbeddedText++; continue; }
      counts.extracted++;
      if (dryRun) continue;
      const body = `Imported from ${row.device_key}: ${row.relative_path}\n\n${extracted.text.slice(0, 100_000)}`;
      const originalPrefix = `Imported from ${row.device_key}: ${row.relative_path}\n\nOriginal file preserved. Searchable text unavailable (`;
      const outcome = await transaction(async client => {
        const source = (await client.query("SELECT original_text FROM sources WHERE id=$1 AND vault_id=$2 FOR UPDATE", [row.source_id, vaultId])).rows[0];
        if (!source || source.original_text !== null) return "skipped";
        const note = (await client.query("SELECT body,revision FROM notes WHERE id=$1 AND vault_id=$2 FOR UPDATE", [row.note_id, vaultId])).rows[0];
        await client.query("UPDATE sources SET original_text=$3 WHERE id=$1 AND vault_id=$2", [row.source_id, vaultId, extracted.text]);
        if (!note || !note.body.startsWith(originalPrefix) || !note.body.endsWith(").")) return "preserved";
        const updated = await client.query("UPDATE notes SET body=$3,revision=revision+1,updated_at=now() WHERE id=$1 AND vault_id=$2 RETURNING revision,title", [row.note_id, vaultId, body]);
        await client.query("INSERT INTO note_revisions(note_id,revision,title,body) VALUES ($1,$2,$3,$4)", [row.note_id, updated.rows[0].revision, updated.rows[0].title, body]);
        return "updated";
      });
      if (outcome === "updated") counts.noteUpdated++;
      else counts.notePreserved++;
    } catch { counts.failed++; }
  }
  console.log(JSON.stringify({ dryRun, counts }));
  if (counts.failed) process.exitCode = 1;
} finally { await pool.end(); }
