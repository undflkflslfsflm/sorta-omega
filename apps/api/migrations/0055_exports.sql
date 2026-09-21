ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN ('note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation','schedule_preview','proposal_apply','calendar_policy_dry_run','commitment_rematch','calendar_context_refresh','calendar_brief_refresh','export_generate','study_plan_generate','study_exercise_generate','study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh','sync_snapshot'));

CREATE TABLE IF NOT EXISTS exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('vault','calendar')),
  status text NOT NULL DEFAULT 'generating' CHECK (status IN ('generating','ready','failed')),
  format text NOT NULL CHECK (format IN ('markdown_bundle','full_fidelity','ics')),
  privacy text NOT NULL CHECK (privacy IN ('authorized_full','minimal')),
  scope jsonb NOT NULL,
  source_manifest jsonb NOT NULL DEFAULT '[]'::jsonb,
  blob_id uuid REFERENCES blobs(id) ON DELETE RESTRICT,
  byte_length bigint CHECK (byte_length IS NULL OR byte_length >= 0),
  sha256 text CHECK (sha256 IS NULL OR sha256 ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz NOT NULL,
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((status='ready')=(blob_id IS NOT NULL AND byte_length IS NOT NULL AND sha256 IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_exports_vault_created ON exports(vault_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exports_expiry ON exports(expires_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_export_operation
  ON jobs(vault_id,(input->>'idempotencyKey'))
  WHERE kind='export_generate' AND input->>'source'='calendar' AND input ? 'idempotencyKey';
