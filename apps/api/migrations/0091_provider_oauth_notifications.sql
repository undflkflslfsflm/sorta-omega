CREATE TABLE IF NOT EXISTS oauth_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  connection_id uuid NOT NULL REFERENCES integration_connections(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('microsoft','google_calendar')),
  mode text NOT NULL CHECK (mode IN ('authorize','reauthorize')),
  state_hash text NOT NULL UNIQUE CHECK (state_hash ~ '^[0-9a-f]{64}$'),
  encrypted_pkce_verifier text NOT NULL,
  requested_capabilities text[] NOT NULL,
  registered_return_target text NOT NULL CHECK (registered_return_target IN ('connections','connection_detail')),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_oauth_transactions_connection ON oauth_transactions(connection_id,created_at DESC);

CREATE TABLE IF NOT EXISTS provider_oauth_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid NOT NULL UNIQUE REFERENCES integration_connections(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('microsoft','google_calendar')),
  encrypted_credentials text NOT NULL,
  granted_scope text[] NOT NULL DEFAULT '{}',
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS provider_notification_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid NOT NULL REFERENCES integration_connections(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('microsoft','google_calendar')),
  external_subscription_id text NOT NULL,
  resource_id text,
  proof_hash text NOT NULL CHECK (proof_hash ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz NOT NULL,
  last_message_number bigint,
  disabled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider,external_subscription_id)
);

CREATE TABLE IF NOT EXISTS provider_notification_receipts (
  provider text NOT NULL CHECK (provider IN ('microsoft','google_calendar')),
  subscription_id uuid NOT NULL REFERENCES provider_notification_subscriptions(id) ON DELETE CASCADE,
  message_key text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(provider,subscription_id,message_key)
);
