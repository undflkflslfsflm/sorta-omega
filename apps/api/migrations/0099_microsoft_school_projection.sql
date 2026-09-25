CREATE TABLE IF NOT EXISTS school_microsoft_links (
  source_object_id uuid PRIMARY KEY REFERENCES source_objects(id) ON DELETE CASCADE,
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  record_kind text NOT NULL CHECK (record_kind IN ('class','assignment')),
  subject_id uuid REFERENCES school_subjects(id) ON DELETE RESTRICT,
  course_id uuid REFERENCES school_courses(id) ON DELETE RESTRICT,
  assignment_id uuid REFERENCES school_assignments(id) ON DELETE RESTRICT,
  source_id uuid REFERENCES sources(id) ON DELETE RESTRICT,
  content_hash text NOT NULL CHECK (content_hash ~ '^[0-9a-f]{64}$'),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (record_kind='class' AND subject_id IS NOT NULL AND course_id IS NOT NULL AND assignment_id IS NULL AND source_id IS NULL)
    OR (record_kind='assignment' AND subject_id IS NULL AND course_id IS NULL AND assignment_id IS NOT NULL AND source_id IS NOT NULL)
  )
);
CREATE INDEX IF NOT EXISTS idx_school_microsoft_links_class ON school_microsoft_links(vault_id,course_id) WHERE record_kind='class';
CREATE UNIQUE INDEX IF NOT EXISTS uq_school_microsoft_links_assignment ON school_microsoft_links(assignment_id) WHERE record_kind='assignment';
