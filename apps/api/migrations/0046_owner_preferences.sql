CREATE TABLE IF NOT EXISTS owner_preferences (
  owner_id uuid PRIMARY KEY REFERENCES owners(id) ON DELETE CASCADE,
  locale text NOT NULL DEFAULT 'nb-NO',
  timezone text NOT NULL DEFAULT 'Europe/Oslo',
  notification_channels text[] NOT NULL DEFAULT ARRAY['in_app']::text[],
  protect_focus_time boolean NOT NULL DEFAULT true,
  default_focus_minutes integer NOT NULL DEFAULT 45 CHECK (default_focus_minutes BETWEEN 15 AND 240),
  profile_inference_enabled boolean NOT NULL DEFAULT false,
  expanded_data_egress_enabled boolean NOT NULL DEFAULT false,
  default_personal_data_sync text NOT NULL DEFAULT 'off'
    CHECK (default_personal_data_sync IN ('off', 'manual', 'scheduled')),
  sensitive_school_categories text[] NOT NULL DEFAULT ARRAY['attendance', 'performance']::text[],
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (cardinality(notification_channels) BETWEEN 1 AND 2),
  CHECK (notification_channels <@ ARRAY['in_app', 'windows_native']::text[]),
  CHECK (sensitive_school_categories <@ ARRAY['attendance', 'performance', 'health', 'accommodations', 'discipline']::text[])
);

INSERT INTO owner_preferences(owner_id)
SELECT id FROM owners
ON CONFLICT (owner_id) DO NOTHING;
