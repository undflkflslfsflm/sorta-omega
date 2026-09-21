ALTER TABLE notes ADD COLUMN IF NOT EXISTS yjs_state bytea;
ALTER TABLE note_revisions ADD COLUMN IF NOT EXISTS yjs_state bytea;
ALTER TABLE note_revisions ADD COLUMN IF NOT EXISTS actor_kind text NOT NULL DEFAULT 'capture';

ALTER TABLE note_revisions DROP CONSTRAINT IF EXISTS note_revisions_actor_kind_check;
ALTER TABLE note_revisions ADD CONSTRAINT note_revisions_actor_kind_check CHECK (actor_kind IN ('owner', 'capture', 'restore'));
