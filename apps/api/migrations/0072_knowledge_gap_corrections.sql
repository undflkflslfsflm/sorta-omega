CREATE TABLE IF NOT EXISTS knowledge_gap_corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  knowledge_gap_id uuid NOT NULL REFERENCES knowledge_gaps(id) ON DELETE CASCADE,
  from_revision integer NOT NULL,
  previous_status text NOT NULL,
  previous_correction text,
  next_status text NOT NULL,
  correction_reason text NOT NULL,
  evidence_anchor_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_knowledge_gap_corrections_gap ON knowledge_gap_corrections(knowledge_gap_id,created_at DESC);
