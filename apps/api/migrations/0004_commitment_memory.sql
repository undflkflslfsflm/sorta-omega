CREATE TABLE IF NOT EXISTS calendar_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('person', 'place', 'group', 'object', 'class')),
  name text NOT NULL,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_calendar_entities_vault_kind_name ON calendar_entities(vault_id, kind, lower(name));

CREATE TABLE IF NOT EXISTS event_entity_links (
  event_id uuid NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  entity_id uuid NOT NULL REFERENCES calendar_entities(id) ON DELETE RESTRICT,
  role text NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'location', 'subject')),
  PRIMARY KEY (event_id, entity_id, role)
);

CREATE TABLE IF NOT EXISTS commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  text text NOT NULL,
  person_entity_id uuid NOT NULL REFERENCES calendar_entities(id) ON DELETE RESTRICT,
  object_entity_id uuid REFERENCES calendar_entities(id) ON DELETE RESTRICT,
  object_label text NOT NULL,
  source_note_id uuid REFERENCES notes(id) ON DELETE SET NULL,
  condition_kind text NOT NULL CHECK (condition_kind = 'next_meeting_with_person'),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled', 'superseded')),
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commitments_active_person ON commitments(vault_id, person_entity_id) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS prep_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  commitment_id uuid REFERENCES commitments(id) ON DELETE RESTRICT,
  text text NOT NULL,
  status text NOT NULL DEFAULT 'needed' CHECK (status IN ('needed', 'packed', 'dismissed', 'completed')),
  evidence_note_id uuid REFERENCES notes(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_prep_unique_commitment_binding ON prep_items(event_id, commitment_id) WHERE commitment_id IS NOT NULL;
