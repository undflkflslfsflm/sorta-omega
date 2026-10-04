ALTER TABLE school_assignments
  ADD COLUMN IF NOT EXISTS provider_list_section text
  CHECK (provider_list_section IN ('upcoming', 'past_due', 'completed'));
