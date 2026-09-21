CREATE TABLE IF NOT EXISTS interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  label text NOT NULL, normalized_label text NOT NULL, origin text NOT NULL DEFAULT 'inferred' CHECK (origin IN ('explicit','inferred')),
  status text NOT NULL DEFAULT 'tentative' CHECK (status IN ('tentative','confirmed','corrected','dismissed','retracted')),
  metric jsonb NOT NULL, confidence_semantics text NOT NULL, method_version text NOT NULL,
  first_observed_at timestamptz, last_observed_at timestamptz, owner_correction text,
  suppression jsonb, revision integer NOT NULL DEFAULT 1, archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vault_id,normalized_label)
);
CREATE TABLE IF NOT EXISTS interest_evidence (
  interest_id uuid NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  personal_data_item_id uuid NOT NULL REFERENCES personal_data_items(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(interest_id,personal_data_item_id)
);
CREATE INDEX IF NOT EXISTS idx_interest_evidence_item ON interest_evidence(personal_data_item_id);
