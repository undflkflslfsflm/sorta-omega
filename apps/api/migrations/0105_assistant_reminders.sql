ALTER TABLE reminders ADD COLUMN IF NOT EXISTS calendar_event_id uuid REFERENCES calendar_events(id) ON DELETE SET NULL;
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS title text;
CREATE INDEX IF NOT EXISTS idx_reminders_calendar_event ON reminders(calendar_event_id) WHERE calendar_event_id IS NOT NULL;
