CREATE TABLE IF NOT EXISTS school_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES school_subjects(id) ON DELETE RESTRICT,
  name text NOT NULL,
  academic_period text,
  teacher_entity_ids uuid[] NOT NULL DEFAULT '{}',
  class_entity_ids uuid[] NOT NULL DEFAULT '{}',
  source_anchor_ids uuid[] NOT NULL DEFAULT '{}',
  origin text NOT NULL DEFAULT 'owner' CHECK (origin IN ('owner', 'provider')),
  archived_at timestamptz,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_school_courses_active_name ON school_courses(vault_id, subject_id, lower(name), coalesce(academic_period, '')) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_school_courses_vault_subject ON school_courses(vault_id, subject_id, archived_at, updated_at DESC);
