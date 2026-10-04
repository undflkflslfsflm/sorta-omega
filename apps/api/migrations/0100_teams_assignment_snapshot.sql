ALTER TABLE school_snapshot_links
  ADD COLUMN IF NOT EXISTS assignment_id uuid REFERENCES school_assignments(id) ON DELETE CASCADE;

ALTER TABLE school_snapshot_links DROP CONSTRAINT IF EXISTS school_snapshot_links_record_kind_check;
ALTER TABLE school_snapshot_links ADD CONSTRAINT school_snapshot_links_record_kind_check
  CHECK (record_kind IN ('subject','course','lesson','attendance','grade','assignment'));

ALTER TABLE school_snapshot_links DROP CONSTRAINT IF EXISTS school_snapshot_links_check;
ALTER TABLE school_snapshot_links ADD CONSTRAINT school_snapshot_links_check CHECK (
  (record_kind='subject' AND subject_id IS NOT NULL AND course_id IS NULL AND lesson_id IS NULL AND attendance_id IS NULL AND grade_id IS NULL AND assignment_id IS NULL)
  OR (record_kind='course' AND subject_id IS NULL AND course_id IS NOT NULL AND lesson_id IS NULL AND attendance_id IS NULL AND grade_id IS NULL AND assignment_id IS NULL)
  OR (record_kind='lesson' AND subject_id IS NULL AND course_id IS NULL AND lesson_id IS NOT NULL AND attendance_id IS NULL AND grade_id IS NULL AND assignment_id IS NULL)
  OR (record_kind='attendance' AND subject_id IS NULL AND course_id IS NULL AND lesson_id IS NULL AND attendance_id IS NOT NULL AND grade_id IS NULL AND assignment_id IS NULL)
  OR (record_kind='grade' AND subject_id IS NULL AND course_id IS NULL AND lesson_id IS NULL AND attendance_id IS NULL AND grade_id IS NOT NULL AND assignment_id IS NULL)
  OR (record_kind='assignment' AND subject_id IS NULL AND course_id IS NULL AND lesson_id IS NULL AND attendance_id IS NULL AND grade_id IS NULL AND assignment_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_school_snapshot_links_assignment
  ON school_snapshot_links(vault_id,assignment_id) WHERE assignment_id IS NOT NULL;
