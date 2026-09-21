CREATE TABLE IF NOT EXISTS flashcard_decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  course_id uuid REFERENCES school_courses(id) ON DELETE SET NULL, name text NOT NULL,
  material_source_ids uuid[] NOT NULL DEFAULT '{}', source_snapshots jsonb NOT NULL DEFAULT '[]'::jsonb,
  origin text NOT NULL DEFAULT 'owner' CHECK (origin IN ('owner','generated')), archived_at timestamptz,
  revision integer NOT NULL DEFAULT 1, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_flashcard_decks_vault ON flashcard_decks(vault_id,updated_at DESC) WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  deck_id uuid NOT NULL REFERENCES flashcard_decks(id) ON DELETE RESTRICT, prompt text NOT NULL, answer text NOT NULL,
  source_anchor_ids uuid[] NOT NULL DEFAULT '{}', origin text NOT NULL DEFAULT 'owner' CHECK (origin IN ('owner','generated')),
  approval_status text NOT NULL DEFAULT 'approved' CHECK (approval_status IN ('draft','approved')),
  review_policy_version text NOT NULL DEFAULT 'omega-review-v1', next_due timestamptz, review_count integer NOT NULL DEFAULT 0,
  archived_at timestamptz, revision integer NOT NULL DEFAULT 1, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_flashcards_due ON flashcards(vault_id,next_due) WHERE archived_at IS NULL AND approval_status='approved';

CREATE TABLE IF NOT EXISTS flashcard_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  response_id text NOT NULL, card_id uuid NOT NULL REFERENCES flashcards(id) ON DELETE RESTRICT, card_revision integer NOT NULL,
  rating text NOT NULL CHECK (rating IN ('again','hard','good','easy')), observed_at timestamptz NOT NULL,
  active_seconds integer CHECK (active_seconds IS NULL OR active_seconds >= 0), review_policy_version text NOT NULL,
  computed_next_due timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vault_id,response_id)
);
CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_card ON flashcard_reviews(card_id,observed_at DESC);
