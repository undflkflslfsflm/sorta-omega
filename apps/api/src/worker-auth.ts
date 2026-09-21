import { timingSafeEqual } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import { query } from "./db.js";
import { hashWorkerSecret } from "./worker-secrets.js";

export { hashWorkerSecret, leaseSecretMatches } from "./worker-secrets.js";

export type WorkerIdentity = {
  id: string;
  owner_id: string;
  role: "model" | "scheduler" | "connector";
  allowed_job_types: string[];
  paused: boolean;
  config_revision: number;
};

function bearerToken(request: FastifyRequest) {
  const value = request.headers.authorization;
  if (!value?.startsWith("Bearer ")) return null;
  const token = value.slice(7);
  return token.length >= 32 && token.length <= 256 ? token : null;
}

export async function getWorkerIdentity(request: FastifyRequest): Promise<WorkerIdentity | null> {
  const token = bearerToken(request);
  if (!token) return null;
  const tokenHash = hashWorkerSecret(token);
  const result = await query<WorkerIdentity & { token_hash: Buffer }>(
    `SELECT id, owner_id, role, allowed_job_types, paused, config_revision, token_hash
     FROM workers WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash]
  );
  const worker = result.rows[0];
  if (!worker || worker.token_hash.length !== tokenHash.length || !timingSafeEqual(worker.token_hash, tokenHash)) return null;
  return worker;
}

export async function requireWorker(request: FastifyRequest, reply: FastifyReply) {
  const worker = await getWorkerIdentity(request);
  if (!worker) {
    await reply.code(401).send({ error: "worker_authentication_required" });
    return null;
  }
  if (worker.paused) {
    await reply.code(423).send({ error: "worker_paused" });
    return null;
  }
  return worker;
}
