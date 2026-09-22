import "fake-indexeddb/auto";
import { beforeEach,describe,expect,it,vi } from "vitest";
import type { Note } from "@sorta/contracts";
import { api,ApiError } from "./api";
import { cacheCoreRecords,cachedNoteAccessBlocked,clearOfflineReplica,setCachedNoteAccessBlocked,setOfflineCaptureEnabled,setReplicaDeviceId } from "./offline-queue";
import { openSearchNote } from "./open-search-note";

const storage=new Map<string,string>();
Object.defineProperty(globalThis,"localStorage",{value:{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value)}});
const id="00000000-0000-4000-8000-000000000511";
const note={id,title:"Cached note",body:"Cached body",revision:1} as Note;
describe("search note resolution",()=>{
  beforeEach(async()=>{
    vi.restoreAllMocks();storage.clear();await clearOfflineReplica();
    setOfflineCaptureEnabled(true);await setReplicaDeviceId(id);
    await cacheCoreRecords({notes:[note],tasks:[],events:[]});
  });
  it("opens server results absent from the current cache/list",async()=>{
    await clearOfflineReplica();
    const fresh={...note,title:"Server-only result",revision:4};
    vi.spyOn(api,"note").mockResolvedValue(fresh);
    expect(await openSearchNote(id)).toEqual(fresh);
    expect(api.note).toHaveBeenCalledWith(id);
  });
  it("opens an enrolled cached result during network or service outage",async()=>{
    const request=vi.spyOn(api,"note").mockRejectedValue(new TypeError("offline"));
    expect(await openSearchNote(id)).toEqual(note);
    request.mockRejectedValue(new ApiError(503,"unavailable"));
    expect(await openSearchNote(id)).toEqual(note);
  });
  it("records denial and prevents a later outage from reviving the note",async()=>{
    const request=vi.spyOn(api,"note");
    for(const status of [401,403,404,410]){
      request.mockRejectedValue(new ApiError(status,"denied"));
      await expect(openSearchNote(id)).rejects.toMatchObject({status});
      expect(await cachedNoteAccessBlocked(id)).toBe(true);
      request.mockRejectedValue(new TypeError("offline"));
      await expect(openSearchNote(id)).rejects.toThrow("offline");
      await setCachedNoteAccessBlocked(id,false);
    }
  });
  it("does not let metadata success clear a canonical-document access block",async()=>{
    await setCachedNoteAccessBlocked(id,true);
    vi.spyOn(api,"note").mockResolvedValue(note);
    expect(await openSearchNote(id)).toEqual(note);
    expect(await cachedNoteAccessBlocked(id)).toBe(true);
  });
  it("does not fall back for malformed data or validation failures",async()=>{
    const request=vi.spyOn(api,"note");
    for(const error of [new SyntaxError("bad response"),new ApiError(422,"invalid")]){
      request.mockRejectedValue(error);
      await expect(openSearchNote(id)).rejects.toBe(error);
    }
  });
  it("requires trust, enrollment, and the requested record",async()=>{
    vi.spyOn(api,"note").mockRejectedValue(new TypeError("offline"));
    setOfflineCaptureEnabled(false);await expect(openSearchNote(id)).rejects.toThrow();
    setOfflineCaptureEnabled(true);await expect(openSearchNote("missing")).rejects.toThrow();
    await clearOfflineReplica();await cacheCoreRecords({notes:[note],tasks:[],events:[]});
    await expect(openSearchNote(id)).rejects.toThrow();
  });
});
