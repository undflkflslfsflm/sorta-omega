ALTER TABLE sources ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE sources ADD COLUMN IF NOT EXISTS resolved_url text;
ALTER TABLE sources ADD COLUMN IF NOT EXISTS mime_type text;
ALTER TABLE sources ADD COLUMN IF NOT EXISTS http_etag text;
ALTER TABLE sources ADD COLUMN IF NOT EXISTS http_last_modified text;

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN (
  'note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation',
  'schedule_preview','proposal_apply','calendar_policy_dry_run','commitment_rematch','calendar_context_refresh',
  'calendar_brief_refresh','calendar_import_preview','export_generate','study_plan_generate','study_exercise_generate',
  'study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh','sync_snapshot','domain_tool_run','source_refresh',
  'transcript_analysis','url_capture'
));
