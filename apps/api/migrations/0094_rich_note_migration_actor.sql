ALTER TABLE note_revisions DROP CONSTRAINT IF EXISTS note_revisions_actor_kind_check;
ALTER TABLE note_revisions ADD CONSTRAINT note_revisions_actor_kind_check
  CHECK (actor_kind IN ('owner','capture','restore','ai','import','migration'));
