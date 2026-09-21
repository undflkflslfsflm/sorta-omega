CREATE TABLE IF NOT EXISTS connection_disconnect_previews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  connection_id uuid NOT NULL REFERENCES integration_connections(id) ON DELETE CASCADE,
  connection_revision integer NOT NULL CHECK (connection_revision > 0),
  retention_choice text NOT NULL CHECK (retention_choice IN ('retain_imported','delete_imported','retain_sources_delete_derived')),
  impact jsonb NOT NULL,
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','consumed','expired')),
  expires_at timestamptz NOT NULL DEFAULT (now()+interval '30 minutes'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_connection_disconnect_preview_active ON connection_disconnect_previews(connection_id,expires_at) WHERE state='draft';
