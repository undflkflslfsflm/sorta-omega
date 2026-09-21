CREATE TABLE IF NOT EXISTS tool_policy_sets (
  vault_id uuid PRIMARY KEY REFERENCES vaults(id) ON DELETE CASCADE,
  policies jsonb NOT NULL,
  policy_version text NOT NULL DEFAULT 'tool-policy-v1' CHECK (policy_version='tool-policy-v1'),
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
