ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN (
  'note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation',
  'schedule_preview','proposal_apply','calendar_policy_dry_run','commitment_rematch','calendar_context_refresh',
  'calendar_brief_refresh','calendar_import_preview','export_generate','study_plan_generate','study_exercise_generate',
  'study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh','sync_snapshot','domain_tool_run','source_refresh',
  'transcript_analysis','url_capture','artifact_generate'
));

ALTER TABLE note_revisions DROP CONSTRAINT IF EXISTS note_revisions_actor_kind_check;
ALTER TABLE note_revisions ADD CONSTRAINT note_revisions_actor_kind_check CHECK (actor_kind IN ('owner','capture','restore','ai'));

CREATE TABLE IF NOT EXISTS generated_notes (
  note_id uuid PRIMARY KEY REFERENCES notes(id) ON DELETE CASCADE,
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('summary','project_brief','comparison','outline','study_questions','checklist','catch_up','lesson_summary')),
  ai_block_key text NOT NULL DEFAULT 'main',
  source_manifest jsonb NOT NULL,
  latest_job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  model_profile_id text NOT NULL,
  prompt_version text NOT NULL,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

UPDATE workers SET allowed_job_types=ARRAY(SELECT DISTINCT unnest(allowed_job_types||ARRAY['artifact_generate']::text[])) WHERE role='model';
