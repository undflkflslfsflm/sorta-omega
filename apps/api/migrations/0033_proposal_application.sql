ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN ('note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation','schedule_preview','proposal_apply'));
ALTER TABLE schedule_proposals ADD COLUMN IF NOT EXISTS applied_job_id uuid REFERENCES jobs(id) ON DELETE SET NULL;
ALTER TABLE schedule_proposals ADD COLUMN IF NOT EXISTS created_event_ids uuid[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS proposal_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  proposal_id uuid NOT NULL UNIQUE REFERENCES schedule_proposals(id) ON DELETE RESTRICT,
  job_id uuid NOT NULL UNIQUE REFERENCES jobs(id) ON DELETE RESTRICT,
  created_event_ids uuid[] NOT NULL, undo_manifest jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), undone_at timestamptz
);

CREATE TABLE IF NOT EXISTS scheduled_task_event_links (
  proposal_id uuid NOT NULL REFERENCES schedule_proposals(id) ON DELETE RESTRICT,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,
  event_id uuid NOT NULL UNIQUE REFERENCES calendar_events(id) ON DELETE RESTRICT,
  PRIMARY KEY(proposal_id,event_id)
);
