import { createHash, randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";
import { pool, transaction } from "./db.js";
import { extractDocumentText } from "./document-text.js";
import { blobPath } from "./upload-storage.js";

const args = process.argv.slice(2);
if ((args.length !== 4 && args.length !== 6) || args[0] !== "--vault-id" || !/^[0-9a-f-]{36}$/i.test(args[1] ?? "") || args[2] !== "--directory" || !/^\/tmp\/personal-[0-9a-f]{32}$/.test(args[3] ?? "") || args.length === 6 && (args[4] !== "--dry-run" || args[5] !== "true")) throw new Error("usage: import-personal-files --vault-id <uuid> --directory /tmp/personal-<32hex> [--dry-run true]");
const vaultId = args[1], root = args[3], dryRun = args.length === 6;
const raw = await readFile(path.join(root, "manifest.json"), "utf8");
if (Buffer.byteLength(raw) > 2_000_000) throw new Error("personal_file_manifest_too_large");
const manifest = JSON.parse(raw) as { version?: unknown; deviceKey?: unknown; items?: unknown };
if (manifest.version !== "omega_personal_files_v1" || typeof manifest.deviceKey !== "string" || !/^[a-z0-9-]{3,40}$/.test(manifest.deviceKey) || !Array.isArray(manifest.items) || manifest.items.length > 512) throw new Error("personal_file_manifest_invalid");
type Item = { relativePath: string; stagedName: string; sha256: string; byteLength: number; modifiedAt: string };
const items = manifest.items as Item[];
const seen = new Set<string>();
let totalBytes = 0;
for (const item of items) {
  if (!item || typeof item.relativePath !== "string" || item.relativePath.length > 1000 || !/^[^:\\]+(?:\/[^:\\]+)+$/.test(item.relativePath) || item.relativePath.split("/").some(segment => segment === "." || segment === ".." || !segment) || typeof item.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(item.sha256) || item.stagedName !== item.sha256 || !Number.isSafeInteger(item.byteLength) || item.byteLength < 0 || item.byteLength > 25 * 1024 * 1024 || !Number.isFinite(Date.parse(item.modifiedAt)) || seen.has(item.relativePath)) throw new Error("personal_file_manifest_item_invalid");
  seen.add(item.relativePath);
  totalBytes += item.byteLength;
}
if (totalBytes > 300 * 1024 * 1024) throw new Error("personal_file_batch_too_large");
const vault = await pool.query("SELECT id FROM vaults WHERE id=$1", [vaultId]);
if (!vault.rowCount) throw new Error("personal_file_vault_not_found");
const mediaType = (filename: string) => ({ ".pdf": "application/pdf", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".csv": "text/csv", ".md": "text/markdown", ".txt": "text/plain", ".eml": "message/rfc822", ".html": "text/html", ".htm": "text/html" } as Record<string, string>)[path.extname(filename).toLowerCase()] ?? "application/octet-stream";
const counts = { created: 0, updated: 0, unchanged: 0, originalsStored: 0, textExtracted: 0, textUnavailable: 0 };
try {
for (const item of items) {
  const file = path.join(root, "files", item.stagedName);
  const metadata = await stat(file);
  if (!metadata.isFile() || metadata.size !== item.byteLength) throw new Error("personal_file_staged_size_mismatch");
  const bytes = await readFile(file);
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== item.sha256) throw new Error("personal_file_staged_checksum_mismatch");
  const name = item.relativePath.split("/").at(-1)!;
  const existing = await pool.query("SELECT * FROM personal_file_imports WHERE vault_id=$1 AND device_key=$2 AND path_hash=$3", [vaultId, manifest.deviceKey, createHash("sha256").update(`${manifest.deviceKey}\0${item.relativePath}`).digest("hex")]);
  if (existing.rows[0]?.content_sha256 === hash) { counts.unchanged++; continue; }
  const extracted = await extractDocumentText(bytes, name, mediaType(name));
  if (extracted.text) counts.textExtracted++; else counts.textUnavailable++;
  if (dryRun) { existing.rows[0] ? counts.updated++ : counts.created++; continue; }
  const storage = blobPath(path.resolve(config.BLOB_STORAGE_DIR), hash);
  await mkdir(path.dirname(storage), { recursive: true });
  if (!existsSync(storage)) {
    const temporary = `${storage}.${randomUUID()}.tmp`;
    await writeFile(temporary, bytes, { flag: "wx" });
    await rename(temporary, storage);
  } else if (createHash("sha256").update(await readFile(storage)).digest("hex") !== hash) throw new Error("personal_file_existing_blob_corrupt");
  const body = extracted.text ? `Imported from ${manifest.deviceKey}: ${item.relativePath}\n\n${extracted.text.slice(0, 100_000)}` : `Imported from ${manifest.deviceKey}: ${item.relativePath}\n\nOriginal file preserved. Searchable text unavailable (${extracted.reason ?? "unsupported_format"}).`;
  const pathHash = createHash("sha256").update(`${manifest.deviceKey}\0${item.relativePath}`).digest("hex");
  await transaction(async client => {
    const blob = await client.query("INSERT INTO blobs(vault_id,filename,media_type,byte_length,sha256,storage_key) VALUES ($1,$2,$3,$4,$5,$5) ON CONFLICT(vault_id,sha256) DO UPDATE SET filename=blobs.filename RETURNING id", [vaultId, name, mediaType(name), bytes.length, hash]);
    if (existing.rows[0]) {
      const row = existing.rows[0];
      await client.query("UPDATE sources SET original_text=$2,content_hash=$3 WHERE id=$1 AND vault_id=$4", [row.source_id, extracted.text, hash, vaultId]);
      await client.query("DELETE FROM source_blobs WHERE source_id=$1", [row.source_id]);
      await client.query("INSERT INTO source_blobs(source_id,blob_id,position) VALUES ($1,$2,0)", [row.source_id, blob.rows[0].id]);
      const next = await client.query("UPDATE notes SET title=$3,body=$4,status='ready',revision=revision+1,updated_at=now() WHERE id=$1 AND vault_id=$2 RETURNING revision", [row.note_id, vaultId, name, body]);
      await client.query("INSERT INTO note_revisions(note_id,revision,title,body) VALUES ($1,$2,$3,$4)", [row.note_id, next.rows[0].revision, name, body]);
      await client.query("UPDATE personal_file_imports SET content_sha256=$4,blob_id=$5,imported_at=now() WHERE vault_id=$1 AND device_key=$2 AND path_hash=$3", [vaultId, manifest.deviceKey, pathHash, hash, blob.rows[0].id]);
    } else {
      const source = await client.query("INSERT INTO sources(vault_id,kind,original_text,content_hash) VALUES ($1,'file',$2,$3) RETURNING id", [vaultId, extracted.text, hash]);
      await client.query("INSERT INTO source_blobs(source_id,blob_id,position) VALUES ($1,$2,0)", [source.rows[0].id, blob.rows[0].id]);
      const note = await client.query("INSERT INTO notes(vault_id,source_id,title,body,status) VALUES ($1,$2,$3,$4,'ready') RETURNING id", [vaultId, source.rows[0].id, name, body]);
      await client.query("INSERT INTO note_revisions(note_id,revision,title,body) VALUES ($1,1,$2,$3)", [note.rows[0].id, name, body]);
      await client.query("INSERT INTO personal_file_imports(vault_id,device_key,path_hash,relative_path,content_sha256,source_id,note_id,blob_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [vaultId, manifest.deviceKey, pathHash, item.relativePath, hash, source.rows[0].id, note.rows[0].id, blob.rows[0].id]);
    }
  });
  existing.rows[0] ? counts.updated++ : counts.created++;
  counts.originalsStored++;
}
console.log(JSON.stringify({ deviceKey: manifest.deviceKey, dryRun, totalManifestFiles: items.length, counts }));
} finally { await pool.end(); }
