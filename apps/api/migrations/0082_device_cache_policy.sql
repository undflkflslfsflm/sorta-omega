CREATE TABLE IF NOT EXISTS device_cache_policies (
  device_id uuid PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
  trusted boolean NOT NULL DEFAULT false,
  selected_vault_ids uuid[] NOT NULL DEFAULT '{}',
  cache_limits jsonb NOT NULL,
  expire_after_seconds integer CHECK (expire_after_seconds IS NULL OR expire_after_seconds BETWEEN 3600 AND 31536000),
  clear_on_logout boolean NOT NULL DEFAULT true,
  reported_state jsonb NOT NULL DEFAULT '{"status":"unknown","cachedVaultIds":[],"byteCount":null,"itemCount":null,"reportedAt":null}'::jsonb,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS device_cache_purge_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  selected_vault_ids uuid[] NOT NULL,
  request_reason text NOT NULL CHECK (char_length(request_reason) BETWEEN 1 AND 500),
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','acknowledged')),
  acknowledged_at timestamptz,
  requested_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_device_cache_purge_pending ON device_cache_purge_requests(device_id,requested_at) WHERE status='requested';
