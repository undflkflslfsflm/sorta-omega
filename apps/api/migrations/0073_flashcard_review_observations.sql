ALTER TABLE flashcard_reviews ADD COLUMN IF NOT EXISTS answer text;
ALTER TABLE flashcard_reviews ADD COLUMN IF NOT EXISTS hints_used integer CHECK (hints_used IS NULL OR hints_used >= 0);
ALTER TABLE flashcard_reviews ADD COLUMN IF NOT EXISTS elapsed_ms integer CHECK (elapsed_ms IS NULL OR elapsed_ms >= 0);
