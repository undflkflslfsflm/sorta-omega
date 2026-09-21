ALTER TABLE vaults ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'nb-NO';
ALTER TABLE vaults ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'Europe/Oslo';
ALTER TABLE vaults ADD COLUMN IF NOT EXISTS storage_mode text NOT NULL DEFAULT 'machine_local'
  CHECK (storage_mode IN ('machine_local', 'host_synced'));
ALTER TABLE vaults ADD COLUMN IF NOT EXISTS remote_authorized boolean NOT NULL DEFAULT false;
ALTER TABLE vaults ADD COLUMN IF NOT EXISTS revision integer NOT NULL DEFAULT 1 CHECK (revision > 0);
ALTER TABLE vaults ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_vaults_owner_remote
  ON vaults(owner_id, created_at)
  WHERE remote_authorized = true;
