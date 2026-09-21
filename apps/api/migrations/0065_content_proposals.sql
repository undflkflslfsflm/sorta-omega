ALTER TABLE labels ADD COLUMN IF NOT EXISTS merged_into_label_id uuid REFERENCES labels(id) ON DELETE RESTRICT;
ALTER TABLE labels ADD COLUMN IF NOT EXISTS archived_at timestamptz;

CREATE TABLE IF NOT EXISTS content_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('merge_notes','split_note','merge_labels','bulk_reassign','idea_promotion')),
  inputs jsonb NOT NULL,
  diff jsonb NOT NULL,
  expected_revisions jsonb NOT NULL,
  affected_record_ids uuid[] NOT NULL,
  required_permissions text[] NOT NULL DEFAULT ARRAY['notes:write']::text[],
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','rejected','withdrawn','superseded','expired')),
  revision integer NOT NULL DEFAULT 1,
  expires_at timestamptz,
  rejection_reason text,
  applied_job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_content_proposals_vault_created ON content_proposals(vault_id,created_at DESC);

CREATE TABLE IF NOT EXISTS content_proposal_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  proposal_id uuid NOT NULL UNIQUE REFERENCES content_proposals(id) ON DELETE RESTRICT,
  job_id uuid NOT NULL UNIQUE REFERENCES jobs(id) ON DELETE RESTRICT,
  result_manifest jsonb NOT NULL,
  undo_manifest jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
