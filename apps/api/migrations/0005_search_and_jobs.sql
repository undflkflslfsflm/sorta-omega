ALTER TABLE notes ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(body, ''))) STORED;

CREATE INDEX IF NOT EXISTS idx_notes_search_vector ON notes USING gin(search_vector);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('note_process', 'hybrid_search', 'semantic_search', 'ai_setup_test', 'index_rebuild')),
  status text NOT NULL CHECK (status IN ('queued', 'waiting_for_worker', 'running', 'succeeded', 'failed', 'cancelled', 'superseded')),
  stage text NOT NULL DEFAULT 'accepted',
  progress real CHECK (progress IS NULL OR (progress >= 0 AND progress <= 1)),
  input jsonb NOT NULL,
  input_hash text NOT NULL,
  result jsonb,
  error_code text,
  safe_error_detail text,
  retryable boolean NOT NULL DEFAULT false,
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 3,
  cancel_requested boolean NOT NULL DEFAULT false,
  retried_from_job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  finished_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_jobs_vault_status_created ON jobs(vault_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_claimable ON jobs(status, created_at) WHERE status IN ('queued', 'waiting_for_worker');

CREATE TABLE IF NOT EXISTS job_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  sequence integer NOT NULL,
  kind text NOT NULL CHECK (kind IN ('accepted', 'status', 'progress', 'completed', 'failed', 'cancelled')),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_id, sequence)
);

CREATE INDEX IF NOT EXISTS idx_job_events_replay ON job_events(job_id, sequence);
