ALTER TABLE semantic_chunks ADD COLUMN IF NOT EXISTS generation_id uuid REFERENCES index_generations(id) ON DELETE CASCADE;
ALTER TABLE semantic_chunks DROP CONSTRAINT IF EXISTS semantic_chunks_note_id_note_revision_sequence_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_semantic_chunks_generation_sequence ON semantic_chunks(generation_id, note_id, note_revision, sequence);
CREATE INDEX IF NOT EXISTS idx_semantic_chunks_generation_note ON semantic_chunks(generation_id, note_id, note_revision);
