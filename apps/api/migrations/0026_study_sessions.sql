CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  course_id uuid REFERENCES school_courses(id) ON DELETE SET NULL,
  plan_id uuid,
  unit_ids uuid[] NOT NULL DEFAULT '{}',
  task_ids uuid[] NOT NULL DEFAULT '{}',
  material_source_ids uuid[] NOT NULL DEFAULT '{}',
  calendar_event_id uuid REFERENCES calendar_events(id) ON DELETE SET NULL,
  mode text CHECK (mode IS NULL OR mode IN ('explain','socratic','active_recall','flashcards','practice','mock_exam','explain_12','advanced','knowledge_gaps')),
  state text NOT NULL DEFAULT 'planned' CHECK (state IN ('planned','active','paused','interrupted','completed','skipped')),
  estimated_minutes integer CHECK (estimated_minutes IS NULL OR estimated_minutes > 0),
  active_time_segments jsonb NOT NULL DEFAULT '[]'::jsonb,
  outcome text,
  actual_progress real CHECK (actual_progress IS NULL OR (actual_progress >= 0 AND actual_progress <= 1)),
  source_snapshots jsonb NOT NULL DEFAULT '[]'::jsonb,
  archived_at timestamptz,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_vault_state ON study_sessions(vault_id, state, created_at DESC) WHERE archived_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_study_sessions_active_one ON study_sessions(vault_id) WHERE state = 'active' AND archived_at IS NULL;

CREATE TABLE IF NOT EXISTS study_session_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES study_sessions(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('start','pause','resume','interrupt','complete','skip')),
  observed_at timestamptz NOT NULL,
  resulting_revision integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, action, observed_at)
);
