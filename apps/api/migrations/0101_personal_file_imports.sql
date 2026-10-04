CREATE TABLE IF NOT EXISTS personal_file_imports (
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  device_key text NOT NULL,
  path_hash text NOT NULL CHECK (path_hash ~ '^[0-9a-f]{64}$'),
  relative_path text NOT NULL,
  content_sha256 text NOT NULL CHECK (content_sha256 ~ '^[0-9a-f]{64}$'),
  source_id uuid NOT NULL REFERENCES sources(id) ON DELETE RESTRICT,
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE RESTRICT,
  blob_id uuid NOT NULL REFERENCES blobs(id) ON DELETE RESTRICT,
  imported_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (vault_id, device_key, path_hash),
  UNIQUE (source_id),
  UNIQUE (note_id)
);
