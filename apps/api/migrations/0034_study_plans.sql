ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN ('note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation','schedule_preview','proposal_apply','study_plan_generate'));

CREATE TABLE IF NOT EXISTS study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  course_id uuid REFERENCES school_courses(id) ON DELETE SET NULL,
  assessment_id uuid REFERENCES school_assessments(id) ON DELETE SET NULL,
  generation_job_id uuid UNIQUE REFERENCES jobs(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'generating' CHECK (status IN ('generating','draft','active','completed','generation_failed')),
  goals text[] NOT NULL DEFAULT '{}',
  deadline jsonb NOT NULL DEFAULT '{"kind":"unknown"}'::jsonb,
  material_source_ids uuid[] NOT NULL,
  material_snapshots jsonb NOT NULL,
  task_ids uuid[] NOT NULL DEFAULT '{}',
  schedule_proposal_ids uuid[] NOT NULL DEFAULT '{}',
  constraints jsonb NOT NULL DEFAULT '{}'::jsonb,
  revision integer NOT NULL DEFAULT 1,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_plans_vault_status ON study_plans(vault_id,status,updated_at DESC) WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS study_plan_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
  sequence integer NOT NULL CHECK (sequence >= 0),
  title text NOT NULL,
  objective text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('read','explain','practice','recall','review')),
  material_source_ids uuid[] NOT NULL,
  estimated_minutes integer NOT NULL CHECK (estimated_minutes BETWEEN 5 AND 240),
  estimate_origin text NOT NULL CHECK (estimate_origin IN ('owner','model')),
  task_id uuid UNIQUE REFERENCES tasks(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','in_progress','completed','skipped')),
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(plan_id,sequence)
);

ALTER TABLE study_sessions DROP CONSTRAINT IF EXISTS study_sessions_plan_id_fkey;
ALTER TABLE study_sessions ADD CONSTRAINT study_sessions_plan_id_fkey FOREIGN KEY(plan_id) REFERENCES study_plans(id) ON DELETE SET NULL;
ALTER TABLE study_sessions ADD CONSTRAINT study_sessions_unit_ids_valid CHECK (cardinality(unit_ids) <= 100);
