ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN ('note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation','schedule_preview','proposal_apply','calendar_policy_dry_run','commitment_rematch','calendar_context_refresh','study_plan_generate','study_exercise_generate','study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh','sync_snapshot'));

CREATE TABLE IF NOT EXISTS event_reminder_plans (
  event_id uuid PRIMARY KEY REFERENCES calendar_events(id) ON DELETE CASCADE,
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  occurrence_scope text NOT NULL CHECK (occurrence_scope IN ('series','occurrence')),
  occurrence_id text,
  schedules jsonb NOT NULL,
  channels text[] NOT NULL,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((occurrence_scope='series' AND occurrence_id IS NULL) OR (occurrence_scope='occurrence' AND occurrence_id IS NOT NULL)),
  CHECK (channels <@ ARRAY['in_app','windows_native']::text[] AND cardinality(channels) BETWEEN 1 AND 2)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_context_refresh_operation
  ON jobs(vault_id,(input->>'idempotencyKey'))
  WHERE kind='calendar_context_refresh' AND input ? 'idempotencyKey';

DROP TRIGGER IF EXISTS sync_change_event_reminder_plans ON event_reminder_plans;
CREATE TRIGGER sync_change_event_reminder_plans AFTER INSERT OR UPDATE OR DELETE ON event_reminder_plans
  FOR EACH ROW EXECUTE FUNCTION emit_vault_change_event('event_reminder_plan','event_id');
