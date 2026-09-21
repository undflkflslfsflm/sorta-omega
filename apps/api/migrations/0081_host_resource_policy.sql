CREATE TABLE IF NOT EXISTS host_resource_policies (
  owner_id uuid PRIMARY KEY REFERENCES owners(id) ON DELETE CASCADE,
  max_inference_concurrency integer NOT NULL CHECK (max_inference_concurrency BETWEEN 1 AND 8),
  background_budget jsonb NOT NULL,
  quiet_hours jsonb,
  pause_background boolean NOT NULL DEFAULT false,
  model_profile_ids text[] NOT NULL DEFAULT '{}',
  interactive_priority text NOT NULL CHECK (interactive_priority IN ('preempt_background','queue_ahead')),
  model_residency text NOT NULL CHECK (model_residency IN ('unload_when_idle','keep_active_profiles')),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE system_jobs DROP CONSTRAINT IF EXISTS system_jobs_kind_check;
ALTER TABLE system_jobs ADD CONSTRAINT system_jobs_kind_check CHECK (kind IN (
  'backup_create','backup_verify','restore_plan','restore_apply','deployment_check','access_setup_preview'
));
