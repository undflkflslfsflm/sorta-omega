CREATE TABLE IF NOT EXISTS labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('area', 'project', 'topic', 'entity')),
  name text NOT NULL,
  aliases text[] NOT NULL DEFAULT ARRAY[]::text[],
  parent_id uuid REFERENCES labels(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('provisional', 'confirmed')),
  pinned boolean NOT NULL DEFAULT false,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vault_id, kind, name)
);

CREATE TABLE IF NOT EXISTS note_labels (
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  label_id uuid NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  locked boolean NOT NULL DEFAULT false,
  provenance text NOT NULL CHECK (provenance IN ('owner', 'classification', 'rule')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(note_id, label_id)
);

CREATE INDEX IF NOT EXISTS idx_labels_vault_kind_name ON labels(vault_id, kind, lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS idx_labels_unique_name_ci ON labels(vault_id, kind, lower(name));
CREATE INDEX IF NOT EXISTS idx_note_labels_label ON note_labels(label_id, note_id);
