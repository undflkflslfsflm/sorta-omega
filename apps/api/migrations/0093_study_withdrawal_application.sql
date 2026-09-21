ALTER TABLE study_withdrawal_proposals
  ADD COLUMN IF NOT EXISTS applied_job_id uuid UNIQUE REFERENCES jobs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rejection_reason text;
