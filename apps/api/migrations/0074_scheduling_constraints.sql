ALTER TABLE scheduler_preferences ADD COLUMN IF NOT EXISTS freeze_horizon_minutes integer NOT NULL DEFAULT 120 CHECK (freeze_horizon_minutes BETWEEN 0 AND 10080);
ALTER TABLE scheduler_preferences ADD COLUMN IF NOT EXISTS movement_policy text NOT NULL DEFAULT 'minimize_disruption' CHECK (movement_policy IN ('preserve_locked','minimize_disruption','allow_reflow'));
