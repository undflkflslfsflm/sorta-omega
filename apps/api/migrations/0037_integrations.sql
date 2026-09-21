CREATE TABLE IF NOT EXISTS integration_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('microsoft','google_calendar','visma_inschool','youtube','spotify','tiktok','instagram','reddit','discord','maxun','firecrawl','anakin_oss','meetily')),
  label text NOT NULL, state text NOT NULL CHECK (state IN ('disconnected','authentication_required','admin_approval_required','needs_provider_configuration','connected','rate_limited','syncing','degraded','error','unsupported','import_only')),
  capabilities jsonb NOT NULL DEFAULT '[]'::jsonb, credential_reference text,
  last_success_at timestamptz, last_failure_at timestamptz, next_scheduled_at timestamptz,
  imported_count bigint NOT NULL DEFAULT 0 CHECK (imported_count>=0), coverage jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_error_code text, schedule jsonb NOT NULL DEFAULT '{"kind":"manual"}'::jsonb,
  revision integer NOT NULL DEFAULT 1, disconnected_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_integration_connections_vault ON integration_connections(vault_id,updated_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_integration_provider_label_active ON integration_connections(vault_id,provider,lower(label)) WHERE disconnected_at IS NULL;
