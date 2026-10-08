const DB_NAME = "sorta-meetily-folder";
const STORE = "folder";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMeetilyFolder(handle: FileSystemDirectoryHandle): Promise<void> {
  const db = await open();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE, "readwrite");
      transaction.objectStore(STORE).put(handle, "recordings");
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } finally { db.close(); }
}

export async function savedMeetilyFolder(): Promise<FileSystemDirectoryHandle | null> {
  const db = await open();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE, "readonly").objectStore(STORE).get("recordings");
      request.onsuccess = () => resolve(request.result instanceof Object ? request.result as FileSystemDirectoryHandle : null);
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}
