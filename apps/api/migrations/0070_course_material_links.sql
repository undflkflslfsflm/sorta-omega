CREATE TABLE IF NOT EXISTS course_material_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES school_courses(id) ON DELETE CASCADE,
  source_object_id uuid NOT NULL REFERENCES source_objects(id) ON DELETE RESTRICT,
  source_revision_id uuid NOT NULL REFERENCES source_object_revisions(id) ON DELETE RESTRICT,
  chapter text,
  lesson_id uuid REFERENCES school_lessons(id) ON DELETE SET NULL,
  mapping_origin text NOT NULL CHECK (mapping_origin IN ('owner','provider','import','inferred')),
  evidence_anchor_ids uuid[] NOT NULL DEFAULT '{}',
  revision integer NOT NULL DEFAULT 1,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS course_material_links_course_idx ON course_material_links(vault_id,course_id,created_at DESC,id DESC) WHERE archived_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS course_material_links_active_unique ON course_material_links(course_id,source_object_id,source_revision_id,coalesce(chapter,''),coalesce(lesson_id,'00000000-0000-0000-0000-000000000000'::uuid)) WHERE archived_at IS NULL;

ALTER TABLE school_assignments ADD COLUMN IF NOT EXISTS archive_reason text;
