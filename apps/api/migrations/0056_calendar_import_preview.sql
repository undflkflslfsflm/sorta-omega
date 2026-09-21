ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN ('note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation','schedule_preview','proposal_apply','calendar_policy_dry_run','commitment_rematch','calendar_context_refresh','calendar_brief_refresh','calendar_import_preview','export_generate','study_plan_generate','study_exercise_generate','study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh','sync_snapshot'));

CREATE TABLE IF NOT EXISTS calendar_import_previews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  attachment_blob_id uuid NOT NULL REFERENCES blobs(id) ON DELETE RESTRICT,
  target_calendar_id uuid NOT NULL REFERENCES calendars(id) ON DELETE RESTRICT,
  timezone text NOT NULL,
  source_sha256 text NOT NULL CHECK (source_sha256 ~ '^[0-9a-f]{64}$'),
  items jsonb NOT NULL,
  warnings jsonb NOT NULL,
  counts jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','applied','rejected')),
  invitations_sent boolean NOT NULL DEFAULT false CHECK (invitations_sent=false),
  writes_applied boolean NOT NULL DEFAULT false CHECK (writes_applied=false),
  revision integer NOT NULL DEFAULT 1 CHECK (revision>0),
  expires_at timestamptz NOT NULL DEFAULT now()+interval '7 days',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vault_id,attachment_blob_id,target_calendar_id,timezone,source_sha256)
);

CREATE INDEX IF NOT EXISTS idx_calendar_import_previews_vault ON calendar_import_previews(vault_id,created_at DESC);
