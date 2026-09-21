CREATE TABLE IF NOT EXISTS study_withdrawal_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  study_plan_id uuid NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
  study_plan_revision integer NOT NULL CHECK (study_plan_revision > 0),
  selected_event_ids uuid[] NOT NULL,
  affected_task_ids uuid[] NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','rejected','withdrawn','superseded','expired')),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  expires_at timestamptz NOT NULL DEFAULT (now()+interval '30 minutes'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_withdrawal_plan ON study_withdrawal_proposals(study_plan_id,created_at DESC);
