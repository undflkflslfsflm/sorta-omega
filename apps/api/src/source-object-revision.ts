import { sourceObjectRevisionSchema } from "@sorta/contracts";

export function mapStoredSourceRevision(row: Record<string, any>) {
  return sourceObjectRevisionSchema.parse({
    id: row.id,
    sourceObjectId: row.source_object_id,
    revision: row.revision,
    contentHash: row.content_hash,
    exactContent: row.content_text ?? null,
    metadata: row.metadata,
    attachmentBlobIds: row.attachment_blob_ids,
    fetchedAt: new Date(row.fetched_at).toISOString()
  });
}
