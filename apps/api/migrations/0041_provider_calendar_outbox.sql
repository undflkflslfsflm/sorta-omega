ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN ('note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation','schedule_preview','proposal_apply','study_plan_generate','study_exercise_generate','study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh'));

CREATE TABLE IF NOT EXISTS provider_calendar_action_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES calendar_events(id) ON DELETE RESTRICT,
  connection_id uuid NOT NULL REFERENCES integration_connections(id) ON DELETE RESTRICT,
  action_kind text NOT NULL CHECK (action_kind IN ('create','update','delete','respond')),
  target_calendar_id text NOT NULL,
  recipients jsonb NOT NULL DEFAULT '[]'::jsonb,
  public_fields jsonb NOT NULL,
  response text,
  event_revision integer NOT NULL,
  connection_revision integer NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','rejected','expired')),
  revision integer NOT NULL DEFAULT 1,
  expires_at timestamptz NOT NULL DEFAULT now()+interval '24 hours',
  rejection_reason text,
  applied_job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_provider_action_proposals_vault ON provider_calendar_action_proposals(vault_id,created_at DESC);

CREATE TABLE IF NOT EXISTS provider_calendar_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  proposal_id uuid NOT NULL UNIQUE REFERENCES provider_calendar_action_proposals(id) ON DELETE RESTRICT,
  event_id uuid NOT NULL REFERENCES calendar_events(id) ON DELETE RESTRICT,
  connection_id uuid NOT NULL REFERENCES integration_connections(id) ON DELETE RESTRICT,
  action_kind text NOT NULL CHECK (action_kind IN ('create','update','delete','respond')),
  target_calendar_id text NOT NULL,
  recipients jsonb NOT NULL DEFAULT '[]'::jsonb,
  public_fields jsonb NOT NULL,
  response text,
  state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','in_flight','delivery_unknown','acknowledged','rejected','cancelled')),
  idempotency_key text NOT NULL,
  provider_operation_id text,
  acknowledgement jsonb,
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count>=0),
  reconciliation_required boolean NOT NULL DEFAULT false,
  sends_disabled_after_restore boolean NOT NULL DEFAULT false,
  last_error_code text,
  revision integer NOT NULL DEFAULT 1,
  sent_at timestamptz,
  acknowledged_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(connection_id,idempotency_key)
);
CREATE INDEX IF NOT EXISTS idx_provider_calendar_actions_vault_state ON provider_calendar_actions(vault_id,state,created_at DESC);
