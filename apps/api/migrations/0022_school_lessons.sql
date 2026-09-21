CREATE TABLE IF NOT EXISTS school_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES school_courses(id) ON DELETE RESTRICT,
  calendar_event_id uuid REFERENCES calendar_events(id) ON DELETE SET NULL,
  time_spec jsonb NOT NULL DEFAULT '{"kind":"unknown"}'::jsonb,
  room text,
  source_anchor_ids uuid[] NOT NULL DEFAULT '{}',
  origin text NOT NULL DEFAULT 'owner' CHECK (origin IN ('owner','provider')),
  archived_at timestamptz,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_school_lessons_course ON school_lessons(vault_id, course_id, archived_at, updated_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_school_lesson_event_active ON school_lessons(vault_id, calendar_event_id) WHERE calendar_event_id IS NOT NULL AND archived_at IS NULL;
