CREATE TABLE IF NOT EXISTS blobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  filename text NOT NULL,
  media_type text NOT NULL,
  byte_length bigint NOT NULL CHECK (byte_length BETWEEN 0 AND 2147483648),
  sha256 text NOT NULL CHECK (sha256 ~ '^[0-9a-f]{64}$'),
  storage_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vault_id, sha256)
);

CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  filename text NOT NULL,
  media_type text NOT NULL,
  byte_length bigint NOT NULL CHECK (byte_length BETWEEN 0 AND 2147483648),
  sha256 text NOT NULL CHECK (sha256 ~ '^[0-9a-f]{64}$'),
  part_size integer NOT NULL CHECK (part_size BETWEEN 1048576 AND 8388608),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','finalizing','completed','cancelled')),
  expires_at timestamptz NOT NULL,
  completed_blob_id uuid REFERENCES blobs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS upload_parts (
  upload_id uuid NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
  part_number integer NOT NULL CHECK (part_number BETWEEN 1 AND 512),
  start_offset bigint NOT NULL CHECK (start_offset >= 0),
  end_offset bigint NOT NULL CHECK (end_offset >= start_offset),
  byte_length integer NOT NULL CHECK (byte_length BETWEEN 1 AND 4194304),
  sha256 text NOT NULL CHECK (sha256 ~ '^[0-9a-f]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(upload_id, part_number)
);

CREATE INDEX IF NOT EXISTS idx_uploads_expiry ON uploads(expires_at) WHERE status IN ('open','finalizing');
CREATE INDEX IF NOT EXISTS idx_blobs_vault_created ON blobs(vault_id, created_at DESC);

CREATE TABLE IF NOT EXISTS source_blobs (
  source_id uuid NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  blob_id uuid NOT NULL REFERENCES blobs(id) ON DELETE RESTRICT,
  position integer NOT NULL CHECK (position BETWEEN 0 AND 99),
  PRIMARY KEY(source_id, blob_id),
  UNIQUE(source_id, position)
);

ALTER TABLE client_operations ADD COLUMN IF NOT EXISTS payload_hash text;
ALTER TABLE client_operations ADD CONSTRAINT client_operations_payload_hash_format
  CHECK (payload_hash IS NULL OR payload_hash ~ '^[0-9a-f]{64}$') NOT VALID;
