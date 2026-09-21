CREATE TABLE IF NOT EXISTS school_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES school_courses(id) ON DELETE RESTRICT, title text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('exam','test','quiz','presentation','project','other')),
  time_spec jsonb NOT NULL DEFAULT '{"kind":"unknown"}'::jsonb, material_scope jsonb,
  official_weight real CHECK (official_weight IS NULL OR (official_weight >= 0 AND official_weight <= 1)),
  source_anchor_ids uuid[] NOT NULL DEFAULT '{}', origin text NOT NULL DEFAULT 'owner' CHECK (origin IN ('owner','provider')),
  archived_at timestamptz, revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_school_assessments_course ON school_assessments(vault_id,course_id,archived_at,updated_at DESC);
