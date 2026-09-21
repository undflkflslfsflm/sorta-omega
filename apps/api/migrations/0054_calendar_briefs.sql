ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN ('note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation','schedule_preview','proposal_apply','calendar_policy_dry_run','commitment_rematch','calendar_context_refresh','calendar_brief_refresh','study_plan_generate','study_exercise_generate','study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh','sync_snapshot'));

CREATE TABLE IF NOT EXISTS calendar_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  brief_date date NOT NULL,
  timezone text NOT NULL,
  items jsonb NOT NULL,
  source_manifest jsonb NOT NULL,
  deterministic_summary text[] NOT NULL,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vault_id,brief_date,timezone)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_brief_refresh_operation
  ON jobs(vault_id,(input->>'idempotencyKey'))
  WHERE kind='calendar_brief_refresh' AND input ? 'idempotencyKey';
