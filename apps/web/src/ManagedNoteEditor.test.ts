import "fake-indexeddb/auto";
import * as Y from "yjs";
import { beforeEach,describe,expect,it,vi } from "vitest";
import { openManagedNoteSession } from "./ManagedNoteEditor";
import { api } from "./api";
import { clearOfflineReplica,setOfflineCaptureEnabled,setReplicaDeviceId } from "./offline-queue";
import { encodeNoteUpdate } from "./rich-note-session";
vi.mock("./api",async importOriginal=>({...await importOriginal<typeof import("./api")>(),api:{noteDocument:vi.fn()}}));
const storage=new Map<string,string>();
Object.defineProperty(globalThis,"localStorage",{value:{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value)}});
const noteId="00000000-0000-4000-8000-000000000711",revisionId="00000000-0000-4000-8000-000000000712";
async function enroll(){setOfflineCaptureEnabled(true);await setReplicaDeviceId("00000000-0000-4000-8000-000000000713");}
describe("note screen editor mode selection",()=>{
  beforeEach(async()=>{storage.clear();await clearOfflineReplica();vi.mocked(api.noteDocument).mockReset();});
  it("requires both trust and local enrollment before opening a shared session",async()=>{
    expect(await openManagedNoteSession(noteId,1)).toBeUndefined();
    setOfflineCaptureEnabled(true);
    expect(await openManagedNoteSession(noteId,1)).toBeUndefined();
    expect(api.noteDocument).not.toHaveBeenCalled();
  });
  it("keeps unmigrated notes in legacy mode without initializing a shared fragment",async()=>{
    await enroll();const doc=new Y.Doc();doc.getText("content").insert(0,"Legacy");
    vi.mocked(api.noteDocument).mockResolvedValue({format:"yjs_update",content:encodeNoteUpdate(Y.encodeStateAsUpdate(doc)),revisionId,sourceMap:[]});
    expect(await openManagedNoteSession(noteId,1)).toBeUndefined();
    expect(doc.share.has("prosemirror")).toBe(false);doc.destroy();
  });
  it("opens an existing shared fragment on an enrolled trusted replica",async()=>{
    await enroll();const doc=new Y.Doc();doc.getXmlFragment("prosemirror").insert(0,[new Y.XmlElement("paragraph")]);
    vi.mocked(api.noteDocument).mockResolvedValue({format:"yjs_update",content:encodeNoteUpdate(Y.encodeStateAsUpdate(doc)),revisionId,sourceMap:[]});
    const session=await openManagedNoteSession(noteId,1);
    expect(session?.document.share.has("prosemirror")).toBe(true);session!.close();doc.destroy();
  });
  it("propagates loading failures instead of silently enabling replacement edits",async()=>{
    await enroll();vi.mocked(api.noteDocument).mockRejectedValue(new Error("offline"));
    await expect(openManagedNoteSession(noteId,1)).rejects.toThrow("offline");
  });
});
