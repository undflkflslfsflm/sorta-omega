import type { MeetilyImport } from "@sorta/contracts";

type MeetilyMetadata = { meeting_id?: unknown; meeting_name?: unknown; created_at?: unknown; completed_at?: unknown; status?: unknown };
type MeetilySegment = { id?: unknown; text?: unknown; audio_start_time?: unknown; audio_end_time?: unknown; sequence_id?: unknown };

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function date(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? null : parsed.toISOString();
}

export function parseMeetilyRecording(metadataText: string, transcriptText: string, folderName: string): Omit<MeetilyImport, "ownerConfirmedRecordingApproval" | "lessonId"> | null {
  let metadata: MeetilyMetadata;
  let transcript: Record<string, unknown>;
  try {
    metadata = JSON.parse(metadataText) as MeetilyMetadata;
    transcript = JSON.parse(transcriptText) as Record<string, unknown>;
  } catch { return null; }
  if (!object(metadata) || !object(transcript) || metadata.status !== "completed") return null;
  const startedAt = date(metadata.created_at), completedAt = date(metadata.completed_at);
  if (!startedAt || !completedAt || completedAt < startedAt || !Array.isArray(transcript.segments)) return null;
  const meetingId = typeof metadata.meeting_id === "string" && metadata.meeting_id.trim() ? metadata.meeting_id.trim() : folderName;
  if (!meetingId || meetingId.length > 240) return null;
  const title = typeof metadata.meeting_name === "string" && metadata.meeting_name.trim() ? metadata.meeting_name.trim().slice(0, 240) : `Class recording · ${new Date(startedAt).toLocaleDateString("nb-NO")}`;
  const segments = transcript.segments.map((raw: unknown, index: number) => {
    const segment = object(raw) as MeetilySegment | null;
    if (!segment || typeof segment.text !== "string" || !segment.text.trim()) return null;
    const start = Number(segment.audio_start_time), end = Number(segment.audio_end_time);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) return null;
    const id = typeof segment.id === "string" && segment.id.trim() ? segment.id.slice(0, 120) : `segment-${index + 1}`;
    return { id, startMs: Math.round(start * 1000), endMs: Math.round(end * 1000), text: segment.text.trim().slice(0, 20000), speaker: { id: null, label: "Unknown speaker", status: "unknown" as const } };
  });
  if (!segments.length || segments.length > 5000 || segments.some(segment => segment === null)) return null;
  const validSegments = segments.filter((segment): segment is NonNullable<typeof segment> => segment !== null);
  if (new Set(validSegments.map(segment => segment.id)).size !== validSegments.length) return null;
  return { meetingId, title, startedAt, completedAt, segments: validSegments };
}

export async function readMeetilyFiles(files: File[]): Promise<Array<Omit<MeetilyImport, "ownerConfirmedRecordingApproval" | "lessonId">>> {
  const folders = new Map<string, { metadata?: File; transcript?: File }>();
  for (const file of files) {
    const path = file.webkitRelativePath || file.name;
    const parts = path.split("/");
    const name = parts.at(-1)?.toLowerCase();
    if (name !== "metadata.json" && name !== "transcripts.json") continue;
    const folder = parts.length > 1 ? parts.slice(0, -1).join("/") : "selected-recording";
    const entry = folders.get(folder) ?? {};
    if (name === "metadata.json") entry.metadata = file;
    else entry.transcript = file;
    folders.set(folder, entry);
  }
  const recordings = [];
  for (const [folder, entry] of folders) {
    if (!entry.metadata || !entry.transcript) continue;
    if (entry.metadata.size > 1024 * 1024 || entry.transcript.size > 20 * 1024 * 1024) continue;
    const recording = parseMeetilyRecording(await entry.metadata.text(), await entry.transcript.text(), folder.split("/").at(-1)!);
    if (recording) recordings.push(recording);
  }
  return recordings.sort((a, b) => a.startedAt.localeCompare(b.startedAt));
}
