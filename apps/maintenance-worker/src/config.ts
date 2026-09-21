import "dotenv/config";
import { z } from "zod";

const schema=z.object({
  DATABASE_URL:z.string().min(1),
  BACKUP_ENCRYPTION_KEY_HEX:z.string().regex(/^[0-9a-fA-F]{64}$/),
  OMEGA_WORKSPACE_ROOT:z.string().min(1),
  SYSTEM_JOB_POLL_MS:z.coerce.number().int().min(500).max(60_000).default(2_000)
});

export const maintenanceConfig=schema.parse(process.env);
