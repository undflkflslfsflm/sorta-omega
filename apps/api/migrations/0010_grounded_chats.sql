ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN ('note_process', 'hybrid_search', 'semantic_search', 'ai_setup_test', 'index_rebuild', 'answer_generation'));

CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  title text,
  default_mode text NOT NULL DEFAULT 'notes' CHECK (default_mode IN ('notes', 'tutor', 'calendar', 'profile', 'brainstorm')),
  default_scope jsonb NOT NULL DEFAULT '{"kinds":["note"]}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chats_vault_updated ON chats(vault_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  client_message_id text,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  text text NOT NULL DEFAULT '',
  answer_mode text NOT NULL CHECK (answer_mode IN ('grounded', 'brainstorm')),
  status text NOT NULL CHECK (status IN ('persisted', 'waiting_for_worker', 'running', 'succeeded', 'failed', 'cancelled')),
  answer_to_id uuid REFERENCES chat_messages(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  source_manifest jsonb NOT NULL DEFAULT '[]'::jsonb,
  citations jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(chat_id, client_message_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_created ON chat_messages(chat_id, created_at, id);

CREATE TABLE IF NOT EXISTS job_evidence (
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  citation_id text NOT NULL,
  chunk_id uuid NOT NULL REFERENCES semantic_chunks(id) ON DELETE RESTRICT,
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE RESTRICT,
  source_id uuid NOT NULL REFERENCES sources(id) ON DELETE RESTRICT,
  note_revision integer NOT NULL,
  title text NOT NULL,
  text text NOT NULL,
  start_offset integer NOT NULL CHECK (start_offset >= 0),
  end_offset integer NOT NULL CHECK (end_offset > start_offset),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(job_id, citation_id),
  UNIQUE(job_id, chunk_id)
);
