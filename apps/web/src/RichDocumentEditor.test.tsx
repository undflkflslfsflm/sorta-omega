// @vitest-environment jsdom
import "fake-indexeddb/auto";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { Editor } from "@tiptap/core";
import * as Y from "yjs";
import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import RichDocumentEditor from "./RichDocumentEditor";
import { RichNoteSession,encodeNoteUpdate } from "./rich-note-session";
import { clearOfflineReplica,pendingSyncOperations,setOfflineCaptureEnabled } from "./offline-queue";
import { allowEditorNavigation } from "./editor-navigation";

const initial={type:"doc" as const,content:[{type:"paragraph" as const,content:[{type:"text" as const,text:"Start"}]}]};
let root:Root,element:HTMLDivElement;
async function settle(assertion:()=>void){
  await vi.waitFor(async()=>{await act(async()=>{await new Promise(resolve=>setTimeout(resolve,0));});assertion();});
}
function editor(){return (element.querySelector(".tiptap") as HTMLElement&{editor:Editor}).editor;}
function saveButton(){return element.querySelector(".save-state") as HTMLButtonElement;}
beforeEach(async()=>{
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT",true);
  localStorage.clear();await clearOfflineReplica();setOfflineCaptureEnabled(true);
  element=document.createElement("div");document.body.append(element);root=createRoot(element);
});
afterEach(async()=>{await act(async()=>root.unmount());element.remove();vi.restoreAllMocks();vi.unstubAllGlobals();});

describe("React note editor save lifecycle",()=>{
  it("preserves unsaved text when a newer legacy revision arrives",async()=>{
    const onSave=vi.fn();
    await act(async()=>root.render(<RichDocumentEditor initialDocument={initial} disabled={false} onSave={onSave}/>));
    await settle(()=>expect(element.querySelector(".tiptap")).not.toBeNull());
    await act(async()=>editor().commands.insertContent("Local "));
    const updated={...initial,content:[{type:"paragraph" as const,content:[{type:"text" as const,text:"Remote replacement"}]}]};
    await act(async()=>root.render(<RichDocumentEditor initialDocument={updated} disabled={false} onSave={onSave}/>));
    expect(editor().getText()).toContain("Local");
    expect(editor().getText()).not.toContain("Remote replacement");
    expect(element.textContent).toContain("Your unsaved text is preserved");
    await act(async()=>saveButton().click());
    expect(onSave).not.toHaveBeenCalled();
  });

  it("disables the actual editor and save controls while access is blocked",async()=>{
    const onSave=vi.fn();
    await act(async()=>root.render(<RichDocumentEditor initialDocument={initial} disabled={false} onSave={onSave}/>));
    await settle(()=>expect(element.querySelector(".tiptap")).not.toBeNull());
    await act(async()=>editor().commands.insertContent("Keep "));
    await act(async()=>root.render(<RichDocumentEditor initialDocument={initial} disabled={true} onSave={onSave}/>));
    expect(editor().isEditable).toBe(false);
    expect(element.querySelector(".tiptap")?.getAttribute("contenteditable")).toBe("false");
    expect(saveButton().disabled).toBe(true);
    await act(async()=>saveButton().click());
    expect(onSave).not.toHaveBeenCalled();
    expect(editor().getText()).toContain("Keep");
  });
  it("keeps newer edits dirty when an earlier legacy save finishes",async()=>{
    let finish!:()=>void;
    const onSave=vi.fn(()=>new Promise<void>(resolve=>{finish=resolve;}));
    await act(async()=>root.render(<RichDocumentEditor initialDocument={initial} disabled={false} onSave={onSave}/>));
    await settle(()=>expect(element.querySelector(".tiptap")).not.toBeNull());
    await act(async()=>editor().commands.insertContent("First "));
    await act(async()=>saveButton().click());
    expect(onSave).toHaveBeenCalledOnce();
    const alert=vi.spyOn(window,"alert").mockImplementation(()=>{});
    expect(allowEditorNavigation()).toBe(false);
    expect(alert).toHaveBeenCalledOnce();
    await act(async()=>editor().commands.insertContent("Second "));
    await act(async()=>finish());
    expect(saveButton().textContent).toBe("Save now");
    expect(element.textContent).toContain("Unsaved changes");
  });

  it("keeps a failed shared save dirty and reports local success only after retry",async()=>{
    const doc=new Y.Doc(),paragraph=new Y.XmlElement("paragraph"),text=new Y.XmlText();
    paragraph.insert(0,[text]);doc.getXmlFragment("prosemirror").insert(0,[paragraph]);text.insert(0,"Start");
    const session=await RichNoteSession.open({noteId:"00000000-0000-4000-8000-000000001011",revisionId:"00000000-0000-4000-8000-000000001012",updateBase64:encodeNoteUpdate(Y.encodeStateAsUpdate(doc))},1);
    doc.destroy();const onSave=vi.fn(),onLocalSaved=vi.fn();
    await act(async()=>root.render(<RichDocumentEditor initialDocument={initial} disabled={false} onSave={onSave} session={session} onLocalSaved={onLocalSaved}/>));
    await settle(()=>expect(element.querySelector(".tiptap")).not.toBeNull());
    await act(async()=>editor().commands.insertContent("Offline "));
    const write=vi.spyOn(IDBObjectStore.prototype,"put").mockImplementationOnce(()=>{throw new Error("disk full");});
    await act(async()=>{saveButton().click();await session.persist().catch(()=>{});});
    await settle(()=>expect(element.textContent).toContain("Local save failed"));
    write.mockRestore();
    expect(onSave).not.toHaveBeenCalled();expect(onLocalSaved).not.toHaveBeenCalled();
    expect(await pendingSyncOperations()).toEqual([]);
    vi.spyOn(window,"alert").mockImplementation(()=>{});
    expect(allowEditorNavigation()).toBe(false);
    await act(async()=>{saveButton().click();await session.persist();});
    await settle(()=>expect(saveButton().textContent).toBe("Saved locally"));
    expect(onLocalSaved).toHaveBeenCalledOnce();expect(await pendingSyncOperations()).toHaveLength(1);
    expect(allowEditorNavigation()).toBe(true);
    await act(async()=>root.render(null));
    await session.persist();session.close();
  });
});
