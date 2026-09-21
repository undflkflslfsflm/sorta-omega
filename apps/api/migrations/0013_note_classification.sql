ALTER TABLE notes ADD COLUMN IF NOT EXISTS classification text CHECK (classification IN ('note', 'task', 'event', 'idea', 'reference', 'unknown'));
ALTER TABLE notes ADD COLUMN IF NOT EXISTS classification_locked boolean NOT NULL DEFAULT false;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS suggested_title text;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS classified_revision integer;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS organization_revision integer NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS note_corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  source_note_revision integer NOT NULL,
  previous_classification text,
  corrected_classification text NOT NULL CHECK (corrected_classification IN ('note', 'task', 'event', 'idea', 'reference', 'unknown')),
  reason text,
  locked boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('classification')),
  source_revision integer NOT NULL,
  model_profile_id text NOT NULL,
  model_digest text,
  prompt_version text NOT NULL,
  result jsonb NOT NULL,
  applied boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_id, kind)
);

CREATE INDEX IF NOT EXISTS idx_note_corrections_note_created ON note_corrections(note_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_operations_vault_note ON ai_operations(vault_id, note_id, created_at DESC);
