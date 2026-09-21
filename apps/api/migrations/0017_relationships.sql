CREATE TABLE IF NOT EXISTS note_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  from_note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  to_note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('related', 'supports', 'contradicts', 'duplicate_candidate')),
  evidence_anchor_ids uuid[] NOT NULL DEFAULT ARRAY[]::uuid[],
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('suggested', 'confirmed', 'dismissed')),
  authored_by text NOT NULL DEFAULT 'owner' CHECK (authored_by IN ('owner', 'system')),
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (from_note_id <> to_note_id),
  UNIQUE(vault_id, from_note_id, to_note_id, kind)
);

CREATE INDEX IF NOT EXISTS idx_note_relationships_from ON note_relationships(vault_id, from_note_id, kind);
CREATE INDEX IF NOT EXISTS idx_note_relationships_to ON note_relationships(vault_id, to_note_id, kind);
