import { useEffect, useRef, useState } from "react";
import { editorDocumentSchema, type EditorDocument } from "@sorta/contracts";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TableKit } from "@tiptap/extension-table";
import Placeholder from "@tiptap/extension-placeholder";
import { ApiError } from "./api";
import { Callout, type CalloutKind } from "./Callout";

export default function RichDocumentEditor({ initialDocument, disabled, onSave }: { initialDocument: EditorDocument; disabled: boolean; onSave: (document: EditorDocument) => Promise<void> }) {
  const [editVersion, setEditVersion] = useState(0);
  const [dirty,setDirty]=useState(false);const [saving,setSaving]=useState(false);const [error,setError]=useState<string|null>(null);const changeVersion=useRef(0);const savedSignature=useRef(JSON.stringify(initialDocument));const savingRef=useRef(false);
  const editor=useEditor({extensions:[StarterKit.configure({underline:false,link:{openOnClick:false,autolink:true,linkOnPaste:true,protocols:["http","https","mailto"]}}),TaskList,TaskItem.configure({nested:true}),TableKit.configure({table:{resizable:true}}),Callout,Placeholder.configure({placeholder:"Write something worth finding again…"})],content:initialDocument,editorProps:{attributes:{class:"tiptap-document","aria-label":"Rich note editor"}},onUpdate:()=>{changeVersion.current+=1;setDirty(true);setError(null);}});

  async function save(){if(!editor||savingRef.current)return;const parsed=editorDocumentSchema.safeParse(editor.getJSON());if(!parsed.success){setError("This document contains an unsupported block or attribute.");return;}const signature=JSON.stringify(parsed.data);if(signature===savedSignature.current){setDirty(false);return;}const version=changeVersion.current;savingRef.current=true;setSaving(true);setError(null);try{await onSave(parsed.data);savedSignature.current=signature;if(changeVersion.current===version)setDirty(false);}catch(caught){setError(caught instanceof ApiError&&caught.code==="stale_revision"?"This note changed elsewhere. Copy any unsaved text, then reopen the latest revision.":"Autosave failed. Your changes remain in this editor.");}finally{savingRef.current=false;setSaving(false);}}
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);
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
  return <div className="rich-editor"><div className="rich-editor-toolbar" role="toolbar" aria-label="Document formatting">{button("Undo",()=>editor.chain().focus().undo().run(),false,editor.can().undo())}{button("Redo",()=>editor.chain().focus().redo().run(),false,editor.can().redo())}<span/>{button("B",()=>editor.chain().focus().toggleBold().run(),editor.isActive("bold"))}{button("I",()=>editor.chain().focus().toggleItalic().run(),editor.isActive("italic"))}{button("Strike",()=>editor.chain().focus().toggleStrike().run(),editor.isActive("strike"))}{button("Code",()=>editor.chain().focus().toggleCode().run(),editor.isActive("code"))}{button("Link",setLink,editor.isActive("link"))}<span/>{button("H1",()=>editor.chain().focus().toggleHeading({level:1}).run(),editor.isActive("heading",{level:1}))}{button("H2",()=>editor.chain().focus().toggleHeading({level:2}).run(),editor.isActive("heading",{level:2}))}{button("Bullets",()=>editor.chain().focus().toggleBulletList().run(),editor.isActive("bulletList"))}{button("Numbers",()=>editor.chain().focus().toggleOrderedList().run(),editor.isActive("orderedList"))}{button("Checklist",()=>editor.chain().focus().toggleTaskList().run(),editor.isActive("taskList"))}{button("Quote",()=>editor.chain().focus().toggleBlockquote().run(),editor.isActive("blockquote"))}{button("Info",()=>toggleCallout("info"),editor.isActive("callout",{kind:"info"}))}{button("Tip",()=>toggleCallout("tip"),editor.isActive("callout",{kind:"tip"}))}{button("Warning",()=>toggleCallout("warning"),editor.isActive("callout",{kind:"warning"}))}{button("Code block",()=>editor.chain().focus().toggleCodeBlock().run(),editor.isActive("codeBlock"))}{button("Table",()=>editor.chain().focus().insertTable({rows:3,cols:3,withHeaderRow:true}).run())}<button type="button" className="save-state" disabled={!dirty||saving||disabled} onClick={()=>void save()}>{saving?"Saving…":dirty?"Save now":"Saved"}</button></div><EditorContent editor={editor}/>{error&&<p className="form-error">{error}</p>}<div className="autosave-state" aria-live="polite">{saving?"Saving immutable revision…":dirty?"Unsaved changes · autosaves after 1.5 seconds":"All changes saved"}</div></div>;
}
