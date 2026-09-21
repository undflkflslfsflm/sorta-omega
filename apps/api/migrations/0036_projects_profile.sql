CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  title text NOT NULL, description_note_id uuid REFERENCES notes(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('planned','active','paused','completed','cancelled')),
  goal_ids uuid[] NOT NULL DEFAULT '{}', note_ids uuid[] NOT NULL DEFAULT '{}', task_ids uuid[] NOT NULL DEFAULT '{}', idea_ids uuid[] NOT NULL DEFAULT '{}', source_anchor_ids uuid[] NOT NULL DEFAULT '{}',
  revision integer NOT NULL DEFAULT 1, archived_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_projects_vault ON projects(vault_id,status,updated_at DESC) WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  source_id uuid NOT NULL REFERENCES sources(id) ON DELETE RESTRICT, title text, project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  state text NOT NULL DEFAULT 'inbox' CHECK (state IN ('inbox','developing','proposed','promoted','dismissed')),
  source_anchor_ids uuid[] NOT NULL DEFAULT '{}', revision integer NOT NULL DEFAULT 1, archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ideas_vault ON ideas(vault_id,state,updated_at DESC) WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  title text NOT NULL, kind text NOT NULL CHECK (kind IN ('study','project','habit','personal','other')),
  target text, scale text, target_date date, course_id uuid REFERENCES school_courses(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL, constraints jsonb NOT NULL DEFAULT '{}', source_anchor_ids uuid[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','achieved','paused','abandoned')),
  revision integer NOT NULL DEFAULT 1, archived_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_goals_vault ON goals(vault_id,status,updated_at DESC) WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('fact','preference','workflow','plan','project_context','goal_context')),
  content text NOT NULL, source_anchor_ids uuid[] NOT NULL DEFAULT '{}', origin text NOT NULL CHECK (origin IN ('explicit','inferred')),
  valid_from timestamptz, expires_at timestamptz, user_confirmed boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','superseded','dismissed')),
  revision integer NOT NULL DEFAULT 1, archived_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (origin='explicit' OR cardinality(source_anchor_ids)>0), CHECK (expires_at IS NULL OR valid_from IS NULL OR expires_at>valid_from)
);
CREATE INDEX IF NOT EXISTS idx_memories_vault ON memories(vault_id,status,updated_at DESC) WHERE archived_at IS NULL;
