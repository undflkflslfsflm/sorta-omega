ALTER TABLE job_evidence
  ADD COLUMN IF NOT EXISTS assessment_id uuid REFERENCES school_assessments(id) ON DELETE RESTRICT;

ALTER TABLE job_evidence ALTER COLUMN chunk_id DROP NOT NULL;
ALTER TABLE job_evidence ALTER COLUMN note_id DROP NOT NULL;
ALTER TABLE job_evidence ALTER COLUMN source_id DROP NOT NULL;

ALTER TABLE job_evidence
  ADD CONSTRAINT job_evidence_exactly_one_record CHECK (
    (assessment_id IS NULL AND chunk_id IS NOT NULL AND note_id IS NOT NULL AND source_id IS NOT NULL)
    OR
    (assessment_id IS NOT NULL AND chunk_id IS NULL AND note_id IS NULL AND source_id IS NULL)
  );

CREATE UNIQUE INDEX IF NOT EXISTS idx_job_evidence_assessment
  ON job_evidence(job_id, assessment_id) WHERE assessment_id IS NOT NULL;

ALTER TABLE chats ALTER COLUMN default_scope SET DEFAULT '{"kinds":["note","school_assessment"]}'::jsonb;
UPDATE chats SET default_scope = '{"kinds":["note","school_assessment"]}'::jsonb
  WHERE default_mode = 'notes' AND default_scope = '{"kinds":["note"]}'::jsonb;
