CREATE TABLE IF NOT EXISTS personal_data_import_previews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  provider text NOT NULL, account_label text NOT NULL, export_format text NOT NULL,
  records jsonb NOT NULL, summary jsonb NOT NULL, status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','applied','expired')),
  revision integer NOT NULL DEFAULT 1, created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL DEFAULT now()+interval '24 hours', applied_at timestamptz
);
CREATE TABLE IF NOT EXISTS personal_data_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  provider text NOT NULL, account_label text NOT NULL, source_item_id text NOT NULL, action_kind text NOT NULL,
  observed_at timestamptz, title text, content_reference text, url text, metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  coverage jsonb NOT NULL, import_preview_id uuid REFERENCES personal_data_import_previews(id) ON DELETE SET NULL,
  revision integer NOT NULL DEFAULT 1, archived_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vault_id,provider,account_label,source_item_id,action_kind)
);
CREATE INDEX IF NOT EXISTS idx_personal_data_items_vault_time ON personal_data_items(vault_id,observed_at DESC NULLS LAST) WHERE archived_at IS NULL;
CREATE TABLE IF NOT EXISTS personal_data_suppressions (
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE, provider text NOT NULL, account_label text NOT NULL,
  source_item_id text NOT NULL, reason text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(vault_id,provider,account_label,source_item_id)
);
