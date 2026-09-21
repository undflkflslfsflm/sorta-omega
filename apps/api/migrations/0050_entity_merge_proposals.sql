ALTER TABLE calendar_entities ADD COLUMN IF NOT EXISTS merged_into_entity_id uuid REFERENCES calendar_entities(id) ON DELETE RESTRICT;
ALTER TABLE calendar_entities ADD COLUMN IF NOT EXISTS archived_at timestamptz;

CREATE TABLE IF NOT EXISTS entity_merge_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  target_entity_id uuid NOT NULL REFERENCES calendar_entities(id) ON DELETE RESTRICT,
  source_entity_ids uuid[] NOT NULL CHECK (cardinality(source_entity_ids) BETWEEN 1 AND 49),
  reason text NOT NULL,
  entity_revisions jsonb NOT NULL,
  affected_event_ids uuid[] NOT NULL DEFAULT '{}',
  affected_commitment_ids uuid[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','rejected','withdrawn','superseded','expired')),
  rejection_reason text,
  applied_job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (target_entity_id <> ALL(source_entity_ids))
);

CREATE INDEX IF NOT EXISTS idx_entity_merge_proposals_vault_created
  ON entity_merge_proposals(vault_id, created_at DESC, id);
