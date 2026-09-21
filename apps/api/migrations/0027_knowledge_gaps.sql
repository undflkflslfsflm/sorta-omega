CREATE TABLE IF NOT EXISTS knowledge_gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  course_id uuid REFERENCES school_courses(id) ON DELETE SET NULL,
  concept text NOT NULL,
  material_source_ids uuid[] NOT NULL DEFAULT '{}',
  statement text NOT NULL,
  evidence_anchor_ids uuid[] NOT NULL DEFAULT '{}',
  origin text NOT NULL CHECK (origin IN ('owner_report','teacher_feedback','practice_inference')),
  status text NOT NULL DEFAULT 'reported' CHECK (status IN ('reported','confirmed','corrected','dismissed','resolved')),
  uncertainty text,
  correction text,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_knowledge_gaps_course_status ON knowledge_gaps(vault_id,course_id,status,updated_at DESC);
