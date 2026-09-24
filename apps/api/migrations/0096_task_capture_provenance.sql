ALTER TABLE tasks ADD COLUMN IF NOT EXISTS source_note_id uuid REFERENCES notes(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks_source_note_unique ON tasks(vault_id,source_note_id) WHERE source_note_id IS NOT NULL;
