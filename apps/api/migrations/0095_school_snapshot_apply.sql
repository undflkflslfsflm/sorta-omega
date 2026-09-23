CREATE TABLE IF NOT EXISTS school_snapshot_links (
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  source_origin text NOT NULL,
  record_kind text NOT NULL CHECK (record_kind IN ('subject','course','lesson')),
  external_id text NOT NULL,
  subject_id uuid REFERENCES school_subjects(id) ON DELETE CASCADE,
  course_id uuid REFERENCES school_courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES school_lessons(id) ON DELETE CASCADE,
  content_hash text NOT NULL CHECK (content_hash ~ '^[0-9a-f]{64}$'),
  source_record jsonb NOT NULL,
  source_timestamp timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (vault_id, source_origin, record_kind, external_id),
  CHECK (
    (record_kind='subject' AND subject_id IS NOT NULL AND course_id IS NULL AND lesson_id IS NULL)
    OR (record_kind='course' AND subject_id IS NULL AND course_id IS NOT NULL AND lesson_id IS NULL)
    OR (record_kind='lesson' AND subject_id IS NULL AND course_id IS NULL AND lesson_id IS NOT NULL)
  )
);
CREATE INDEX IF NOT EXISTS idx_school_snapshot_links_canonical
  ON school_snapshot_links(vault_id, record_kind, subject_id, course_id, lesson_id);

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN (
  'note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation',
  'schedule_preview','proposal_apply','calendar_policy_dry_run','commitment_rematch','calendar_context_refresh',
  'calendar_brief_refresh','calendar_import_preview','export_generate','study_plan_generate','study_exercise_generate',
  'study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh','sync_snapshot','domain_tool_run','source_refresh',
  'transcript_analysis','url_capture','artifact_generate','performance_recommendations','task_breakdown','natural_language_command',
  'connection_probe','profile_rebuild','personal_data_sync','import_plan','import_apply','school_import_preview','school_import_apply','social_time_proposal','note_purge'
));
