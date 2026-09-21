CREATE TABLE IF NOT EXISTS personal_data_policies (
  vault_id uuid PRIMARY KEY REFERENCES vaults(id) ON DELETE CASCADE,
  enabled_providers text[] NOT NULL DEFAULT '{}',
  analysis_types text[] NOT NULL DEFAULT '{}',
  retention_days integer NOT NULL DEFAULT 90 CHECK (retention_days BETWEEN 0 AND 3650),
  weekly_sync jsonb NOT NULL DEFAULT '{"enabled":false,"weekday":1,"localTime":"03:00","timezone":"Europe/Oslo"}'::jsonb,
  privacy jsonb NOT NULL DEFAULT '{"includeRawTitles":false,"includeUrls":false,"allowProfileInference":false}'::jsonb,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
