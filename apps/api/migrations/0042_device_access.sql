CREATE TABLE IF NOT EXISTS device_pairings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_name text NOT NULL CHECK (char_length(device_name) BETWEEN 1 AND 120),
  requested_role text NOT NULL CHECK (requested_role IN ('client', 'worker')),
  client_public_key text,
  device_code_hash bytea NOT NULL UNIQUE,
  user_code_hash bytea NOT NULL UNIQUE,
  owner_id uuid REFERENCES owners(id) ON DELETE CASCADE,
  approved_role text CHECK (approved_role IN ('client', 'worker')),
  approved_vault_ids uuid[] NOT NULL DEFAULT ARRAY[]::uuid[],
  approved_scopes text[] NOT NULL DEFAULT ARRAY[]::text[],
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'exchanged', 'denied', 'expired')),
  expires_at timestamptz NOT NULL,
  approved_at timestamptz,
  exchanged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  role text NOT NULL CHECK (role IN ('client', 'worker')),
  vault_ids uuid[] NOT NULL DEFAULT ARRAY[]::uuid[],
  scopes text[] NOT NULL DEFAULT ARRAY[]::text[],
  public_key text,
  last_seen_at timestamptz,
  compromised_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS device_access_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  token_hash bytea NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS device_refresh_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  family_id uuid NOT NULL,
  token_hash bytea NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  rotated_to_id uuid REFERENCES device_refresh_tokens(id) ON DELETE SET NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  label text NOT NULL CHECK (char_length(label) BETWEEN 1 AND 120),
  token_hash bytea NOT NULL UNIQUE,
  vault_ids uuid[] NOT NULL DEFAULT ARRAY[]::uuid[],
  scopes text[] NOT NULL DEFAULT ARRAY[]::text[],
  expires_at timestamptz NOT NULL,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_device_pairings_pending ON device_pairings(expires_at) WHERE status IN ('pending', 'approved');
CREATE INDEX IF NOT EXISTS idx_devices_owner_active ON devices(owner_id, created_at) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_device_access_active ON device_access_tokens(device_id, expires_at) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_device_refresh_family ON device_refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_api_tokens_owner_active ON api_tokens(owner_id, created_at) WHERE revoked_at IS NULL;
