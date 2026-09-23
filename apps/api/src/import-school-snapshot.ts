import { readFile, stat } from "node:fs/promises";
import { pool, transaction } from "./db.js";
import { parseInSchoolSnapshot } from "./school-snapshot.js";
import { applyInSchoolSnapshot } from "./school-snapshot-store.js";

// Host-only entry point for the trusted Windows browser bridge. This is not an
// HTTP route and must be invoked inside the app container by its Docker admin.
const args = process.argv.slice(2);
if (args.length !== 4 || args[0] !== "--vault-id" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(args[1] ?? "") || args[2] !== "--file" || !/^\/tmp\/inschool-[0-9a-f]{32}\.json$/.test(args[3] ?? "")) {
  throw new Error("usage: import-school-snapshot --vault-id <uuid> --file /tmp/inschool-<uuid>.json");
}
const vaultId = args[1];
const file = args[3];
const metadata = await stat(file);
if (!metadata.isFile() || metadata.size === 0 || metadata.size > 20 * 1024 * 1024) throw new Error("school_snapshot_invalid_size");
const snapshot = parseInSchoolSnapshot(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(await readFile(file))));
try {
  const counts = await transaction(async client => {
    const vault = await client.query("SELECT id FROM vaults WHERE id=$1 FOR SHARE", [vaultId]);
    if (!vault.rows[0]) throw new Error("school_snapshot_vault_not_found");
    return applyInSchoolSnapshot(client, vaultId, snapshot);
  });
  console.log(JSON.stringify({ sourceOrigin: snapshot.source_origin, sourceTimestamp: snapshot.source_timestamp, counts }));
} finally {
  await pool.end();
}
