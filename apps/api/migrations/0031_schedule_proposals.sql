ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN ('note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation','schedule_preview'));

CREATE TABLE IF NOT EXISTS schedule_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  job_id uuid NOT NULL UNIQUE REFERENCES jobs(id) ON DELETE CASCADE, kind text NOT NULL CHECK (kind IN ('preview','replan')),
  horizon_start timestamptz NOT NULL, horizon_end timestamptz NOT NULL, constraints_revision integer NOT NULL,
  input_revisions jsonb NOT NULL, calendar_digest text NOT NULL, placements jsonb NOT NULL, unscheduled jsonb NOT NULL, unknown_availability jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','withdrawn','superseded')),
  created_at timestamptz NOT NULL DEFAULT now(), CHECK (horizon_end > horizon_start)
);
CREATE INDEX IF NOT EXISTS idx_schedule_proposals_vault_created ON schedule_proposals(vault_id,created_at DESC);
