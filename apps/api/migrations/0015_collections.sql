CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  name text NOT NULL,
  filter jsonb NOT NULL,
  sort text NOT NULL CHECK (sort IN ('updated_desc', 'created_desc', 'title_asc')),
  view text NOT NULL CHECK (view IN ('grid', 'list')),
  system boolean NOT NULL DEFAULT false,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vault_id, name)
);

INSERT INTO collections(vault_id, name, filter, sort, view, system)
SELECT id, 'All notes', '{"operator":"and","conditions":[]}'::jsonb, 'updated_desc', 'grid', true FROM vaults
ON CONFLICT(vault_id, name) DO NOTHING;

INSERT INTO collections(vault_id, name, filter, sort, view, system)
SELECT id, 'Unclassified', '{"operator":"and","conditions":[{"type":"classification","value":null}]}'::jsonb, 'updated_desc', 'list', true FROM vaults
ON CONFLICT(vault_id, name) DO NOTHING;
