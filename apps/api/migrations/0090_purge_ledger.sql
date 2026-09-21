CREATE TABLE IF NOT EXISTS deletion_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  target_kind text NOT NULL CHECK (target_kind IN ('note','vault')),
  target_id_hash text NOT NULL CHECK (target_id_hash ~ '^[0-9a-f]{64}$'),
  reason text NOT NULL DEFAULT 'owner_confirmed_permanent_purge',
  deleted_derived_records integer NOT NULL DEFAULT 0 CHECK (deleted_derived_records >= 0),
  revoked_jobs integer NOT NULL DEFAULT 0 CHECK (revoked_jobs >= 0),
  completed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_deletion_ledger_owner_completed ON deletion_ledger(owner_id,completed_at DESC);

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN (
  'note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation',
  'schedule_preview','proposal_apply','calendar_policy_dry_run','commitment_rematch','calendar_context_refresh',
  'calendar_brief_refresh','calendar_import_preview','export_generate','study_plan_generate','study_exercise_generate',
  'study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh','sync_snapshot','domain_tool_run','source_refresh',
  'transcript_analysis','url_capture','artifact_generate','performance_recommendations','task_breakdown','natural_language_command',
  'connection_probe','profile_rebuild','personal_data_sync','import_plan','import_apply','school_import_preview','social_time_proposal','note_purge'
));

ALTER TABLE system_jobs DROP CONSTRAINT IF EXISTS system_jobs_kind_check;
ALTER TABLE system_jobs ADD CONSTRAINT system_jobs_kind_check CHECK (kind IN (
  'backup_create','backup_verify','restore_plan','restore_apply','deployment_check','access_setup_preview','vault_purge'
));
