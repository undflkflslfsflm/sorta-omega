ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_tasks_vault_active_due ON tasks(vault_id,completed,due_at) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  source_anchor_id uuid REFERENCES semantic_chunks(id) ON DELETE SET NULL,
  remind_at timestamptz NOT NULL,
  timezone text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('in_app','desktop')),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','snoozed','delivered','missed','dismissed','cancelled')),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  delivered_at timestamptz,
  dismissed_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((status IN ('delivered','missed') AND delivered_at IS NOT NULL) OR status NOT IN ('delivered','missed'))
);
CREATE INDEX IF NOT EXISTS idx_reminders_vault_due ON reminders(vault_id,status,remind_at) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  reminder_id uuid NOT NULL UNIQUE REFERENCES reminders(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  channel text NOT NULL CHECK (channel IN ('in_app','desktop')),
  title text NOT NULL,
  body text NOT NULL,
  state text NOT NULL DEFAULT 'unread' CHECK (state IN ('unread','read','dismissed')),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  delivered_at timestamptz NOT NULL,
  read_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_vault_state ON notifications(vault_id,state,delivered_at DESC);

DO $$ BEGIN
  DROP TRIGGER IF EXISTS sync_change_reminders ON reminders;
  CREATE TRIGGER sync_change_reminders AFTER INSERT OR UPDATE OR DELETE ON reminders FOR EACH ROW EXECUTE FUNCTION emit_vault_change_event('reminder','id');
  DROP TRIGGER IF EXISTS sync_change_notifications ON notifications;
  CREATE TRIGGER sync_change_notifications AFTER INSERT OR UPDATE OR DELETE ON notifications FOR EACH ROW EXECUTE FUNCTION emit_vault_change_event('notification','id');
END $$;
