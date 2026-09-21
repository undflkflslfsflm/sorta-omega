CREATE TABLE IF NOT EXISTS resurfacing_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('dismiss','snooze','hide_topic')),
  label_id uuid REFERENCES labels(id) ON DELETE CASCADE,
  until_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((action='snooze') = (until_at IS NOT NULL)),
  CHECK ((action='hide_topic') = (label_id IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_resurfacing_feedback_note
  ON resurfacing_feedback(vault_id,note_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resurfacing_hidden_topic
  ON resurfacing_feedback(vault_id,label_id,created_at DESC) WHERE action='hide_topic';
