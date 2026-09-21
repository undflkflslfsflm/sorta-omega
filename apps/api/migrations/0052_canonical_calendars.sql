CREATE TABLE IF NOT EXISTS calendars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 160),
  timezone text NOT NULL,
  origin text NOT NULL DEFAULT 'sorta' CHECK (origin IN ('sorta','microsoft','google_calendar','visma_inschool')),
  ownership text NOT NULL DEFAULT 'owner' CHECK (ownership IN ('owner','provider')),
  can_read boolean NOT NULL DEFAULT true,
  can_write boolean NOT NULL DEFAULT true,
  selected_visible boolean NOT NULL DEFAULT true,
  display_preferences jsonb NOT NULL DEFAULT '{"color":"#6366f1","showWeekends":true}'::jsonb,
  connection_id uuid REFERENCES integration_connections(id) ON DELETE SET NULL,
  provider_calendar_id text,
  freshness_state text NOT NULL DEFAULT 'current' CHECK (freshness_state IN ('current','stale','not_configured')),
  last_synced_at timestamptz,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((origin = 'sorta' AND ownership = 'owner' AND connection_id IS NULL AND provider_calendar_id IS NULL)
    OR (origin <> 'sorta' AND ownership = 'provider' AND connection_id IS NOT NULL AND provider_calendar_id IS NOT NULL)),
  CHECK (origin = 'sorta' OR can_write = false),
  UNIQUE (connection_id, provider_calendar_id)
);

CREATE INDEX IF NOT EXISTS idx_calendars_vault_active
  ON calendars(vault_id, selected_visible DESC, created_at, id)
  WHERE archived_at IS NULL;

INSERT INTO calendars(vault_id,name,timezone,origin,ownership,can_read,can_write,selected_visible,display_preferences)
SELECT v.id,'Personal',v.timezone,'sorta','owner',true,true,true,'{"color":"#6366f1","showWeekends":true}'::jsonb
FROM vaults v
WHERE NOT EXISTS (SELECT 1 FROM calendars c WHERE c.vault_id=v.id AND c.origin='sorta');

ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS calendar_id uuid REFERENCES calendars(id) ON DELETE RESTRICT;

UPDATE calendar_events e
SET calendar_id=(SELECT c.id FROM calendars c WHERE c.vault_id=e.vault_id AND c.origin='sorta' ORDER BY c.created_at,c.id LIMIT 1)
WHERE e.calendar_id IS NULL;

ALTER TABLE calendar_events ALTER COLUMN calendar_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_calendar_events_calendar_range
  ON calendar_events(calendar_id,starts_at,ends_at)
  WHERE trashed_at IS NULL;

CREATE TABLE IF NOT EXISTS calendar_archive_tombstones (
  calendar_id uuid PRIMARY KEY REFERENCES calendars(id) ON DELETE CASCADE,
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  archived_revision integer NOT NULL CHECK (archived_revision > 1),
  archived_at timestamptz NOT NULL,
  undoable boolean NOT NULL DEFAULT true,
  external_delete_requested boolean NOT NULL DEFAULT false,
  CHECK (external_delete_requested = false)
);

DROP TRIGGER IF EXISTS sync_change_calendars ON calendars;
CREATE TRIGGER sync_change_calendars AFTER INSERT OR UPDATE OR DELETE ON calendars
  FOR EACH ROW EXECUTE FUNCTION emit_vault_change_event('calendar','id');
