CREATE TABLE IF NOT EXISTS school_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  academic_period text,
  source_anchor_ids uuid[] NOT NULL DEFAULT '{}',
  origin text NOT NULL DEFAULT 'owner' CHECK (origin IN ('owner', 'provider')),
  archived_at timestamptz,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_school_subjects_active_name ON school_subjects(vault_id, lower(name)) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_school_subjects_vault_active ON school_subjects(vault_id, archived_at, updated_at DESC);
