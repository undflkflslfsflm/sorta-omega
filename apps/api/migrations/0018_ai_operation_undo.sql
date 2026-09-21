ALTER TABLE ai_operations ADD COLUMN IF NOT EXISTS inverse jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE ai_operations ADD COLUMN IF NOT EXISTS undone_at timestamptz;
ALTER TABLE ai_operations ADD COLUMN IF NOT EXISTS effect_organization_revision integer;
ALTER TABLE note_labels ADD COLUMN IF NOT EXISTS source_operation_id uuid REFERENCES ai_operations(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_note_labels_source_operation ON note_labels(source_operation_id) WHERE source_operation_id IS NOT NULL;
