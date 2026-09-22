// @vitest-environment jsdom
import "fake-indexeddb/auto";
import { Editor } from "@tiptap/core";
import * as Y from "yjs";
import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { editorDocumentSchema } from "@sorta/contracts";
import { richEditorExtensions,sharedEditorContent } from "./rich-editor-extensions";
import { RichNoteSession,encodeNoteUpdate } from "./rich-note-session";
import { clearOfflineReplica,pendingSyncOperations,setOfflineCaptureEnabled } from "./offline-queue";

function snapshot(){
  const document=new Y.Doc(),paragraph=new Y.XmlElement("paragraph"),text=new Y.XmlText();
  paragraph.insert(0,[text]);document.getXmlFragment("prosemirror").insert(0,[paragraph]);text.insert(0,"Start");
  const result={noteId:"00000000-0000-4000-8000-000000000811",revisionId:"00000000-0000-4000-8000-000000000812",updateBase64:encodeNoteUpdate(Y.encodeStateAsUpdate(document))};
  document.destroy();return result;
}
function mount(session:RichNoteSession){
  const element=document.createElement("div");document.body.append(element);
  const editor=new Editor({element,extensions:richEditorExtensions(session.document),content:sharedEditorContent(session.document)});
  return {editor,element};
}
async function close(session:RichNoteSession,editor:Editor,element:HTMLElement){
  editor.destroy();await session.persist();session.close();element.remove();
}
describe("mounted Tiptap shared note",()=>{
  afterEach(()=>vi.restoreAllMocks());
  beforeEach(async()=>{localStorage.clear();await clearOfflineReplica();setOfflineCaptureEnabled(true);});

  it("rejects unsupported links before they can poison a saved document",async()=>{
    const session=await RichNoteSession.open(snapshot(),1),{editor,element}=mount(session);
    editor.commands.setTextSelection({from:1,to:6});
    for(const href of ["javascript:alert(1)","ftp://example.com/file","//example.com"]){
      expect(editor.commands.setLink({href})).toBe(false);
    }
    expect(editor.commands.setLink({href:"https://example.com"})).toBe(true);
    expect(element.querySelector("a")?.getAttribute("href")).toBe("https://example.com");
    expect(editorDocumentSchema.safeParse(editor.getJSON()).success).toBe(true);
    await close(session,editor,element);
  });

  it("renders remote typing without creating a new outgoing edit",async()=>{
    const initial=snapshot(),session=await RichNoteSession.open(initial,1),{editor,element}=mount(session);
    await session.persist();
    const queuedBefore=(await pendingSyncOperations()).length;
    const remote=new Y.Doc();Y.applyUpdate(remote,Uint8Array.from(atob(initial.updateBase64),c=>c.charCodeAt(0)));
    const text=(remote.getXmlFragment("prosemirror").get(0) as Y.XmlElement).get(0) as Y.XmlText;
    text.insert(5," remote");
    session.applyRemote(encodeNoteUpdate(Y.encodeStateAsUpdate(remote)));
    expect(editor.getText()).toBe("Start remote");
    expect(element.textContent).toContain("Start remote");
    expect(session.hasUnsavedChanges).toBe(false);
    await session.persist();expect(await pendingSyncOperations()).toHaveLength(queuedBefore);
    remote.destroy();await close(session,editor,element);
  });

  it("renders the canonical fragment and persists real formatting and typing across reload",async()=>{
    const initial=snapshot(),session=await RichNoteSession.open(initial,1);
    const {editor,element}=mount(session);
    expect(editor.getText()).toBe("Start");
    expect(element.textContent).toContain("Start");
    editor.commands.setTextSelection({from:1,to:6});
    editor.commands.toggleBold();
    editor.commands.setTextSelection(6);
    editor.commands.insertContent(" edited");
    expect(element.querySelector("strong")?.textContent).toContain("Start");
    const expected=editorDocumentSchema.parse(editor.getJSON());
    expect(session.hasUnsavedChanges).toBe(true);
    await session.persist();
    expect(await pendingSyncOperations()).toHaveLength(1);
    await close(session,editor,element);
    const reopened=await RichNoteSession.open(initial,1),next=mount(reopened);
    expect(next.editor.getJSON()).toEqual(expected);
    expect(next.element.querySelector("strong")?.textContent).toContain("Start");
    await close(reopened,next.editor,next.element);
  });

  it("keeps table, checklist and callout content through the actual binding and reload",async()=>{
    const warnings=vi.spyOn(console,"warn");
    const initial=snapshot(),session=await RichNoteSession.open(initial,1),{editor,element}=mount(session);
    editor.commands.insertContent([
      {type:"table",content:[{type:"tableRow",content:[{type:"tableHeader",attrs:{align:"center"},content:[{type:"paragraph",content:[{type:"text",text:"Header"}]}]},{type:"tableCell",content:[{type:"paragraph",content:[{type:"text",text:"Value"}]}]}]}]},
      {type:"taskList",content:[{type:"taskItem",attrs:{checked:true},content:[{type:"paragraph",content:[{type:"text",text:"Done"}]}]}]},
      {type:"callout",attrs:{kind:"warning"},content:[{type:"paragraph",content:[{type:"text",text:"Remember"}]}]}
    ],{updateSelection:false});
    const expected=editorDocumentSchema.parse(editor.getJSON());
    expect(element.querySelector("table")).not.toBeNull();
    expect(element.querySelector('input[type="checkbox"]')).not.toBeNull();
    await session.persist();await close(session,editor,element);
    const reopened=await RichNoteSession.open(initial,1);
    const beforeMount=Y.encodeStateAsUpdate(reopened.document);
    const next=mount(reopened);
    expect(next.editor.getJSON()).toEqual(expected);
    expect(next.element.textContent).toContain("Remember");
    expect(Y.encodeStateAsUpdate(reopened.document)).toEqual(beforeMount);
    expect(reopened.hasUnsavedChanges).toBe(false);
    expect(next.editor.state.selection.$from.parent.inlineContent).toBe(true);
    expect(warnings.mock.calls.flat().join(" ")).not.toContain("TextSelection endpoint");
    await close(reopened,next.editor,next.element);
  });
});
