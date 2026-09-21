ALTER TABLE tasks ADD COLUMN IF NOT EXISTS revision integer NOT NULL DEFAULT 1;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_minutes integer CHECK (estimated_minutes IS NULL OR estimated_minutes > 0);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS remaining_minutes integer CHECK (remaining_minutes IS NULL OR remaining_minutes >= 0);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS earliest_start timestamptz;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority integer NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS allow_split boolean NOT NULL DEFAULT true;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS min_block_minutes integer CHECK (min_block_minutes IS NULL OR min_block_minutes > 0);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS max_block_minutes integer CHECK (max_block_minutes IS NULL OR max_block_minutes > 0);
DO $$ BEGIN
  ALTER TABLE tasks ADD CONSTRAINT tasks_block_bounds CHECK (min_block_minutes IS NULL OR max_block_minutes IS NULL OR min_block_minutes <= max_block_minutes);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
