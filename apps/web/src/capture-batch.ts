export const MAX_CAPTURE_FILES = 20;
export const MAX_BROWSER_FILE_BYTES = 64 * 1024 * 1024;

export function captureBatchTitle(filenames: string[]): string | undefined {
  if (filenames.length <= 1) return undefined;
  return `${filenames.length} files · ${new Intl.DateTimeFormat("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date())}`;
}

export function captureFileSelection<T extends Pick<File, "name" | "size">>(files: T[]) {
  if (files.length === 0) return { accepted: [], rejected: [] };
  if (files.length > MAX_CAPTURE_FILES) throw new Error("capture_batch_file_limit");
  const accepted: T[] = [], rejected: Array<{ name: string; reason: "empty" | "too_large" }> = [];
  for (const file of files) {
    if (file.size < 1) rejected.push({ name: file.name, reason: "empty" });
    else if (file.size > MAX_BROWSER_FILE_BYTES) rejected.push({ name: file.name, reason: "too_large" });
    else accepted.push(file);
  }
  return { accepted, rejected };
}

export async function uploadCaptureBatch<T extends { name: string }, R>(files: T[], upload: (file: T, index: number, total: number) => Promise<R>) {
  const uploaded: R[] = [], failed: string[] = [];
  for (let index = 0; index < files.length; index++) {
    try { uploaded.push(await upload(files[index], index, files.length)); }
    catch { failed.push(files[index].name); }
  }
  return { uploaded, failed };
}
