CREATE TABLE IF NOT EXISTS calendar_policy_sets (
  vault_id uuid PRIMARY KEY REFERENCES vaults(id) ON DELETE CASCADE,
  rules jsonb NOT NULL DEFAULT '[]'::jsonb,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calendar_automation_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  policy_rule_id uuid,
  source_id uuid REFERENCES sources(id) ON DELETE SET NULL,
  event_id uuid REFERENCES calendar_events(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN ('create_private_event','create_commitment','add_preparation','queue_external_calendar_action')),
  outcome text NOT NULL CHECK (outcome IN ('applied','suggested','blocked')),
  reason_codes text[] NOT NULL DEFAULT '{}',
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  policy_revision integer NOT NULL CHECK (policy_revision > 0),
  reversible boolean NOT NULL DEFAULT false,
  undo_manifest jsonb,
  undo_operation_id text,
  undo_result jsonb,
  undone_at timestamptz,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((reversible AND undo_manifest IS NOT NULL) OR (NOT reversible AND undo_manifest IS NULL))
);

CREATE INDEX IF NOT EXISTS idx_calendar_decisions_vault_created
  ON calendar_automation_decisions(vault_id, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_calendar_decisions_source ON calendar_automation_decisions(vault_id, source_id) WHERE source_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_calendar_decisions_event ON calendar_automation_decisions(vault_id, event_id) WHERE event_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_decision_undo_operation
  ON calendar_automation_decisions(vault_id, undo_operation_id) WHERE undo_operation_id IS NOT NULL;

ALTER TABLE prep_items DROP CONSTRAINT IF EXISTS prep_items_invalidation_reason_check;
ALTER TABLE prep_items ADD CONSTRAINT prep_items_invalidation_reason_check
  CHECK (invalidation_reason IS NULL OR invalidation_reason IN ('commitment_changed','commitment_terminal','commitment_archived','entity_alias_removed','automation_decision_undo'));
