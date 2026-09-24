CREATE TABLE IF NOT EXISTS note_commitment_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  note_revision integer NOT NULL CHECK (note_revision > 0),
  evidence_quote text NOT NULL,
  person_name text NOT NULL,
  object_label text NOT NULL,
  kind text NOT NULL CHECK (kind = 'return_object'),
  condition_kind text NOT NULL CHECK (condition_kind = 'next_meeting_with_person'),
  source_operation_id uuid REFERENCES ai_operations(id) ON DELETE SET NULL,
  state text NOT NULL DEFAULT 'proposed' CHECK (state IN ('proposed','accepted','dismissed')),
  commitment_id uuid REFERENCES commitments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_note_commitment_candidates_vault_state ON note_commitment_candidates(vault_id,state,created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_note_commitment_candidates_dedupe ON note_commitment_candidates(note_id,note_revision,md5(evidence_quote || chr(31) || person_name || chr(31) || object_label));
CREATE UNIQUE INDEX IF NOT EXISTS idx_note_commitment_candidates_object ON note_commitment_candidates(note_id,note_revision,md5(lower(person_name) || chr(31) || lower(object_label)));

ALTER TABLE commitments ADD COLUMN IF NOT EXISTS source_note_revision integer;
ALTER TABLE commitments ADD COLUMN IF NOT EXISTS source_quote text;
