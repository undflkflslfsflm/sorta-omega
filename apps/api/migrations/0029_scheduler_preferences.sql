CREATE TABLE IF NOT EXISTS scheduler_preferences (
  vault_id uuid PRIMARY KEY REFERENCES vaults(id) ON DELETE CASCADE,
  timezone text NOT NULL, protected_windows jsonb NOT NULL DEFAULT '[]'::jsonb, preferred_windows jsonb NOT NULL DEFAULT '[]'::jsonb,
  daily_limit_minutes integer NOT NULL CHECK (daily_limit_minutes BETWEEN 0 AND 1440),
  break_minutes integer NOT NULL CHECK (break_minutes BETWEEN 0 AND 240),
  min_block_minutes integer NOT NULL CHECK (min_block_minutes > 0), max_block_minutes integer NOT NULL CHECK (max_block_minutes >= min_block_minutes),
  allow_split boolean NOT NULL, replan_policy text NOT NULL CHECK (replan_policy IN ('manual_only','preview_on_conflict')),
  algorithm_version text NOT NULL DEFAULT 'deterministic-scheduler-v1', revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
