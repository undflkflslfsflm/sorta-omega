ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN ('note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation','schedule_preview','proposal_apply','study_plan_generate','study_exercise_generate','study_attempt_feedback'));

UPDATE workers SET allowed_job_types = ARRAY(SELECT DISTINCT unnest(allowed_job_types || ARRAY['study_plan_generate','study_exercise_generate','study_attempt_feedback']::text[]));

CREATE TABLE IF NOT EXISTS study_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  course_id uuid REFERENCES school_courses(id) ON DELETE SET NULL,
  generation_job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  mode text NOT NULL CHECK (mode IN ('explain','socratic','active_recall','flashcards','practice','mock_exam','explain_12','advanced','knowledge_gaps')),
  difficulty text CHECK (difficulty IN ('introductory','standard','advanced')),
  status text NOT NULL DEFAULT 'generating' CHECK (status IN ('generating','ready','generation_failed')),
  prompt text,
  answer text,
  explanation text,
  material_source_ids uuid[] NOT NULL,
  source_snapshots jsonb NOT NULL,
  model_profile_id text,
  prompt_version text,
  owner_correction text,
  revision integer NOT NULL DEFAULT 1,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_study_exercises_vault ON study_exercises(vault_id,created_at DESC) WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS study_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES study_exercises(id) ON DELETE RESTRICT,
  response text NOT NULL,
  response_kind text NOT NULL CHECK (response_kind IN ('text','self_assessment','spoken_transcript')),
  started_at timestamptz,
  completed_at timestamptz NOT NULL,
  hints_used text[] NOT NULL DEFAULT '{}',
  confidence_self_report integer CHECK (confidence_self_report BETWEEN 1 AND 5),
  feedback_status text NOT NULL DEFAULT 'not_requested' CHECK (feedback_status IN ('not_requested','waiting_for_worker','ready','failed')),
  feedback_job_id uuid UNIQUE REFERENCES jobs(id) ON DELETE SET NULL,
  feedback jsonb,
  owner_correction jsonb,
  revision integer NOT NULL DEFAULT 1,
  idempotency_key uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vault_id,idempotency_key)
);
CREATE INDEX IF NOT EXISTS idx_study_attempts_vault ON study_attempts(vault_id,completed_at DESC);
