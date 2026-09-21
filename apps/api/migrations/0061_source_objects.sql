ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN (
  'note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation',
  'schedule_preview','proposal_apply','calendar_policy_dry_run','commitment_rematch','calendar_context_refresh',
  'calendar_brief_refresh','calendar_import_preview','export_generate','study_plan_generate','study_exercise_generate',
  'study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh','sync_snapshot','domain_tool_run','source_refresh'
));

CREATE TABLE IF NOT EXISTS source_objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  connection_id uuid NOT NULL REFERENCES integration_connections(id) ON DELETE CASCADE,
  legacy_source_id uuid UNIQUE REFERENCES sources(id) ON DELETE SET NULL,
  provider_object_id text NOT NULL,
  container_id text,
  kind text NOT NULL,
  title text NOT NULL,
  access_state text NOT NULL DEFAULT 'available' CHECK (access_state IN ('available','denied','unavailable','excluded','deleted')),
  freshness text NOT NULL DEFAULT 'unverified' CHECK (freshness IN ('current','stale','unverified','tombstoned')),
  current_revision integer NOT NULL DEFAULT 1 CHECK (current_revision > 0),
  deep_link text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  excluded boolean NOT NULL DEFAULT false,
  exclusion_reason text,
  last_attempt_at timestamptz,
  last_success_at timestamptz,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(connection_id,provider_object_id)
);

CREATE TABLE IF NOT EXISTS source_object_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_object_id uuid NOT NULL REFERENCES source_objects(id) ON DELETE CASCADE,
  revision integer NOT NULL CHECK (revision > 0),
  content_hash text NOT NULL CHECK (content_hash ~ '^[0-9a-f]{64}$'),
  content_text text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  attachment_blob_ids uuid[] NOT NULL DEFAULT '{}',
  fetched_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_object_id,revision)
);

CREATE INDEX IF NOT EXISTS idx_source_objects_filters
  ON source_objects(vault_id,connection_id,kind,container_id,id);
