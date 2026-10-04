import { readFile, stat } from "node:fs/promises";
import { pool, transaction } from "./db.js";
import { inSchoolSnapshotSchema } from "./school-snapshot.js";
import { applyInSchoolSnapshot } from "./school-snapshot-store.js";

// Host-only entry point for the trusted Windows browser bridge. This is not an
// HTTP route and must be invoked inside the app container by its Docker admin.
const args = process.argv.slice(2);
if (![4, 6].includes(args.length) || args[0] !== "--vault-id" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(args[1] ?? "") || args[2] !== "--file" || !/^\/tmp\/inschool-[0-9a-f]{32}\.json$/.test(args[3] ?? "") || (args.length === 6 && (args[4] !== "--dry-run" || args[5] !== "true"))) {
  throw new Error("usage: import-school-snapshot --vault-id <uuid> --file /tmp/inschool-<uuid>.json [--dry-run true]");
}
const vaultId = args[1];
const file = args[3];
const dryRun = args.length === 6;
const metadata = await stat(file);
if (!metadata.isFile() || metadata.size === 0 || metadata.size > 20 * 1024 * 1024) throw new Error("school_snapshot_invalid_size");
const validation = inSchoolSnapshotSchema.safeParse(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(await readFile(file))));
if (!validation.success) {
  const issues = validation.error.issues.slice(0, 10).map(issue => ({ path: issue.path, code: issue.code }));
  throw new Error(`school_snapshot_invalid:${JSON.stringify(issues)}`);
}
const snapshot = validation.data;
try {
  const counts = await transaction(async client => {
    const vault = await client.query("SELECT id FROM vaults WHERE id=$1 FOR SHARE", [vaultId]);
    if (!vault.rows[0]) throw new Error("school_snapshot_vault_not_found");
    if (dryRun) await client.query("SAVEPOINT school_snapshot_dry_run");
    const applied = await applyInSchoolSnapshot(client, vaultId, snapshot);
    if (dryRun) await client.query("ROLLBACK TO SAVEPOINT school_snapshot_dry_run");
    return applied;
  });
  console.log(JSON.stringify({ sourceOrigin: snapshot.source_origin, sourceTimestamp: snapshot.source_timestamp, dryRun, counts }));
} finally {
  await pool.end();
}
