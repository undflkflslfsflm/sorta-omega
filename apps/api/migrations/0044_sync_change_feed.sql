ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind_check CHECK (kind IN ('note_process','hybrid_search','semantic_search','ai_setup_test','index_rebuild','answer_generation','schedule_preview','proposal_apply','study_plan_generate','study_exercise_generate','study_attempt_feedback','catch_up_plan','insight_generate','profile_refresh','sync_snapshot'));

CREATE TABLE IF NOT EXISTS vault_change_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  record_type text NOT NULL CHECK (record_type ~ '^[a-z][a-z0-9_]{0,79}$'),
  record_id uuid NOT NULL,
  change_kind text NOT NULL CHECK (change_kind IN ('upsert','tombstone')),
  revision integer NOT NULL CHECK (revision >= 0),
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vault_change_events_cursor ON vault_change_events(vault_id,id);

CREATE TABLE IF NOT EXISTS sync_retention_floors (
  vault_id uuid PRIMARY KEY REFERENCES vaults(id) ON DELETE CASCADE,
  minimum_event_id bigint NOT NULL DEFAULT 0 CHECK (minimum_event_id >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO sync_retention_floors(vault_id) SELECT id FROM vaults ON CONFLICT(vault_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS sync_tombstones (
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  record_type text NOT NULL CHECK (record_type ~ '^[a-z][a-z0-9_]{0,79}$'),
  record_id uuid NOT NULL,
  revision integer NOT NULL CHECK (revision >= 0),
  deleted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(vault_id,record_type,record_id)
);

CREATE TABLE IF NOT EXISTS sync_operations (
  device_id uuid NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  operation_id uuid NOT NULL,
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  payload_hash char(64) NOT NULL,
  outcome jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(device_id,operation_id)
);
CREATE INDEX IF NOT EXISTS idx_sync_operations_vault_created ON sync_operations(vault_id,created_at DESC);

CREATE OR REPLACE FUNCTION emit_vault_change_event() RETURNS trigger AS $$
DECLARE
  row_data jsonb;
  target_vault uuid;
  target_id uuid;
  target_revision integer;
  target_kind text := 'upsert';
BEGIN
  row_data := CASE WHEN TG_OP='DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END;
  target_vault := (row_data->>'vault_id')::uuid;
  target_id := (row_data->>TG_ARGV[1])::uuid;
  target_revision := COALESCE((row_data->>'revision')::integer,0);
  IF TG_OP='DELETE' OR NULLIF(row_data->>'archived_at','') IS NOT NULL OR NULLIF(row_data->>'trashed_at','') IS NOT NULL OR NULLIF(row_data->>'deleted_at','') IS NOT NULL THEN target_kind := 'tombstone'; END IF;
  IF TG_OP='DELETE' THEN
    INSERT INTO sync_tombstones(vault_id,record_type,record_id,revision) VALUES(target_vault,TG_ARGV[0],target_id,target_revision)
    ON CONFLICT(vault_id,record_type,record_id) DO UPDATE SET revision=GREATEST(sync_tombstones.revision,EXCLUDED.revision),deleted_at=now();
  END IF;
  INSERT INTO sync_retention_floors(vault_id) VALUES(target_vault) ON CONFLICT(vault_id) DO NOTHING;
  INSERT INTO vault_change_events(vault_id,record_type,record_id,change_kind,revision) VALUES(target_vault,TG_ARGV[0],target_id,target_kind,target_revision);
  RETURN CASE WHEN TG_OP='DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  item text[];
  entries text[][] := ARRAY[
    ARRAY['notes','note','id'], ARRAY['tasks','task','id'], ARRAY['calendar_events','calendar_event','id'],
    ARRAY['calendar_entities','calendar_entity','id'], ARRAY['commitments','commitment','id'],
    ARRAY['school_subjects','school_subject','id'], ARRAY['school_courses','school_course','id'],
    ARRAY['school_assignments','school_assignment','id'], ARRAY['school_lessons','school_lesson','id'],
    ARRAY['school_assessments','school_assessment','id'], ARRAY['attendance_records','attendance_record','id'],
    ARRAY['performance_grades','performance_grade','id'], ARRAY['performance_targets','performance_target','course_id'],
    ARRAY['study_sessions','study_session','id'], ARRAY['knowledge_gaps','knowledge_gap','id'],
    ARRAY['flashcard_decks','flashcard_deck','id'], ARRAY['flashcards','flashcard','id'],
    ARRAY['scheduler_preferences','scheduler_preferences','vault_id'], ARRAY['momentum_preferences','momentum_preferences','vault_id'],
    ARRAY['projects','project','id'], ARRAY['ideas','idea','id'], ARRAY['goals','goal','id'], ARRAY['memories','memory','id'],
    ARRAY['integration_connections','integration_connection','id'], ARRAY['insights','insight','id'],
    ARRAY['personal_data_items','personal_data_item','id'], ARRAY['interests','interest','id'],
    ARRAY['provider_calendar_actions','provider_calendar_action','id']
  ];
BEGIN
  FOREACH item SLICE 1 IN ARRAY entries LOOP
    IF to_regclass(item[1]) IS NOT NULL THEN
      EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', 'sync_change_'||item[1], item[1]);
      EXECUTE format('CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION emit_vault_change_event(%L,%L)', 'sync_change_'||item[1], item[1], item[2], item[3]);
    END IF;
  END LOOP;
END $$;
