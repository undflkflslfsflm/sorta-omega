CREATE TABLE IF NOT EXISTS school_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES school_courses(id) ON DELETE RESTRICT,
  title text NOT NULL,
  instructions_source_ids uuid[] NOT NULL DEFAULT '{}',
  due jsonb NOT NULL DEFAULT '{"kind":"unknown"}'::jsonb,
  material_source_ids uuid[] NOT NULL DEFAULT '{}',
  task_ids uuid[] NOT NULL DEFAULT '{}',
  preparation_status text NOT NULL DEFAULT 'not_started' CHECK (preparation_status IN ('not_started','in_progress','prepared')),
  origin text NOT NULL DEFAULT 'owner' CHECK (origin IN ('owner','provider')),
  archived_at timestamptz,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_school_assignments_course ON school_assignments(vault_id, course_id, archived_at, updated_at DESC);
