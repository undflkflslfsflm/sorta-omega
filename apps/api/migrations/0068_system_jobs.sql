CREATE TABLE IF NOT EXISTS system_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('backup_create','backup_verify','restore_plan','restore_apply')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','succeeded','failed','cancelled','superseded')),
  stage text NOT NULL DEFAULT 'queued',
  progress double precision CHECK (progress IS NULL OR (progress >= 0 AND progress <= 1)),
  input jsonb NOT NULL,
  input_hash text NOT NULL CHECK (length(input_hash)=64),
  result jsonb,
  error_code text,
  safe_error_detail text,
  retryable boolean NOT NULL DEFAULT false,
  cancel_requested boolean NOT NULL DEFAULT false,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  max_attempts integer NOT NULL DEFAULT 3 CHECK (max_attempts >= 1),
  retry_of_job_id uuid UNIQUE REFERENCES system_jobs(id) ON DELETE RESTRICT,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS system_jobs_owner_created_idx ON system_jobs(owner_id,created_at DESC,id DESC);

CREATE TABLE IF NOT EXISTS system_job_events (
  job_id uuid NOT NULL REFERENCES system_jobs(id) ON DELETE CASCADE,
  sequence integer NOT NULL CHECK (sequence > 0),
  kind text NOT NULL CHECK (kind IN ('accepted','status','progress','completed','failed','cancelled')),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(job_id,sequence)
);
