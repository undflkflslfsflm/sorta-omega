ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN (
  'note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation',
  'schedule_preview','proposal_apply','calendar_policy_dry_run','commitment_rematch','calendar_context_refresh',
  'calendar_brief_refresh','calendar_import_preview','export_generate','study_plan_generate','study_exercise_generate',
  'study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh','sync_snapshot','domain_tool_run','source_refresh',
  'transcript_analysis'
));

UPDATE workers SET allowed_job_types = ARRAY(
  SELECT DISTINCT unnest(allowed_job_types || ARRAY['transcript_analysis']::text[])
);

CREATE TABLE IF NOT EXISTS transcript_lesson_associations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  source_object_id uuid NOT NULL REFERENCES source_objects(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES school_lessons(id) ON DELETE CASCADE,
  transcript_revision integer NOT NULL CHECK (transcript_revision > 0),
  evidence_refs uuid[] NOT NULL DEFAULT '{}',
  origin text NOT NULL DEFAULT 'owner' CHECK (origin='owner'),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_object_id)
);

CREATE TABLE IF NOT EXISTS transcript_analysis_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  source_object_id uuid NOT NULL REFERENCES source_objects(id) ON DELETE CASCADE,
  source_revision integer NOT NULL CHECK (source_revision > 0),
  job_id uuid NOT NULL UNIQUE REFERENCES jobs(id) ON DELETE CASCADE,
  scope text NOT NULL CHECK (scope IN ('concept_summary','instructions','homework','dates','questions','all')),
  content jsonb NOT NULL,
  source_segment_ids text[] NOT NULL,
  model_profile_id text NOT NULL,
  prompt_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
