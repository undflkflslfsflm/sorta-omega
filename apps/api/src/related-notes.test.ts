import {describe,expect,it} from "vitest";
import {rankRelatedNotes} from "./related-notes.js";

describe("related-note suggestions",()=>{it("keeps deterministic similarity separate from confirmation",()=>{const ranked=rankRelatedNotes(["a","b"],[{noteId:"2",title:"Broader",labelIds:["a","b","c"]},{noteId:"1",title:"Exact",labelIds:["a","b"]},{noteId:"3",title:"Unrelated",labelIds:["c"]}],10);expect(ranked.map(item=>item.noteId)).toEqual(["1","2"]);expect(ranked[0]).toMatchObject({score:1,reasonCodes:["shared_label"],sharedLabelIds:["a","b"]});});});
