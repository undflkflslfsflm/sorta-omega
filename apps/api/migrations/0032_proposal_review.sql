ALTER TABLE schedule_proposals DROP CONSTRAINT IF EXISTS schedule_proposals_status_check;
ALTER TABLE schedule_proposals ADD CONSTRAINT schedule_proposals_status_check CHECK (status IN ('draft','approved','rejected','withdrawn','superseded','expired'));
ALTER TABLE schedule_proposals ADD COLUMN IF NOT EXISTS revision integer NOT NULL DEFAULT 1;
ALTER TABLE schedule_proposals ADD COLUMN IF NOT EXISTS affected_record_ids jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE schedule_proposals ADD COLUMN IF NOT EXISTS required_permissions text[] NOT NULL DEFAULT ARRAY['schedule:write','calendar:write']::text[];
ALTER TABLE schedule_proposals ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE schedule_proposals ADD COLUMN IF NOT EXISTS rejection_reason text;
ALTER TABLE schedule_proposals ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE schedule_proposals p SET affected_record_ids=(SELECT coalesce(jsonb_agg(DISTINCT item->>'taskId'),'[]'::jsonb) FROM jsonb_array_elements(p.placements) item) WHERE affected_record_ids='[]'::jsonb;
