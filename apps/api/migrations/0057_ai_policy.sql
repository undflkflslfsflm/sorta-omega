CREATE TABLE IF NOT EXISTS vault_ai_policies (
  vault_id uuid PRIMARY KEY REFERENCES vaults(id) ON DELETE CASCADE,
  local_enabled boolean NOT NULL DEFAULT true,
  local_profile_id text NOT NULL DEFAULT 'local-qwen-general',
  cloud_enabled boolean NOT NULL DEFAULT false,
  cloud_connection_id uuid REFERENCES integration_connections(id) ON DELETE SET NULL,
  purposes text[] NOT NULL DEFAULT ARRAY['note_classification','grounded_qa','study_generation']::text[],
  limits jsonb NOT NULL DEFAULT '{"maxSourceBytesPerRequest":200000,"maxRequestsPerDay":500}'::jsonb,
  disclosure jsonb NOT NULL DEFAULT '{"cloudContentEgressEnabled":false,"statement":"Local inference stays on the enrolled worker. Cloud inference is disabled."}'::jsonb,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (NOT cloud_enabled OR cloud_connection_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS ai_disclosure_previews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  provider_connection_id uuid NOT NULL REFERENCES integration_connections(id) ON DELETE CASCADE,
  purpose text NOT NULL,
  scope jsonb NOT NULL,
  limits jsonb NOT NULL,
  boundary jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','consumed','expired')),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 minutes'),
  created_at timestamptz NOT NULL DEFAULT now(),
  consumed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_ai_disclosure_previews_vault
  ON ai_disclosure_previews(vault_id, created_at DESC);
