import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TableKit } from "@tiptap/extension-table";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import type * as Y from "yjs";
import { Callout } from "./Callout";

export function richEditorExtensions(document?:Y.Doc){
  if(document&&!document.share.has("prosemirror"))throw new Error("Note requires server rich-text migration");
  return [
    StarterKit.configure({...(document?{undoRedo:false as const}:{}),underline:false,
      link:{openOnClick:false,autolink:true,linkOnPaste:true,defaultProtocol:"https",
        isAllowedUri:(url,context)=>context.defaultValidate(url)&&/^(https?:\/\/|mailto:|\/(?!\/))/i.test(url)}}),
    TaskList,TaskItem.configure({nested:true}),TableKit.configure({table:{resizable:true}}),Callout,
    Placeholder.configure({placeholder:"Write something worth finding again…"}),
    ...(document?[Collaboration.configure({document,field:"prosemirror"})]:[])
  ];
}
