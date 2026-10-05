import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { pool, transaction } from "./db.js";
import { teamsChannelRevision } from "./teams-channel-revision.js";

const args = process.argv.slice(2);
if ((args.length !== 4 && args.length !== 6) || args[0] !== "--vault-id" || !/^[0-9a-f-]{36}$/i.test(args[1] ?? "") || args[2] !== "--file" || !/^\/tmp\/teams-channels-[0-9a-f]{32}\.json$/.test(args[3] ?? "") || args.length === 6 && (args[4] !== "--dry-run" || args[5] !== "true")) throw new Error("usage: import-teams-channels --vault-id <uuid> --file /tmp/teams-channels-<32hex>.json [--dry-run true]");
const vaultId = args[1], file = args[3], dryRun = args.length === 6;
const metadata = await stat(file);
if (!metadata.isFile() || metadata.size === 0 || metadata.size > 25 * 1024 * 1024) throw new Error("teams_channels_invalid_size");
const parsed: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(await readFile(file)));
if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > 500) throw new Error("teams_channels_invalid_item_count");
type Item = { id: string; title: string; body: string; path: string };
const items = parsed as Item[];
const seen = new Set<string>();
for (const item of items) {
  if (!item || typeof item.id !== "string" || !/^[0-9a-f]{64}$/.test(item.id) || typeof item.title !== "string" || !item.title.startsWith("Teams · ") || item.title.length > 240 || typeof item.body !== "string" || !item.body.startsWith("Source: Teams class channel post\n") || Buffer.byteLength(item.body) > 1_000_000 || typeof item.path !== "string" || item.path !== `teams/channels/${item.id}.json` || seen.has(item.id)) throw new Error("teams_channels_invalid_item");
  seen.add(item.id);
}
const counts = { created: 0, updated: 0, unchanged: 0 };
try {
  await transaction(async client => {
    if (!(await client.query("SELECT id FROM vaults WHERE id=$1", [vaultId])).rows[0]) throw new Error("teams_channels_vault_not_found");
    if (dryRun) await client.query("SAVEPOINT teams_channels_dry_run");
    for (const item of items) {
      const originalText = item.body.split("\n\n").slice(1).join("\n\n");
      const hash = createHash("sha256").update(originalText).digest("hex");
      const existing = (await client.query<{ id: string; source_id: string; original_text: string; body: string }>("SELECT n.id,n.source_id,s.original_text,n.body FROM notes n JOIN sources s ON s.id=n.source_id WHERE n.vault_id=$1 AND n.title=$2 AND s.kind='provider' AND n.trashed_at IS NULL FOR UPDATE", [vaultId, item.title])).rows;
      if (existing.length > 1) throw new Error("teams_channels_duplicate_source_identity");
      if (existing[0]) {
        const revision = teamsChannelRevision(existing[0], { originalText, body: item.body });
        if (!revision.noteChanged) { counts.unchanged++; continue; }
        if (revision.sourceChanged) await client.query("UPDATE sources SET original_text=$2,content_hash=$3 WHERE id=$1", [existing[0].source_id, originalText, hash]);
        const updated = await client.query<{ revision: number }>("UPDATE notes SET body=$2,revision=revision+1,updated_at=now() WHERE id=$1 RETURNING revision", [existing[0].id, item.body]);
        await client.query("INSERT INTO note_revisions(note_id,revision,title,body) VALUES ($1,$2,$3,$4)", [existing[0].id, updated.rows[0].revision, item.title, item.body]);
        counts.updated++;
      } else {
        const source = await client.query<{ id: string }>("INSERT INTO sources(vault_id,kind,original_text,content_hash) VALUES ($1,'provider',$2,$3) RETURNING id", [vaultId, originalText, hash]);
        const note = await client.query<{ id: string }>("INSERT INTO notes(vault_id,source_id,title,body,status) VALUES ($1,$2,$3,$4,'ready') RETURNING id", [vaultId, source.rows[0].id, item.title, item.body]);
        await client.query("INSERT INTO note_revisions(note_id,revision,title,body) VALUES ($1,1,$2,$3)", [note.rows[0].id, item.title, item.body]);
        counts.created++;
      }
    }
    if (dryRun) await client.query("ROLLBACK TO SAVEPOINT teams_channels_dry_run");
  });
  console.log(JSON.stringify({ dryRun, itemCount: items.length, counts }));
} finally { await pool.end(); }
