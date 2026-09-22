import { useEffect, useRef, useState } from "react";
import { editorDocumentSchema, type EditorDocument } from "@sorta/contracts";
import { EditorContent, useEditor } from "@tiptap/react";
import { richEditorExtensions } from "./rich-editor-extensions";
import { registerEditorNavigation } from "./editor-navigation";
import { ApiError } from "./api";
import { type CalloutKind } from "./Callout";
import type { RichNoteSession } from "./rich-note-session";

export default function RichDocumentEditor({ initialDocument, disabled, onSave, session, onLocalSaved }: { initialDocument: EditorDocument; disabled: boolean; onSave: (document: EditorDocument) => Promise<void>; session?: RichNoteSession; onLocalSaved?:()=>void }) {
  const [editVersion, setEditVersion] = useState(0);
  const receivedDocument = useRef(initialDocument);
  const revisionConflict = useRef(false);
  const [dirty,setDirty]=useState(false);const [saving,setSaving]=useState(false);const [error,setError]=useState<string|null>(null);const changeVersion=useRef(0);const savedSignature=useRef(JSON.stringify(initialDocument));const savingRef=useRef(false);
  const editor=useEditor({extensions:richEditorExtensions(session?.document),content:session?undefined:initialDocument,editorProps:{attributes:{class:"tiptap-document","aria-label":"Rich note editor"}},onUpdate:()=>{if(session)return;changeVersion.current+=1;setDirty(true);setError(null);}},[session]);

  async function save(){
    if(!editor||savingRef.current||disabled)return;
    if(!session&&revisionConflict.current){setError("A different revision was loaded. Copy your unsaved text and reopen the note before saving.");return;}
    const parsed=editorDocumentSchema.safeParse(editor.getJSON());
    if(!parsed.success){setError("This document contains an unsupported block or attribute.");return;}
    const signature=JSON.stringify(parsed.data);
    if(!session&&signature===savedSignature.current){setDirty(false);return;}
    const version=changeVersion.current;
    savingRef.current=true;setSaving(true);setError(null);
    try{
      if(session){
        await session.persist();
        setDirty(session.hasUnsavedChanges);
        onLocalSaved?.();
      }else{
        await onSave(parsed.data);
        savedSignature.current=JSON.stringify(editorDocumentSchema.parse(parsed.data));
        if(changeVersion.current===version)setDirty(false);
      }
    }catch(caught){
      setError(session?"Local save failed. Your changes remain in this editor; retry before leaving.":caught instanceof ApiError&&caught.code==="stale_revision"?"This note changed elsewhere. Copy any unsaved text, then reopen the latest revision.":"Autosave failed. Your changes remain in this editor.");
    }finally{savingRef.current=false;setSaving(false);}
  }
  useEffect(() => {
    if (!editor) return;
    if(changeVersion.current===0)savedSignature.current=JSON.stringify(editor.getJSON());
    return registerEditorNavigation(() => ({
      saving: savingRef.current,
      canDiscard: !session,
      dirty: session ? session.hasUnsavedChanges : JSON.stringify(editor.getJSON()) !== savedSignature.current
    }));
  }, [editor, session]);
  useEffect(() => {
    if(!session)return;
    const changed=()=>{setDirty(session.hasUnsavedChanges);setEditVersion(version=>version+1);};
    changed();
    return session.subscribe(changed);
  }, [session]);
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);
  useEffect(() => {
    if (session || !editor || receivedDocument.current === initialDocument) return;
    receivedDocument.current = initialDocument;
    if (dirty || savingRef.current) {
      revisionConflict.current = true;
      setError("A different revision was loaded. Your unsaved text is preserved here; copy it before reopening the note.");
      return;
    }
    editor.commands.setContent(initialDocument, { emitUpdate: false });
    savedSignature.current = JSON.stringify(editor.getJSON());
    setError(null);
  }, [editor, initialDocument, dirty, session]);
  useEffect(() => {
    if (!editor) return;
    const changed = () => setEditVersion(version => version + 1);
    editor.on("update", changed);
    return () => { editor.off("update", changed); };
  }, [editor]);
  useEffect(()=>{if(!dirty||saving||disabled||error)return;const timer=window.setTimeout(()=>void save(),1_500);return()=>window.clearTimeout(timer);},[dirty,saving,disabled,error,editor,editVersion]);
  useEffect(() => {
    if (!dirty && !saving) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [dirty, saving]);
  if(!editor)return <div className="editor-loading">Opening rich document…</div>;

  function setLink(){const current=String(editor!.getAttributes("link").href??"");const href=window.prompt("Link URL (https://, http://, mailto:, or /internal-path)",current);if(href===null)return;if(!href){editor!.chain().focus().extendMarkRange("link").unsetLink().run();return;}if(!/^(https?:\/\/|mailto:|\/(?!\/))/i.test(href)){setError("Only HTTP(S), mailto, and root-relative links are allowed.");return;}editor!.chain().focus().extendMarkRange("link").setLink({href}).run();}
  function toggleCallout(kind:CalloutKind){if(editor!.isActive("callout",{kind}))editor!.chain().focus().lift("callout").run();else if(editor!.isActive("callout"))editor!.chain().focus().updateAttributes("callout",{kind}).run();else editor!.chain().focus().toggleWrap("callout",{kind}).run();}
  const button=(label:string,action:()=>void,active=false,enabled=true)=><button type="button" className={active?"active":""} disabled={!enabled||disabled} onClick={action}>{label}</button>;
  return <div className="rich-editor"><div className="rich-editor-toolbar" role="toolbar" aria-label="Document formatting">{button("Undo",()=>editor.chain().focus().undo().run(),false,editor.can().undo())}{button("Redo",()=>editor.chain().focus().redo().run(),false,editor.can().redo())}<span/>{button("B",()=>editor.chain().focus().toggleBold().run(),editor.isActive("bold"))}{button("I",()=>editor.chain().focus().toggleItalic().run(),editor.isActive("italic"))}{button("Strike",()=>editor.chain().focus().toggleStrike().run(),editor.isActive("strike"))}{button("Code",()=>editor.chain().focus().toggleCode().run(),editor.isActive("code"))}{button("Link",setLink,editor.isActive("link"))}<span/>{button("H1",()=>editor.chain().focus().toggleHeading({level:1}).run(),editor.isActive("heading",{level:1}))}{button("H2",()=>editor.chain().focus().toggleHeading({level:2}).run(),editor.isActive("heading",{level:2}))}{button("Bullets",()=>editor.chain().focus().toggleBulletList().run(),editor.isActive("bulletList"))}{button("Numbers",()=>editor.chain().focus().toggleOrderedList().run(),editor.isActive("orderedList"))}{button("Checklist",()=>editor.chain().focus().toggleTaskList().run(),editor.isActive("taskList"))}{button("Quote",()=>editor.chain().focus().toggleBlockquote().run(),editor.isActive("blockquote"))}{button("Info",()=>toggleCallout("info"),editor.isActive("callout",{kind:"info"}))}{button("Tip",()=>toggleCallout("tip"),editor.isActive("callout",{kind:"tip"}))}{button("Warning",()=>toggleCallout("warning"),editor.isActive("callout",{kind:"warning"}))}{button("Code block",()=>editor.chain().focus().toggleCodeBlock().run(),editor.isActive("codeBlock"))}{button("Table",()=>editor.chain().focus().insertTable({rows:3,cols:3,withHeaderRow:true}).run())}<button type="button" className="save-state" disabled={!dirty||saving||disabled} onClick={()=>void save()}>{saving?"Saving…":dirty?"Save now":session?"Saved locally":"Saved"}</button></div><EditorContent editor={editor}/>{error&&<p className="form-error">{error}</p>}<div className="autosave-state" aria-live="polite">{saving?(session?"Saving on this device…":"Saving immutable revision…"):dirty?"Unsaved changes · autosaves after 1.5 seconds":session?"Saved on this device · server sync is separate":"All changes saved"}</div></div>;
}
