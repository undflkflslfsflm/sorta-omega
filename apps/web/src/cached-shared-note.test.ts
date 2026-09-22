import "fake-indexeddb/auto";
import * as Y from "yjs";
import { beforeEach,describe,expect,it,vi } from "vitest";
import { api,ApiError } from "./api";
import { loadNoteSnapshot,loadCachedNoteDocument } from "./cached-shared-note";
import { cacheNoteSnapshot,clearOfflineReplica,setOfflineCaptureEnabled,setReplicaDeviceId } from "./offline-queue";
import { RichNoteSession,encodeNoteUpdate } from "./rich-note-session";
vi.mock("./api",async importOriginal=>({...await importOriginal<typeof import("./api")>(),api:{noteDocument:vi.fn()}}));
const storage=new Map<string,string>();
Object.defineProperty(globalThis,"localStorage",{value:{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value)}});
const noteId="00000000-0000-4000-8000-000000000911",revisionId="00000000-0000-4000-8000-000000000912";
async function seed(){
  setOfflineCaptureEnabled(true);await setReplicaDeviceId("00000000-0000-4000-8000-000000000913");
  const doc=new Y.Doc(),paragraph=new Y.XmlElement("paragraph"),text=new Y.XmlText();
  paragraph.insert(0,[text]);doc.getXmlFragment("prosemirror").insert(0,[paragraph]);text.insert(0,"Cached");
  const snapshot={noteId,revisionId,updateBase64:encodeNoteUpdate(Y.encodeStateAsUpdate(doc))};
  await cacheNoteSnapshot(snapshot);doc.destroy();return snapshot;
}
describe("offline canonical note reopening",()=>{
  beforeEach(async()=>{storage.clear();await clearOfflineReplica();vi.mocked(api.noteDocument).mockReset();});
  it("uses the trusted snapshot on transport failure and includes locally committed edits",async()=>{
    const snapshot=await seed(),session=await RichNoteSession.open(snapshot,1);
    const text=(session.document.getXmlFragment("prosemirror").get(0) as Y.XmlElement).get(0) as Y.XmlText;
    text.insert(6," local");await session.persist();session.close();
    vi.mocked(api.noteDocument).mockRejectedValue(new TypeError("Failed to fetch"));
    expect(await loadNoteSnapshot(noteId)).toMatchObject({offline:true,content:snapshot.updateBase64});
    expect((await loadCachedNoteDocument(noteId))?.content[0].content?.[0].text).toBe("Cached local");
  });
  it("does not use cached data for explicit authorization or deletion failures",async()=>{
    await seed();
    for(const status of [401,403,404,410]){
      const error=new ApiError(status,"denied");vi.mocked(api.noteDocument).mockRejectedValue(error);
      await expect(loadNoteSnapshot(noteId)).rejects.toBe(error);
    }
  });
  it("requires both trust and a saved replica enrollment for cached access",async()=>{
    const snapshot=await seed();setOfflineCaptureEnabled(false);
    vi.mocked(api.noteDocument).mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(loadNoteSnapshot(noteId)).rejects.toThrow();
    expect(await loadCachedNoteDocument(noteId)).toBeNull();
    setOfflineCaptureEnabled(true);await clearOfflineReplica();
    await cacheNoteSnapshot(snapshot);
    expect(await loadCachedNoteDocument(noteId)).toBeNull();
    await expect(loadNoteSnapshot(noteId)).rejects.toThrow();
  });
  it("allows cached recovery for a server outage, but not a malformed response",async()=>{
    await seed();vi.mocked(api.noteDocument).mockRejectedValue(new ApiError(503,"unavailable"));
    expect((await loadNoteSnapshot(noteId)).offline).toBe(true);
    vi.mocked(api.noteDocument).mockRejectedValue(new SyntaxError("bad response"));
    await expect(loadNoteSnapshot(noteId)).rejects.toThrow("bad response");
  });
});
