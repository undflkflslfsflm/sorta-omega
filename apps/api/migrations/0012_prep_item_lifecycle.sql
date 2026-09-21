ALTER TABLE prep_items ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'custom' CHECK (type IN ('bring', 'review', 'checklist', 'custom'));
ALTER TABLE prep_items ADD COLUMN IF NOT EXISTS occurrence_id text;
ALTER TABLE prep_items ADD COLUMN IF NOT EXISTS provenance jsonb NOT NULL DEFAULT '{"origin":"system"}'::jsonb;
ALTER TABLE prep_items ADD COLUMN IF NOT EXISTS revision integer NOT NULL DEFAULT 1;

UPDATE prep_items SET type = 'bring' WHERE commitment_id IS NOT NULL AND type = 'custom';

CREATE TABLE IF NOT EXISTS prep_item_suppressions (
  event_id uuid NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  fingerprint text NOT NULL,
  commitment_id uuid REFERENCES commitments(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (reason IN ('dismissed', 'removed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(event_id, fingerprint)
);
