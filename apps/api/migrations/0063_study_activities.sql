CREATE TABLE IF NOT EXISTS study_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  session_id uuid REFERENCES study_sessions(id) ON DELETE SET NULL,
  generation_job_id uuid UNIQUE REFERENCES jobs(id) ON DELETE SET NULL,
  mode text NOT NULL CHECK (mode IN ('explain','socratic','active_recall','flashcards','practice','mock_exam','simple','advanced','knowledge_gaps')),
  worker_mode text NOT NULL CHECK (worker_mode IN ('explain','socratic','active_recall','flashcards','practice','mock_exam','explain_12','advanced','knowledge_gaps')),
  difficulty text CHECK (difficulty IN ('introductory','standard','advanced')),
  requested_length integer NOT NULL CHECK (requested_length BETWEEN 1 AND 20),
  language text,
  material_source_ids uuid[] NOT NULL,
  source_snapshots jsonb NOT NULL,
  state text NOT NULL DEFAULT 'generating' CHECK (state IN ('generating','ready','generation_failed')),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_activities_vault
  ON study_activities(vault_id,created_at DESC,id DESC) WHERE archived_at IS NULL;
