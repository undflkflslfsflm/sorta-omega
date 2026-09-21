CREATE TABLE IF NOT EXISTS execution_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,
  study_session_id uuid REFERENCES study_sessions(id) ON DELETE SET NULL,
  planned_minutes integer CHECK (planned_minutes IS NULL OR planned_minutes > 0),
  mode text NOT NULL CHECK (mode IN ('focus','study','practice','project','admin','other')),
  state text NOT NULL CHECK (state IN ('active','paused','finished','abandoned')),
  active_time_segments jsonb NOT NULL DEFAULT '[]'::jsonb,
  actual_minutes_correction integer CHECK (actual_minutes_correction IS NULL OR actual_minutes_correction >= 0),
  completed_work jsonb,
  remaining_work jsonb,
  reference_source_ids uuid[] NOT NULL DEFAULT '{}',
  client_operation_id text NOT NULL,
  payload_hash text NOT NULL,
  revision integer NOT NULL DEFAULT 1,
  started_at timestamptz NOT NULL,
  finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vault_id,client_operation_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_execution_sessions_one_active ON execution_sessions(vault_id) WHERE state='active';
CREATE INDEX IF NOT EXISTS idx_execution_sessions_task ON execution_sessions(vault_id,task_id,started_at DESC);

CREATE TABLE IF NOT EXISTS execution_session_transitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  execution_session_id uuid NOT NULL REFERENCES execution_sessions(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('pause','resume','finish','abandon')),
  observed_at timestamptz NOT NULL,
  resulting_revision integer NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(execution_session_id,action,observed_at)
);
