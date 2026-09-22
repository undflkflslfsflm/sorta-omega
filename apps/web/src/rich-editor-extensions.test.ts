import { getSchema } from "@tiptap/core";
import * as Y from "yjs";
import { describe,expect,it } from "vitest";
import { richEditorExtensions } from "./rich-editor-extensions";
import { editorDocumentSchema } from "@sorta/contracts";

describe("shared editor schema",()=>{
  it("accepts nullable link titles without allowing unsafe URLs or event attributes",()=>{
    const document=(attrs:Record<string,unknown>)=>({type:"doc",content:[{type:"paragraph",content:[{type:"text",text:"Link",marks:[{type:"link",attrs}]}]}]});
    for(const title of [null,"A descriptive title"]){
      expect(editorDocumentSchema.safeParse(document({href:"https://example.com",title})).success).toBe(true);
    }
    for(const attrs of [{href:"javascript:alert(1)",title:null},{href:"https://example.com",onclick:"alert(1)"},{href:"https://example.com",title:42}]){
      expect(editorDocumentSchema.safeParse(document(attrs)).success).toBe(false);
    }
  });
  it("accepts supported table alignment but rejects arbitrary style values",()=>{
    const schema=getSchema(richEditorExtensions());
    for(const name of ["tableCell","tableHeader"]){
      for(const align of [null,"left","center","right"]){
        const node=schema.nodes[name].createAndFill({align})!;
        expect(editorDocumentSchema.safeParse({type:"doc",content:[node.toJSON()]}).success).toBe(true);
      }
      for(const align of ["justify","left; color:red",1,true,[1]]){
        expect(editorDocumentSchema.safeParse({type:"doc",content:[{type:name,attrs:{align}}]}).success).toBe(false);
      }
    }
  });
  it("accepts real editor defaults for every supported block and mark at the API boundary",()=>{
    const schema=getSchema(richEditorExtensions());
    for(const [name,type] of Object.entries(schema.nodes)){
      if(name==="doc"||name==="text")continue;
      const node=type.createAndFill();
      expect(node,`${name} must support its normal editor defaults`).not.toBeNull();
      const parsed=editorDocumentSchema.safeParse({type:"doc",content:[node!.toJSON()]});
      expect(parsed.success,`${name}: ${parsed.success?"":parsed.error.message}`).toBe(true);
    }
    for(const [name,type] of Object.entries(schema.marks)){
      const mark=type.create(name==="link"?{href:"https://example.com"}:undefined);
      const paragraph=schema.nodes.paragraph.create(null,schema.text("Marked text",[mark]));
      const parsed=editorDocumentSchema.safeParse({type:"doc",content:[paragraph.toJSON()]});
      expect(parsed.success,`${name}: ${JSON.stringify(paragraph.toJSON())} ${parsed.success?"":parsed.error.message}`).toBe(true);
    }
  });
  it("uses the same block and mark schema for legacy and shared documents",()=>{
    const doc=new Y.Doc();doc.getXmlFragment("prosemirror");
    const legacy=getSchema(richEditorExtensions()),rich=getSchema(richEditorExtensions(doc));
    expect(Object.keys(rich.nodes)).toEqual(Object.keys(legacy.nodes));
    expect(Object.keys(rich.marks)).toEqual(Object.keys(legacy.marks));
    for(const name of ["callout","taskList","taskItem","table","tableRow","tableCell"])expect(rich.nodes[name]).toBeDefined();
    const extensions=richEditorExtensions(doc);
    expect(extensions.find(extension=>extension.name==="starterKit")?.options.undoRedo).toBe(false);
    expect(extensions.find(extension=>extension.name==="collaboration")?.options.field).toBe("prosemirror");
    doc.destroy();
  });
  it("does not initialize a missing shared document",()=>{
    const doc=new Y.Doc();expect(()=>richEditorExtensions(doc)).toThrow("migration");
    expect(doc.share.has("prosemirror")).toBe(false);doc.destroy();
  });
});
