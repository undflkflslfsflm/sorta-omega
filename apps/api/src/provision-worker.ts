import { createHash, randomBytes, randomUUID } from "node:crypto";
import { pool, transaction } from "./db.js";

const nameIndex = process.argv.indexOf("--name");
const workerName = nameIndex >= 0 ? process.argv[nameIndex + 1]?.trim() : "";
if (!workerName || workerName.length > 120) throw new Error("Use --name with 1 to 120 characters");

const workerId = randomUUID();
const token = randomBytes(32).toString("base64url");
const tokenHash = createHash("sha256").update(token).digest();

await transaction(async (client) => {
  const owner = await client.query<{ id: string }>("SELECT id FROM owners ORDER BY created_at LIMIT 1");
  if (!owner.rows[0]) throw new Error("Initialize the owner account before provisioning a worker");
  const vaults = await client.query<{ id: string }>("SELECT id FROM vaults WHERE owner_id = $1 ORDER BY created_at", [owner.rows[0].id]);
  if (!vaults.rowCount) throw new Error("No owner vault is available");
  await client.query(
    `INSERT INTO workers(id, owner_id, name, role, token_hash, allowed_job_types)
     VALUES ($1, $2, $3, 'model', $4, ARRAY['note_process','ai_setup_test','index_rebuild','hybrid_search','semantic_search','answer_generation','study_plan_generate','study_exercise_generate','study_attempt_feedback','transcript_analysis','artifact_generate','task_breakdown'])`,
    [workerId, owner.rows[0].id, workerName, tokenHash]
  );
  for (const vault of vaults.rows) await client.query("INSERT INTO worker_vault_access(worker_id, vault_id) VALUES ($1, $2)", [workerId, vault.id]);
});

console.log(JSON.stringify({ worker_id: workerId, worker_token_once: token }));
await pool.end();
