import { describe, expect, it, vi } from "vitest";
import { noteRevisionSchema } from "@sorta/contracts";
import { createDocumentState, migrateDocumentToRich, readDocumentText } from "./note-document.js";
import { migrateNoteToRich } from "./rich-note-migration.js";

describe("transaction-scoped rich note migration", () => {
  it("accepts every database revision actor in the API representation", () => {
    for (const actorKind of ["owner", "capture", "restore", "ai", "import", "migration"]) {
      expect(noteRevisionSchema.safeParse({
        id: "00000000-0000-4000-8000-000000000001", noteId: "00000000-0000-4000-8000-000000000002",
        revision: 1, title: "Title", text: "Body", actorKind, createdAt: "2026-09-22T00:00:00.000Z"
      }).success).toBe(true);
    }
  });
  function client(rows: unknown[]) {
    return { query: vi.fn().mockResolvedValueOnce({ rows }).mockResolvedValue({ rows: [] }) };
  }
  const note = { title: "Title", body: "Body", revision: 3, yjs_state: createDocumentState("Body") };

  it("locks the vault-scoped note and inserts a new immutable revision", async () => {
    const db = client([note]);
    expect(await migrateNoteToRich(db, "vault", "note", 3)).toEqual({ migrated: true, revision: 4 });
    expect(db.query.mock.calls[0]).toEqual([
      expect.stringContaining("vault_id=$1 AND id=$2 AND trashed_at IS NULL FOR UPDATE"), ["vault", "note"]
    ]);
    expect(db.query).toHaveBeenCalledTimes(3);
    expect(db.query.mock.calls[1][1][4]).toBe(4);
    expect(readDocumentText(db.query.mock.calls[1][1][3])).toBe("Body");
    expect(db.query.mock.calls[2][0]).toContain("INSERT INTO note_revisions");
    expect(db.query.mock.calls[2][0]).toContain("'migration'");
  });

  it("does not write for missing, stale or already migrated notes", async () => {
    const missing = client([]);
    await expect(migrateNoteToRich(missing, "vault", "note", 3)).rejects.toThrow("note_not_found");
    const stale = client([note]);
    await expect(migrateNoteToRich(stale, "vault", "note", 2)).rejects.toThrow("stale_revision");
    const done = client([{ ...note, revision: 4, yjs_state: migrateDocumentToRich(note.yjs_state).state }]);
    expect(await migrateNoteToRich(done, "vault", "note", 3)).toEqual({ migrated: false, revision: 4 });
    for (const db of [missing, stale, done]) expect(db.query).toHaveBeenCalledTimes(1);
  });

  it("propagates a failed revision insert for the caller to roll back", async () => {
    const db = client([note]);
    db.query.mockResolvedValueOnce({ rows: [] }).mockRejectedValueOnce(new Error("insert failed"));
    await expect(migrateNoteToRich(db, "vault", "note", 3)).rejects.toThrow("insert failed");
  });
});
