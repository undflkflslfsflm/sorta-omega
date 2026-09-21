CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('weekly_review','project_review','study_pattern','interest_trend')),
  window_start date NOT NULL, window_end date NOT NULL, title text NOT NULL,
  facts jsonb NOT NULL DEFAULT '[]'::jsonb, coverage jsonb NOT NULL DEFAULT '[]'::jsonb,
  suggestions jsonb NOT NULL DEFAULT '[]'::jsonb, source_manifest jsonb NOT NULL DEFAULT '[]'::jsonb,
  generator text NOT NULL, state text NOT NULL DEFAULT 'seen' CHECK (state IN ('seen','dismissed','pinned')),
  annotation text, revision integer NOT NULL DEFAULT 1, archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (window_end>=window_start)
);
CREATE INDEX IF NOT EXISTS idx_insights_vault_window ON insights(vault_id,window_end DESC,created_at DESC) WHERE archived_at IS NULL;
