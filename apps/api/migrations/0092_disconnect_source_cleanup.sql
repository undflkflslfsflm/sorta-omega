ALTER TABLE course_material_links DROP CONSTRAINT IF EXISTS course_material_links_source_object_id_fkey;
ALTER TABLE course_material_links ADD CONSTRAINT course_material_links_source_object_id_fkey
  FOREIGN KEY (source_object_id) REFERENCES source_objects(id) ON DELETE CASCADE;
