import { readFile, stat } from "node:fs/promises";
import { pool, transaction } from "./db.js";
import { teamsAssignmentSnapshotSchema } from "./teams-assignment-snapshot.js";
import { applyTeamsAssignmentSnapshot } from "./teams-assignment-snapshot-store.js";

// Trusted host-only import, never exposed as an unauthenticated HTTP route.
const args = process.argv.slice(2);
if ((args.length !== 4 && args.length !== 6) || args[0] !== "--vault-id" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(args[1] ?? "") || args[2] !== "--file" || !/^\/tmp\/teams-assignments-[0-9a-f]{32}\.json$/.test(args[3] ?? "") || args.length === 6 && (args[4] !== "--dry-run" || args[5] !== "true")) {
  throw new Error("usage: import-teams-assignments --vault-id <uuid> --file /tmp/teams-assignments-<uuid>.json [--dry-run true]");
}
const vaultId = args[1], file = args[3];
const dryRun = args.length === 6;
const metadata = await stat(file);
if (!metadata.isFile() || metadata.size === 0 || metadata.size > 25 * 1024 * 1024) throw new Error("teams_assignment_snapshot_invalid_size");
const snapshot = teamsAssignmentSnapshotSchema.parse(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(await readFile(file))));
if (Date.parse(snapshot.source_timestamp) > Date.now() + 5 * 60_000) throw new Error("teams_assignment_snapshot_from_future");
try {
  const counts = await transaction(async client => {
    const vault = await client.query("SELECT id FROM vaults WHERE id=$1 FOR SHARE", [vaultId]);
    if (!vault.rows[0]) throw new Error("teams_assignment_vault_not_found");
    if (dryRun) await client.query("SAVEPOINT teams_assignment_dry_run");
    const result = await applyTeamsAssignmentSnapshot(client, vaultId, snapshot);
    if (dryRun) await client.query("ROLLBACK TO SAVEPOINT teams_assignment_dry_run");
    return result;
  });
  console.log(JSON.stringify({ sourceOrigin: snapshot.source_origin, sourceTimestamp: snapshot.source_timestamp, coverage: snapshot.coverage, dryRun, writesApplied: !dryRun, counts }));
} finally { await pool.end(); }
