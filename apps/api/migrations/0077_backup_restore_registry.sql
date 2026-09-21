CREATE TABLE IF NOT EXISTS backup_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL UNIQUE,
  storage_root text NOT NULL,
  encryption_profile_id text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS backups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  destination_id uuid NOT NULL REFERENCES backup_destinations(id) ON DELETE RESTRICT,
  encryption_profile_id text NOT NULL,
  state text NOT NULL DEFAULT 'queued' CHECK (state IN ('queued','creating','ready','verification_failed','failed')),
  manifest jsonb,
  manifest_sha256 text CHECK (manifest_sha256 IS NULL OR manifest_sha256 ~ '^[0-9a-f]{64}$'),
  bundle_path text,
  bundle_sha256 text CHECK (bundle_sha256 IS NULL OR bundle_sha256 ~ '^[0-9a-f]{64}$'),
  byte_length bigint CHECK (byte_length IS NULL OR byte_length >= 0),
  verified_at timestamptz,
  retention_until timestamptz,
  system_job_id uuid UNIQUE REFERENCES system_jobs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_backups_owner_created ON backups(owner_id,created_at DESC,id DESC);

CREATE TABLE IF NOT EXISTS restore_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  backup_id uuid NOT NULL REFERENCES backups(id) ON DELETE RESTRICT,
  target_mode text NOT NULL CHECK (target_mode IN ('isolated_validation','replace_installation')),
  state text NOT NULL DEFAULT 'planning' CHECK (state IN ('planning','ready','incompatible','applying','applied','failed')),
  compatibility jsonb,
  plan_revision integer NOT NULL DEFAULT 1,
  planning_job_id uuid UNIQUE REFERENCES system_jobs(id) ON DELETE SET NULL,
  applied_job_id uuid UNIQUE REFERENCES system_jobs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_restore_plans_owner_created ON restore_plans(owner_id,created_at DESC,id DESC);

CREATE TABLE IF NOT EXISTS backup_download_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_id uuid NOT NULL REFERENCES backups(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  bundle_sha256 text NOT NULL CHECK (bundle_sha256 ~ '^[0-9a-f]{64}$'),
  downloaded_at timestamptz NOT NULL DEFAULT now()
);
