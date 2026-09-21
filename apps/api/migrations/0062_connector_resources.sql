CREATE TABLE IF NOT EXISTS connector_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  connection_id uuid NOT NULL REFERENCES integration_connections(id) ON DELETE CASCADE,
  provider_resource_id text NOT NULL,
  kind text NOT NULL,
  parent_id uuid REFERENCES connector_resources(id) ON DELETE SET NULL,
  name text NOT NULL,
  access_state text NOT NULL DEFAULT 'available' CHECK (access_state IN ('available','denied','skipped','unavailable')),
  selected boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(connection_id,provider_resource_id)
);

CREATE INDEX IF NOT EXISTS idx_connector_resources_connection
  ON connector_resources(connection_id,kind,parent_id,id);

ALTER TABLE integration_connections ADD COLUMN IF NOT EXISTS selection_window jsonb;
ALTER TABLE integration_connections ADD COLUMN IF NOT EXISTS selection_approvals jsonb NOT NULL DEFAULT '{"sensitiveDataOptIns":[]}'::jsonb;
