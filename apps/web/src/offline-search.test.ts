import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { searchResultSchema, type Note, type Task, type CalendarEvent } from "@sorta/contracts";
import { api, ApiError } from "./api";
import { cacheCoreRecords, clearOfflineReplica, setOfflineCaptureEnabled, setReplicaDeviceId, setCachedNoteAccessBlocked } from "./offline-queue";
import { searchCachedRecords, searchWithOfflineFallback } from "./offline-search";

const { readDocument } = vi.hoisted(()=>({readDocument:vi.fn(async()=>null as unknown)}));
vi.mock("./cached-shared-note",()=>({loadCachedNoteDocument:readDocument}));
const storage = new Map<string,string>();
Object.defineProperty(globalThis,"localStorage",{value:{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value)}});
const id="00000000-0000-4000-8000-000000000511";
const stamp="2026-09-22T00:00:00.000Z";
const note={id,title:"Norsk historie",body:"Les om demokrati",sourceId:null,revision:3,updatedAt:stamp} as Note;
const task={id,title:"Historie oppgave",revision:1,updatedAt:stamp} as Task;
const event={id,title:"Historie time",revision:2,createdAt:stamp,trashedAt:null} as CalendarEvent;

describe("trusted offline keyword search",()=>{
  beforeEach(async()=>{
    vi.restoreAllMocks(); storage.clear(); await clearOfflineReplica();
    readDocument.mockReset().mockResolvedValue(null);
    setOfflineCaptureEnabled(true);await setReplicaDeviceId(id);
    await cacheCoreRecords({notes:[note],tasks:[task],events:[event]});
  });
  it("matches all terms case-insensitively across title/body and returns valid deterministic results",async()=>{
    const found=await searchCachedRecords("NORSK demokrati");
    expect(found?.result.items.map(item=>item.kind)).toEqual(["note"]);
    expect(searchResultSchema.safeParse(found?.result).success).toBe(true);
    expect(found?.result.coverage.semanticAvailable).toBe(false);
    expect((await searchCachedRecords("historie"))?.result.items).toHaveLength(3);
    expect((await searchCachedRecords("   "))?.result.items).toEqual([]);
  });
  it("searches saved shared-document edits instead of stale note bodies",async()=>{
    readDocument.mockResolvedValue({type:"doc",content:[{type:"paragraph",content:[{type:"text",text:"Ny lokal tekst"}]}]});
    expect((await searchCachedRecords("lokal"))?.result.items[0].excerpt).toContain("Ny lokal tekst");
    expect((await searchCachedRecords("demokrati"))?.result.items).toEqual([]);
  });
  it("excludes access-denied notes and trashed events",async()=>{
    await setCachedNoteAccessBlocked(id,true);
    await cacheCoreRecords({notes:[note],tasks:[],events:[{...event,trashedAt:stamp}]});
    expect((await searchCachedRecords("historie"))?.result.items).toEqual([]);
    expect(readDocument).not.toHaveBeenCalled();
  });
  it("requires trust, enrollment, and cached records",async()=>{
    setOfflineCaptureEnabled(false);expect(await searchCachedRecords("historie")).toBeNull();
    setOfflineCaptureEnabled(true);await clearOfflineReplica();
    expect(await searchCachedRecords("historie")).toBeNull();
    await setReplicaDeviceId(id);expect(await searchCachedRecords("historie")).toBeNull();
  });
  it("falls back only for lexical network/server failures, never auth/validation/AI modes",async()=>{
    const search=vi.spyOn(api,"search").mockRejectedValue(new TypeError("offline"));
    expect((await searchWithOfflineFallback("historie","lexical")).cachedAt).toBeTruthy();
    for(const status of [401,403,404,409,422]){
      const error=new ApiError(status,"denied");search.mockRejectedValue(error);
      await expect(searchWithOfflineFallback("historie","lexical")).rejects.toBe(error);
    }
    search.mockRejectedValue(new ApiError(503,"unavailable"));
    expect((await searchWithOfflineFallback("historie","lexical")).cachedAt).toBeTruthy();
    for(const mode of ["hybrid","semantic"] as const)await expect(searchWithOfflineFallback("historie",mode)).rejects.toThrow();
    search.mockRejectedValue(new SyntaxError("invalid response"));
    await expect(searchWithOfflineFallback("historie","lexical")).rejects.toThrow("invalid response");
  });
  it("does not replace successful server results with local ones",async()=>{
    const response={mode:"lexical" as const,query:"historie",items:[],coverage:{kinds:[],semanticAvailable:false},nextCursor:null};
    vi.spyOn(api,"search").mockResolvedValue(response);
    expect(await searchWithOfflineFallback("historie","lexical")).toEqual({response,cachedAt:null});
    expect(readDocument).not.toHaveBeenCalled();
  });
  it("withholds results if trust is disabled during the search",async()=>{
    readDocument.mockImplementation(async()=>{setOfflineCaptureEnabled(false);return null;});
    expect(await searchCachedRecords("historie")).toBeNull();
  });
});
