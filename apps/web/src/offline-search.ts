import type { EditorDocument, SearchItem, SearchResult } from "@sorta/contracts";
import { api, ApiError } from "./api";
import { cachedCoreRecords, cachedNoteAccessBlocked, offlineCaptureEnabled, replicaDeviceId } from "./offline-queue";

function documentText(node: EditorDocument["content"][number]): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  const text = (node.content ?? []).map(documentText).join("");
  return text + (["paragraph", "heading", "codeBlock", "tableCell", "tableHeader"].includes(node.type) ? "\n" : "");
}
const normalize = (value:string) => value.normalize("NFKC").toLocaleLowerCase("nb-NO");

export async function searchCachedRecords(query:string) {
  if (!offlineCaptureEnabled() || !await replicaDeviceId()) return null;
  const cache = await cachedCoreRecords();
  if (!cache) return null;
  const terms = [...new Set(normalize(query.trim()).split(/\s+/).filter(Boolean))];
  const items: SearchItem[] = [];
  function add(item:Omit<SearchItem,"score"|"excerpt">, body:string) {
    const title = normalize(item.title), text = normalize(body);
    if (!terms.length || !terms.every(term => title.includes(term) || text.includes(term))) return;
    const first = Math.max(0, text.indexOf(terms[0]) - 60);
    items.push({...item, excerpt:body.slice(first,first+300), score:terms.reduce((sum,term)=>sum+(title.includes(term)?2:1),0)});
  }
  // Load the shared-document machinery only for offline note searching. This
  // merges saved local edits rather than searching an older server body.
  const { loadCachedNoteDocument } = await import("./cached-shared-note");
  for (const note of cache.notes) {
    if (await cachedNoteAccessBlocked(note.id)) continue;
    const document = await loadCachedNoteDocument(note.id);
    add({kind:"note",id:note.id,title:note.title,sourceId:note.sourceId,revision:note.revision,updatedAt:note.updatedAt}, document ? document.content.map(documentText).join("") : note.body);
  }
  for (const task of cache.tasks) add({kind:"task",id:task.id,title:task.title,sourceId:null,revision:task.revision,updatedAt:task.updatedAt},task.title);
  for (const event of cache.events) {
    if (event.trashedAt) continue;
    add({kind:"calendar_event",id:event.id,title:event.title,sourceId:null,revision:event.revision,updatedAt:event.createdAt},event.title);
  }
  items.sort((a,b)=>b.score-a.score || b.updatedAt.localeCompare(a.updatedAt) || a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id));
  // Trust may be revoked while IndexedDB reads are pending.
  if (!offlineCaptureEnabled() || !await replicaDeviceId()) return null;
  const result:SearchResult={mode:"lexical",query,items,coverage:{kinds:["note","task","calendar_event"],semanticAvailable:false},nextCursor:null};
  return {result,cachedAt:cache.cachedAt};
}

export async function searchWithOfflineFallback(query:string, mode:"lexical"|"hybrid"|"semantic") {
  try { return {response:await api.search(query,mode),cachedAt:null}; }
  catch (error) {
    const unavailable = error instanceof TypeError || (error instanceof ApiError && error.status>=500);
    if (mode!=="lexical" || !unavailable) throw error;
    const cached = await searchCachedRecords(query);
    if (!cached) throw error;
    return {response:cached.result,cachedAt:cached.cachedAt};
  }
}
