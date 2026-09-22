import { api, ApiError } from "./api";
import { cachedCoreRecords, cachedNoteAccessBlocked, offlineCaptureEnabled, replicaDeviceId, setCachedNoteAccessBlocked } from "./offline-queue";

/** Resolve a search hit independently of the current/paginated note list. */
export async function openSearchNote(noteId:string) {
  try {
    // Metadata access does not prove canonical document access. Only the
    // document loader may clear a remembered block after its own successful
    // authorization check.
    return await api.note(noteId);
  } catch(error) {
    if(error instanceof ApiError && [401,403,404,410].includes(error.status)) {
      try { await setCachedNoteAccessBlocked(noteId,true); } finally { throw error; }
    }
    if(!(error instanceof TypeError || error instanceof ApiError && error.status>=500)) throw error;
    if(!offlineCaptureEnabled() || !await replicaDeviceId() || await cachedNoteAccessBlocked(noteId)) throw error;
    const note = (await cachedCoreRecords())?.notes.find(item=>item.id===noteId);
    if(!note || !offlineCaptureEnabled() || await cachedNoteAccessBlocked(noteId)) throw error;
    return note;
  }
}
