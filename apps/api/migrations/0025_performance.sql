CREATE TABLE IF NOT EXISTS performance_grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES school_courses(id) ON DELETE RESTRICT, assessment_id uuid REFERENCES school_assessments(id) ON DELETE SET NULL,
  grade_value text NOT NULL, grade_scale text NOT NULL, grade_date date NOT NULL,
  official_weight real CHECK (official_weight IS NULL OR (official_weight >= 0 AND official_weight <= 1)), source_anchor_ids uuid[] NOT NULL DEFAULT '{}',
  origin text NOT NULL DEFAULT 'owner' CHECK (origin IN ('owner','provider')), archived_at timestamptz,
  revision integer NOT NULL DEFAULT 1, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_performance_grades_course ON performance_grades(vault_id,course_id,grade_date DESC) WHERE archived_at IS NULL;
CREATE TABLE IF NOT EXISTS performance_targets (
  course_id uuid PRIMARY KEY REFERENCES school_courses(id) ON DELETE CASCADE, vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  target_value text NOT NULL, scale text NOT NULL, effective_period text, revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
