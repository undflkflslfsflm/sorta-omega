CREATE TABLE IF NOT EXISTS note_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  blob_id uuid NOT NULL REFERENCES blobs(id) ON DELETE RESTRICT,
  format text NOT NULL CHECK (format IN ('markdown','plain_text','omega_notes_json_v1')),
  options jsonb NOT NULL,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','applying','applied','failed')),
  warnings jsonb NOT NULL DEFAULT '[]'::jsonb,
  counts jsonb NOT NULL,
  plan_revision integer NOT NULL DEFAULT 1 CHECK (plan_revision > 0),
  planning_job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  apply_job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  applied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS note_import_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_id uuid NOT NULL REFERENCES note_imports(id) ON DELETE CASCADE,
  sequence integer NOT NULL CHECK (sequence > 0),
  source_path text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  source_id text,
  content_sha256 text NOT NULL CHECK (content_sha256 ~ '^[0-9a-f]{64}$'),
  planned_action text NOT NULL CHECK (planned_action IN ('create','skip')),
  applied_note_id uuid,
  apply_status text NOT NULL DEFAULT 'pending' CHECK (apply_status IN ('pending','created','skipped','failed')),
  warning text,
  UNIQUE(import_id,sequence)
);

CREATE INDEX IF NOT EXISTS idx_note_imports_vault ON note_imports(vault_id,created_at DESC);

ALTER TABLE note_revisions DROP CONSTRAINT IF EXISTS note_revisions_actor_kind_check;
ALTER TABLE note_revisions ADD CONSTRAINT note_revisions_actor_kind_check CHECK (actor_kind IN ('owner','capture','restore','ai','import'));

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN (
  'note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation',
  'schedule_preview','proposal_apply','calendar_policy_dry_run','commitment_rematch','calendar_context_refresh',
  'calendar_brief_refresh','calendar_import_preview','export_generate','study_plan_generate','study_exercise_generate',
  'study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh','sync_snapshot','domain_tool_run','source_refresh',
  'transcript_analysis','url_capture','artifact_generate','performance_recommendations','task_breakdown','natural_language_command',
  'connection_probe','profile_rebuild','personal_data_sync','import_plan','import_apply'
));
