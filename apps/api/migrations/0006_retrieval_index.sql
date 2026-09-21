CREATE TABLE IF NOT EXISTS index_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  model_profile_id text NOT NULL,
  model_digest text,
  embedding_dimension integer NOT NULL CHECK (embedding_dimension = 1024),
  chunker_version text NOT NULL,
  status text NOT NULL CHECK (status IN ('building', 'validated', 'active', 'failed', 'superseded')),
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  validated_at timestamptz,
  activated_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_index_generation ON index_generations(vault_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_index_generations_vault_created ON index_generations(vault_id, created_at DESC);

CREATE TABLE IF NOT EXISTS semantic_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  note_revision integer NOT NULL,
  sequence integer NOT NULL CHECK (sequence >= 0),
  text text NOT NULL,
  start_offset integer NOT NULL CHECK (start_offset >= 0),
  end_offset integer NOT NULL CHECK (end_offset >= start_offset),
  content_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(note_id, note_revision, sequence)
);

CREATE INDEX IF NOT EXISTS idx_semantic_chunks_revision ON semantic_chunks(vault_id, note_id, note_revision);

CREATE TABLE IF NOT EXISTS chunk_embeddings (
  generation_id uuid NOT NULL REFERENCES index_generations(id) ON DELETE CASCADE,
  chunk_id uuid NOT NULL REFERENCES semantic_chunks(id) ON DELETE CASCADE,
  embedding vector(1024) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (generation_id, chunk_id)
);

CREATE INDEX IF NOT EXISTS idx_chunk_embeddings_hnsw ON chunk_embeddings USING hnsw (embedding vector_cosine_ops);
