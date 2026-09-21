ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS revision integer NOT NULL DEFAULT 1;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'UTC';
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS recurrence jsonb;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS trashed_at timestamptz;

CREATE TABLE IF NOT EXISTS calendar_event_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  revision integer NOT NULL,
  title text NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  timezone text NOT NULL,
  recurrence jsonb,
  actor_kind text NOT NULL DEFAULT 'owner' CHECK (actor_kind IN ('owner', 'provider', 'system')),
  changed_fields text[] NOT NULL DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, revision)
);

INSERT INTO calendar_event_revisions(event_id, revision, title, starts_at, ends_at, timezone, recurrence, actor_kind, changed_fields, created_at)
SELECT id, revision, title, starts_at, ends_at, timezone, recurrence, 'owner', ARRAY['created'], created_at FROM calendar_events
ON CONFLICT(event_id, revision) DO NOTHING;

CREATE TABLE IF NOT EXISTS calendar_event_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  original_starts_at timestamptz NOT NULL,
  cancelled boolean NOT NULL DEFAULT false,
  title text,
  starts_at timestamptz,
  ends_at timestamptz,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, original_starts_at),
  CHECK ((starts_at IS NULL AND ends_at IS NULL) OR (starts_at IS NOT NULL AND ends_at IS NOT NULL AND ends_at > starts_at))
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_active_range ON calendar_events(vault_id, starts_at, ends_at) WHERE trashed_at IS NULL;
