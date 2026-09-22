import "fake-indexeddb/auto";
import * as Y from "yjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RichNoteSession, encodeNoteUpdate } from "./rich-note-session";
import { clearOfflineReplica, localNoteDraft, pendingSyncOperations, setOfflineCaptureEnabled } from "./offline-queue";

const storage=new Map<string,string>();
Object.defineProperty(globalThis,"localStorage",{value:{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value)}});
const noteId="00000000-0000-4000-8000-000000000611";
const revisionId="00000000-0000-4000-8000-000000000612";
function baseline(){
  const doc=new Y.Doc();
  const paragraph=new Y.XmlElement("paragraph"),text=new Y.XmlText();
  paragraph.insert(0,[text]);doc.getXmlFragment("prosemirror").insert(0,[paragraph]);text.insert(0,"Hello");
  const snapshot={noteId,revisionId,updateBase64:encodeNoteUpdate(Y.encodeStateAsUpdate(doc))};
  doc.destroy();return snapshot;
}
function text(doc:Y.Doc){return (doc.getXmlFragment("prosemirror").get(0) as Y.XmlElement).get(0) as Y.XmlText;}
describe("durable rich note session",()=>{
  beforeEach(async()=>{storage.clear();await clearOfflineReplica();setOfflineCaptureEnabled(true);});
  it("persists real Yjs edits and restores them without queuing initialization",async()=>{
    const snapshot=baseline(),session=await RichNoteSession.open(snapshot,1);
    expect(session.hasUnsavedChanges).toBe(false);
    text(session.document).insert(5," offline");
    expect(()=>session.close()).toThrow("Persist");
    await session.persist();
    expect(session.hasUnsavedChanges).toBe(false);
    expect(await pendingSyncOperations()).toHaveLength(1);
    session.close();
    const reopened=await RichNoteSession.open(snapshot,1);
    expect(text(reopened.document).toString()).toBe("Hello offline");
    await reopened.persist();
    expect(await pendingSyncOperations()).toHaveLength(1);
    reopened.close();
  });
  it("does not echo remote updates into the outgoing queue",async()=>{
    const snapshot=baseline(),session=await RichNoteSession.open(snapshot,1);
    const remote=new Y.Doc();Y.applyUpdate(remote,Uint8Array.from(atob(snapshot.updateBase64),c=>c.charCodeAt(0)));
    text(remote).format(0,5,{bold:{}});
    session.applyRemote(encodeNoteUpdate(Y.encodeStateAsUpdate(remote)));
    expect(session.hasUnsavedChanges).toBe(false);
    await session.persist();expect(await pendingSyncOperations()).toEqual([]);
    remote.destroy();session.close();
  });
  it("retains failed edits for retry and serializes overlapping persistence calls",async()=>{
    const session=await RichNoteSession.open(baseline(),1);
    text(session.document).insert(5," retry");
    const spy=vi.spyOn(IDBObjectStore.prototype,"put").mockImplementationOnce(()=>{throw new Error("disk full");});
    const first=session.persist();expect(session.persist()).toBe(first);
    await expect(first).rejects.toThrow("disk full");spy.mockRestore();
    expect(session.hasUnsavedChanges).toBe(true);
    expect(await localNoteDraft(noteId)).toBeNull();
    text(session.document).insert(11," later");
    await session.persist();
    expect(await pendingSyncOperations()).toHaveLength(2);
    session.close();
  });
  it("rejects unmigrated histories instead of initializing a divergent fragment",async()=>{
    const doc=new Y.Doc();doc.getText("content").insert(0,"Legacy");
    await expect(RichNoteSession.open({noteId,revisionId,updateBase64:encodeNoteUpdate(Y.encodeStateAsUpdate(doc))},1)).rejects.toThrow("migration");
    doc.destroy();
  });
});
