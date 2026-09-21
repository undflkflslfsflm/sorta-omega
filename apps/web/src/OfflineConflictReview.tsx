import { useEffect, useState } from "react";
import { syncConflicts, type StoredSyncConflict } from "./offline-queue";

export function OfflineConflictReview() {
  const [items, setItems] = useState<StoredSyncConflict[]>([]);
  const [error, setError] = useState<string | null>(null);
  async function refresh() {
    try { setItems(await syncConflicts()); setError(null); }
    catch { setError("Could not read this browser's saved conflicts."); }
  }
  useEffect(() => { void refresh(); }, []);
  function download(item: StoredSyncConflict) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(item, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `omega-conflict-${item.id}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className="settings-panel" aria-label="Offline conflict review">
    <h2>Offline changes needing review</h2>
    <p>These changes were rejected during synchronization. Review the current record before applying a corrected change. Download keeps a copy on this device.</p>
    <button type="button" className="text-button" onClick={() => void refresh()}>Refresh conflicts</button>
    {error && <p className="form-error">{error}</p>}
    {items.length === 0 && <p>No saved conflicts.</p>}
    {items.map(item => <article key={item.id}>
      <h3>{item.operation?.type.replaceAll("_", " ") ?? "Earlier offline change"}</h3>
      <p>{item.code.replaceAll("_", " ")} · {item.tombstoned ? "Record was deleted" : `Current revision: ${item.currentRevision ?? "unavailable"}`}</p>
      {item.operation ? <details><summary>Review original change</summary><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{JSON.stringify(item.operation, null, 2)}</pre></details> : <p>This older conflict has no retained original payload.</p>}
      <button type="button" className="text-button" onClick={() => download(item)}>Download conflict</button>
    </article>)}
  </section>;
}
