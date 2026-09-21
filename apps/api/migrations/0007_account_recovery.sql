ALTER TABLE passkeys ADD COLUMN IF NOT EXISTS label text NOT NULL DEFAULT 'Passkey';
ALTER TABLE auth_challenges ADD COLUMN IF NOT EXISTS passkey_label text;

CREATE INDEX IF NOT EXISTS idx_recovery_codes_owner_available ON recovery_codes(owner_id, created_at) WHERE consumed_at IS NULL;
