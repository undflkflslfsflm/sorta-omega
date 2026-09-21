CREATE TABLE IF NOT EXISTS momentum_preferences (
  vault_id uuid PRIMARY KEY REFERENCES vaults(id) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT false,
  evidence_window_days integer NOT NULL DEFAULT 28 CHECK (evidence_window_days BETWEEN 7 AND 365),
  min_observations integer NOT NULL DEFAULT 5 CHECK (min_observations BETWEEN 2 AND 100),
  user_locked_parameters text[] NOT NULL DEFAULT '{}',
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (user_locked_parameters <@ ARRAY['estimated_minutes','preferred_windows','protected_windows','daily_limit_minutes','break_minutes','block_size','replan_policy']::text[]),
  CHECK (cardinality(user_locked_parameters) <= 7)
);
