import { useEffect, useRef, useState } from "react";
import type { Transcript } from "@sorta/contracts";
import { api } from "./api";
import { readMeetilyFiles } from "./meetily-import";
import { savedMeetilyFolder, saveMeetilyFolder } from "./meetily-folder-store";

type RecordingFolder = FileSystemDirectoryHandle & { values(): AsyncIterable<FileSystemHandle>; queryPermission(options: { mode: "read" }): Promise<PermissionState> };

async function filesInRecordingFolder(root: RecordingFolder): Promise<File[]> {
  const files: File[] = [];
  async function visit(folder: RecordingFolder, depth: number) {
    if (depth > 3) return;
    for await (const entry of folder.values()) {
      if (entry.kind === "directory") await visit(entry as RecordingFolder, depth + 1);
      else if (entry.name === "metadata.json" || entry.name === "transcripts.json") {
        const file = await (entry as FileSystemFileHandle).getFile();
        Object.defineProperty(file, "webkitRelativePath", { value: `${folder.name}/${entry.name}` });
        files.push(file);
      }
    }
  }
  await visit(root, 0);
  return files;
}

export function MeetilyWorkspace() {
  const folder = useRef<RecordingFolder | null>(null);
  const running = useRef(false);
  const importedSignatures = useRef(new Map<string, string>());
  const [approved, setApproved] = useState(() => localStorage.getItem("sorta-meetily-recording-approved") === "yes");
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Select Meetily’s recordings folder once on this laptop. Sorta will check it while this page is open.");
  const [items, setItems] = useState<Transcript[]>([]);

  async function refresh() {
    try { setItems((await api.meetilyTranscripts()).items); } catch { /* The page may be temporarily offline. */ }
  }
  useEffect(() => { void refresh(); }, []);
  useEffect(() => {
    let active = true;
    void savedMeetilyFolder().then(async saved => {
      if (!active || !saved) return;
      const handle = saved as RecordingFolder;
      if (await handle.queryPermission({ mode: "read" }) !== "granted" || !active) return;
      folder.current = handle;
      setConnected(true);
      if (approved) await importFiles(await filesInRecordingFolder(handle));
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  async function importFiles(files: File[]) {
    if (!approved || running.current) return;
    running.current = true;
    setBusy(true);
    try {
      const recordings = await readMeetilyFiles(files);
      let imported = 0, unchanged = 0, unmatched = 0;
      for (const recording of recordings) {
        const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(recording)));
        const signature = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
        if (importedSignatures.current.get(recording.meetingId) === signature) { unchanged++; continue; }
        const result = await api.importMeetilyRecording({ ...recording, ownerConfirmedRecordingApproval: true, lessonId: null });
        importedSignatures.current.set(recording.meetingId, signature);
        if (result.imported) imported++;
        else unchanged++;
        if (!result.transcript.association) unmatched++;
      }
      setMessage(recordings.length ? `${imported} new or updated transcript${imported === 1 ? "" : "s"}; ${unchanged} already in Sorta.${unmatched ? ` ${unmatched} could not be safely matched to one lesson.` : ""}` : "No completed recordings with transcript text found yet. Meetily keeps recording audio on this laptop.");
      await refresh();
    } catch (error) {
      setMessage(`Import paused: ${error instanceof Error ? error.message : "unknown error"}. The original Meetily recordings were not changed.`);
    } finally { running.current = false; setBusy(false); }
  }

  async function chooseFolder() {
    if (!approved) { setMessage("Confirm recording approval first."); return; }
    const picker = (window as Window & { showDirectoryPicker?: (options?: { mode: "read" }) => Promise<RecordingFolder> }).showDirectoryPicker;
    if (!picker) { setMessage("This browser cannot watch a local folder. Use the folder upload below in Chrome or Edge on the recording laptop."); return; }
    try {
      const handle = await picker.call(window, { mode: "read" });
      folder.current = handle;
      setConnected(true);
      await saveMeetilyFolder(handle);
      await importFiles(await filesInRecordingFolder(handle));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage(`Could not open recordings folder: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }

  useEffect(() => {
    if (!connected) return;
    const timer = window.setInterval(() => { if (folder.current && document.visibilityState === "visible") void filesInRecordingFolder(folder.current).then(importFiles).catch(() => setMessage("Folder access expired. Select the recordings folder again.")); }, 60_000);
    return () => window.clearInterval(timer);
  }, [connected, approved]);

  return <section className="settings-panel school-assignments" aria-label="Class recordings">
    <div className="card-label">Class recordings · Meetily</div>
    <p className="panel-copy">Record on this laptop in Meetily. When you stop, Sorta imports the completed transcript and matches it to the timetable when there is exactly one clear lesson. Audio stays on this laptop. Nothing records automatically.</p>
    <label className="meetily-consent"><input type="checkbox" checked={approved} onChange={event => { setApproved(event.target.checked); if (event.target.checked) localStorage.setItem("sorta-meetily-recording-approved", "yes"); else localStorage.removeItem("sorta-meetily-recording-approved"); }}/> I have permission to record these classes and voices.</label>
    <div className="session-actions">
      <button type="button" className="primary" disabled={!approved || busy} onClick={() => void chooseFolder()}>{connected ? "Change recordings folder" : "Connect recordings folder"}</button>
      {connected && <button type="button" className="text-button" disabled={busy} onClick={() => { if (folder.current) void filesInRecordingFolder(folder.current).then(importFiles); }}>Check now</button>}
      <label className="text-button file-button">Import a folder once<input type="file" multiple disabled={!approved || busy} {...{ webkitdirectory: "" }} onChange={event => { const files = Array.from(event.target.files ?? []); event.target.value = ""; void importFiles(files); }}/></label>
    </div>
    <p className="panel-copy" role="status">{busy ? "Checking completed recordings…" : message}</p>
    <details><summary>Where is the folder?</summary><p>Meetily’s default Windows folder is Music → meetily-recordings. Select that folder, not an individual audio file. Keep this Sorta page open to check automatically each minute. Only completed recordings with transcribed words are imported.</p><p><a href="https://github.com/Zackriya-Solutions/meetily/releases" target="_blank" rel="noreferrer">Get Meetily for Windows from its official releases</a>.</p></details>
    {items.length > 0 && <div className="settings-list">{items.map(item => <article key={item.id}><div><strong>{item.sourceObject.title}</strong><small>{new Date(item.createdAt).toLocaleString("nb-NO")} · {item.segments.length} transcript segments · {item.association ? "linked to a lesson" : "lesson not verified"}</small><details><summary>Read transcript</summary><p className="meetily-transcript">{item.exactText}</p></details></div></article>)}</div>}
  </section>;
}
