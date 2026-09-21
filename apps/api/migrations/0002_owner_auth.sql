CREATE TABLE IF NOT EXISTS owners (
  id uuid PRIMARY KEY,
  label text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE vaults ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES owners(id) ON DELETE RESTRICT;

CREATE TABLE IF NOT EXISTS passkeys (
  id text PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  public_key bytea NOT NULL,
  counter bigint NOT NULL DEFAULT 0,
  device_type text NOT NULL,
  backed_up boolean NOT NULL,
  transports jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz
);

CREATE TABLE IF NOT EXISTS auth_challenges (
  id uuid PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('bootstrap', 'login', 'register_passkey')),
  challenge text NOT NULL,
  pending_owner_id uuid,
  owner_label text,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_challenges_active ON auth_challenges(kind, expires_at) WHERE consumed_at IS NULL;

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  token_hash bytea NOT NULL UNIQUE,
  auth_level text NOT NULL CHECK (auth_level IN ('passkey', 'recovery')),
  expires_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token_active ON sessions(token_hash, expires_at) WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS recovery_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  code_hash bytea NOT NULL UNIQUE,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
