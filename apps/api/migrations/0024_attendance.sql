CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES school_courses(id) ON DELETE RESTRICT, lesson_id uuid REFERENCES school_lessons(id) ON DELETE SET NULL,
  record_date date NOT NULL, time_spec jsonb NOT NULL DEFAULT '{"kind":"unknown"}'::jsonb,
  raw_status text NOT NULL, normalized_status text NOT NULL CHECK (normalized_status IN ('present','absent','late','unknown')),
  excusal_status text NOT NULL DEFAULT 'unknown' CHECK (excusal_status IN ('excused','unexcused','unknown','not_applicable')),
  duration numeric, units text CHECK (units IS NULL OR units IN ('minutes','lessons','source_defined')),
  source_anchor_ids uuid[] NOT NULL DEFAULT '{}', origin text NOT NULL DEFAULT 'owner' CHECK (origin IN ('owner','provider')),
  archived_at timestamptz, revision integer NOT NULL DEFAULT 1, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (duration IS NULL OR duration >= 0), CHECK ((duration IS NULL) = (units IS NULL))
);
CREATE INDEX IF NOT EXISTS idx_attendance_course_date ON attendance_records(vault_id,course_id,record_date DESC) WHERE archived_at IS NULL;
