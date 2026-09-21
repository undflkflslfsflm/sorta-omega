CREATE TABLE IF NOT EXISTS routing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  name text NOT NULL,
  condition jsonb NOT NULL,
  target_label_ids uuid[] NOT NULL,
  priority integer NOT NULL DEFAULT 100 CHECK (priority >= 0 AND priority <= 1000),
  enabled boolean NOT NULL DEFAULT true,
  provenance text NOT NULL DEFAULT 'owner' CHECK (provenance IN ('owner')),
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vault_id, name)
);

CREATE INDEX IF NOT EXISTS idx_routing_rules_active ON routing_rules(vault_id, enabled, priority, created_at);
