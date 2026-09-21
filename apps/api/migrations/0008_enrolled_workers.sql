CREATE TABLE IF NOT EXISTS workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('model', 'scheduler', 'connector')),
  token_hash bytea NOT NULL UNIQUE,
  allowed_job_types text[] NOT NULL DEFAULT ARRAY[]::text[],
  paused boolean NOT NULL DEFAULT false,
  resource_policy text NOT NULL DEFAULT 'balanced' CHECK (resource_policy IN ('balanced', 'low_resource', 'gaming')),
  config_revision integer NOT NULL DEFAULT 1,
  installed_profiles jsonb NOT NULL DEFAULT '[]'::jsonb,
  capacity jsonb NOT NULL DEFAULT '{}'::jsonb,
  runtime_status text NOT NULL DEFAULT 'offline' CHECK (runtime_status IN ('offline', 'available', 'busy', 'error')),
  last_seen_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS worker_vault_access (
  worker_id uuid NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  PRIMARY KEY (worker_id, vault_id)
);

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS assigned_worker_id uuid REFERENCES workers(id) ON DELETE SET NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS lease_token_hash bytea;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS lease_expires_at timestamptz;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS last_heartbeat_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_workers_owner_active ON workers(owner_id, created_at) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_worker_lease ON jobs(assigned_worker_id, lease_expires_at) WHERE status = 'running';
