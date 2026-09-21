CREATE TABLE IF NOT EXISTS calendar_entity_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES calendar_entities(id) ON DELETE CASCADE,
  alias text NOT NULL,
  scope text NOT NULL CHECK (scope IN ('all','event_matching','search_only')),
  evidence_note_id uuid REFERENCES notes(id) ON DELETE SET NULL,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_entity_alias_active
  ON calendar_entity_aliases(entity_id, lower(alias)) WHERE archived_at IS NULL;

ALTER TABLE commitments ADD COLUMN IF NOT EXISTS archived_at timestamptz;
ALTER TABLE prep_items ADD COLUMN IF NOT EXISTS invalidated_at timestamptz;
ALTER TABLE prep_items ADD COLUMN IF NOT EXISTS invalidation_reason text
  CHECK (invalidation_reason IS NULL OR invalidation_reason IN ('commitment_changed','commitment_terminal','commitment_archived','entity_alias_removed'));
DROP INDEX IF EXISTS idx_prep_unique_commitment_binding;
CREATE UNIQUE INDEX IF NOT EXISTS idx_prep_unique_commitment_binding
  ON prep_items(event_id, commitment_id) WHERE commitment_id IS NOT NULL AND invalidated_at IS NULL;

CREATE TABLE IF NOT EXISTS commitment_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commitment_id uuid NOT NULL REFERENCES commitments(id) ON DELETE CASCADE,
  from_status text CHECK (from_status IS NULL OR from_status IN ('active','fulfilled','cancelled','superseded')),
  to_status text NOT NULL CHECK (to_status IN ('active','fulfilled','cancelled','superseded')),
  actor text NOT NULL CHECK (actor IN ('owner','system')),
  evidence_kind text NOT NULL CHECK (evidence_kind IN ('creation','owner_confirmed_action','source_note','owner_correction','superseded_by_new_commitment','archive')),
  evidence_note_id uuid REFERENCES notes(id) ON DELETE SET NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO commitment_status_history(commitment_id,from_status,to_status,actor,evidence_kind,created_at)
SELECT id,NULL,status,'owner','creation',created_at FROM commitments
WHERE NOT EXISTS (SELECT 1 FROM commitment_status_history h WHERE h.commitment_id=commitments.id);

CREATE INDEX IF NOT EXISTS idx_commitment_status_history ON commitment_status_history(commitment_id, created_at, id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_commitment_rematch_operation
  ON jobs(vault_id, (input->>'clientOperationId'))
  WHERE kind='commitment_rematch' AND input ? 'clientOperationId';
