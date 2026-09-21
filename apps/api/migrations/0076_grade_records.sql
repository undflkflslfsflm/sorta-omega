ALTER TABLE performance_grades
  ADD COLUMN IF NOT EXISTS record_kind text NOT NULL DEFAULT 'manual'
    CHECK (record_kind IN ('official','manual')),
  ADD COLUMN IF NOT EXISTS feedback_source_id uuid REFERENCES sources(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS archive_reason text;

UPDATE performance_grades
SET record_kind = 'official'
WHERE origin = 'provider' AND record_kind = 'manual';

CREATE INDEX IF NOT EXISTS idx_performance_grades_feedback_source
  ON performance_grades(vault_id,feedback_source_id)
  WHERE feedback_source_id IS NOT NULL;
