export type GraphSource = {
  providerObjectId: string;
  containerId: string | null;
  kind: string;
  title: string;
  deepLink: string | null;
  content: string;
  metadata: Record<string, unknown>;
  attachments?: Array<{ filename: string; mediaType: string; bytes: Uint8Array }>;
};

export type GraphDataset = "classes" | "assignments" | "chats" | "channels" | "calendar" | "mail" | "files" | "sharepoint" | "todo" | "planner" | "onenote" | "contacts";
export type GraphCoverage = { dataset: GraphDataset; imported: number; complete: boolean; contentComplete: boolean; limitations: string[]; error: string | null };

const origin = "https://graph.microsoft.com";
const maxJsonBytes = 8_000_000;
const maxHtmlBytes = 2_000_000;
const maxFileBytes = 20_000_000;
const maxExtractedTextBytes = 2_000_000;
const maxPages = 100;
const path = (value: string) => `${origin}/v1.0${value}`;
const str = (value: unknown) => typeof value === "string" ? value : "";
const htmlText = (value: unknown) => str(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const encode = (value: string) => encodeURIComponent(value);
const teamsMessageText = (message: Record<string, any>) => [htmlText(message.body?.content),
  ...(Array.isArray(message.attachments) ? message.attachments.filter((item: Record<string, any>) => str(item.contentType).toLowerCase() === "reference").map((item: Record<string, any>) => str(item.name)) : [])]
  .filter(Boolean).join("\n");
function readableFileText(bytes: Uint8Array, mediaType: string): string | null {
  const type = mediaType.split(";", 1)[0].trim().toLowerCase();
  if (bytes.byteLength > maxExtractedTextBytes || !(type.startsWith("text/") || ["application/json", "application/xml", "application/javascript"].includes(type))) return null;
  try {
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    if (decoded.includes("\0")) return null;
    return type === "text/html" ? htmlText(decoded) : decoded.trim();
  } catch { return null; }
}

export class GraphReadError extends Error {
  constructor(readonly status: number, readonly code: string) { super(`graph_${code}`); }
}

async function boundedBody(response: Response, maximum: number): Promise<string> {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maximum) throw new Error("graph_content_too_large");
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  const parts: string[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) throw new Error("graph_content_too_large");
      parts.push(decoder.decode(value, { stream: true }));
    }
    parts.push(decoder.decode());
    return parts.join("");
  } finally {
    await reader.cancel().catch(() => undefined);
  }
}

async function boundedBytes(response: Response, maximum: number): Promise<Uint8Array> {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maximum) throw new Error("graph_file_too_large");
  const reader = response.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) throw new Error("graph_file_too_large");
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return bytes;
  } finally { await reader.cancel().catch(() => undefined); }
}

function driveFileUrl(raw: string): string {
  const url = new URL(raw);
  if (url.origin !== origin || url.search || url.hash || url.username || url.password || url.port || !/^\/v1\.0\/drives\/[^/%]+\/items\/[^/%]+$/.test(url.pathname)) throw new Error("graph_assignment_file_url_invalid");
  return url.toString();
}

function downloadUrl(raw: string): string {
  const url = new URL(raw);
  const host = url.hostname.toLowerCase();
  if (url.protocol !== "https:" || url.port || url.username || url.password || !(host.endsWith(".sharepoint.com") || host.endsWith(".files.1drv.com"))) throw new Error("graph_download_host_untrusted");
  return url.toString();
}

function sharedFileUrl(raw: string): string {
  const url = new URL(raw);
  const host = url.hostname.toLowerCase();
  if (url.protocol !== "https:" || url.port || url.username || url.password || !host.endsWith(".sharepoint.com")) throw new Error("graph_shared_file_url_invalid");
  const encoded = Buffer.from(url.toString(), "utf8").toString("base64url");
  return path(`/shares/u!${encoded}/driveItem`);
}

export function createGraphReader(token: string, fetcher: typeof fetch = fetch) {
  async function downloadItem(item: Record<string, any>): Promise<{ bytes: Uint8Array; mediaType: string }> {
    if (!item.file || !Number.isSafeInteger(item.size) || item.size < 0 || item.size > maxFileBytes) throw new Error("graph_assignment_file_unavailable_or_too_large");
    const temporaryUrl = downloadUrl(str(item["@microsoft.graph.downloadUrl"]));
    const response = await fetcher(temporaryUrl, { headers: { accept: "application/octet-stream" }, redirect: "error", signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new GraphReadError(response.status, response.status === 403 ? "permission_denied" : `http_${response.status}`);
    const bytes = await boundedBytes(response, maxFileBytes);
    if (bytes.byteLength !== item.size) throw new Error("graph_assignment_file_size_mismatch");
    return { bytes, mediaType: str(item.file.mimeType) || "application/octet-stream" };
  }
  async function downloadAssignmentFile(rawFileUrl: string): Promise<{ bytes: Uint8Array; mediaType: string }> {
    return downloadItem(await get(driveFileUrl(rawFileUrl)));
  }
  async function downloadPersonalDriveFile(itemId: string): Promise<{ bytes: Uint8Array; mediaType: string }> {
    return downloadItem(await get(path(`/me/drive/items/${encode(itemId)}`)));
  }
  async function downloadTeamsFile(rawContentUrl: string): Promise<{ bytes: Uint8Array; mediaType: string }> {
    const url = new URL(rawContentUrl);
    const item = url.origin === origin ? await get(driveFileUrl(rawContentUrl)) : await get(sharedFileUrl(rawContentUrl));
    return downloadItem(item);
  }
  async function downloadHostedContent(url: string): Promise<{ bytes: Uint8Array; mediaType: string }> {
    const parsed = new URL(url);
    if (parsed.origin !== origin || parsed.search || parsed.hash || !/^\/v1\.0\/(chats|teams)\/.+\/hostedContents\/[^/]+\/\$value$/.test(parsed.pathname)) throw new Error("graph_hosted_content_url_invalid");
    const response = await fetcher(parsed.toString(), { headers: { authorization: `Bearer ${token}`, accept: "application/octet-stream" }, redirect: "error", signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new GraphReadError(response.status, response.status === 403 ? "permission_denied" : `http_${response.status}`);
    return { bytes: await boundedBytes(response, maxFileBytes), mediaType: response.headers.get("content-type") || "application/octet-stream" };
  }
  async function downloadMailAttachment(messageId: string, attachmentId: string): Promise<{ bytes: Uint8Array; mediaType: string }> {
    const url = path(`/me/messages/${encode(messageId)}/attachments/${encode(attachmentId)}/$value`);
    const response = await fetcher(url, { headers: { authorization: `Bearer ${token}`, accept: "application/octet-stream" }, redirect: "error", signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new GraphReadError(response.status, response.status === 403 ? "permission_denied" : `http_${response.status}`);
    return { bytes: await boundedBytes(response, maxFileBytes), mediaType: response.headers.get("content-type") || "application/octet-stream" };
  }
  async function getText(url: string): Promise<string> {
    const parsed = new URL(url, origin);
    if (parsed.origin !== origin || !parsed.pathname.startsWith("/v1.0/")) throw new Error("graph_nextlink_origin_invalid");
    const response = await fetcher(parsed.toString(), { headers: { authorization: `Bearer ${token}`, accept: "text/html" }, redirect: "error", signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new GraphReadError(response.status, response.status === 403 ? "permission_denied" : `http_${response.status}`);
    return boundedBody(response, maxHtmlBytes);
  }
  async function get(url: string): Promise<Record<string, any>> {
    const parsed = new URL(url, origin);
    if (parsed.origin !== origin || !parsed.pathname.startsWith("/v1.0/")) throw new Error("graph_nextlink_origin_invalid");
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await fetcher(parsed.toString(), { headers: { authorization: `Bearer ${token}`, accept: "application/json" }, redirect: "error", signal: AbortSignal.timeout(20_000) });
      if ((response.status === 429 || response.status >= 500) && attempt < 2) {
        const seconds = Number(response.headers.get("retry-after"));
        if (response.status === 429 && Number.isFinite(seconds) && seconds > 5) throw new GraphReadError(429, "rate_limited");
        await new Promise(resolve => setTimeout(resolve, Number.isFinite(seconds) && seconds > 0 ? Math.min(seconds * 1000, 5000) : 500 * (attempt + 1)));
        continue;
      }
      if (!response.ok) throw new GraphReadError(response.status, response.status === 401 ? "authorization_required" : response.status === 403 ? "permission_denied" : response.status === 429 ? "rate_limited" : `http_${response.status}`);
      const body = JSON.parse(await boundedBody(response, maxJsonBytes)) as unknown;
      if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("graph_response_invalid");
      return body as Record<string, any>;
    }
    throw new Error("graph_retry_exhausted");
  }
  async function list(url: string, maximum = 5000): Promise<{ items: Record<string, any>[]; complete: boolean }> {
    if (!Number.isSafeInteger(maximum) || maximum < 1 || maximum > 5000) throw new Error("graph_collection_limit_invalid");
    const items: Record<string, any>[] = [];
    const seen = new Set<string>();
    const collectionPath = new URL(url, origin).pathname;
    let next: string | null = url;
    while (next && items.length < maximum) {
      if (seen.size >= maxPages) throw new Error("graph_pagination_limit");
      if (seen.has(next)) throw new Error("graph_pagination_cycle");
      const nextUrl = new URL(next, origin);
      if (nextUrl.origin !== origin || !nextUrl.pathname.startsWith("/v1.0/")) throw new Error("graph_nextlink_origin_invalid");
      if (nextUrl.pathname !== collectionPath) throw new Error("graph_nextlink_path_invalid");
      seen.add(next);
      const page = await get(next);
      if (!Array.isArray(page.value)) throw new Error("graph_collection_invalid");
      items.push(...page.value);
      next = typeof page["@odata.nextLink"] === "string" ? page["@odata.nextLink"] : null;
    }
    return { items: items.slice(0, maximum), complete: !next && items.length <= maximum };
  }
  return { get, getText, list, downloadAssignmentFile, downloadPersonalDriveFile, downloadTeamsFile, downloadHostedContent, downloadMailAttachment };
}

export async function collectMicrosoftGraph(token: string, scopes: string[], save: (source: GraphSource) => Promise<void>, fetcher: typeof fetch = fetch): Promise<GraphCoverage[]> {
  const graph = createGraphReader(token, fetcher);
  const granted = new Set(scopes.map(item => item.toLowerCase()));
  const has = (...required: string[]) => required.every(item => granted.has(item.toLowerCase()));
  const coverage: GraphCoverage[] = [];
  const assignmentLimitations: string[] = [];
  const chatLimitations: string[] = [];
  const channelLimitations: string[] = [];
  const mailLimitations: string[] = [];
  const fileLimitations: string[] = ["Document text is not extracted from binary file originals."];
  const sharepointLimitations: string[] = ["Only followed sites and joined Teams are discovered; other accessible sites may be absent.", "Document text is not extracted from binary file originals."];
  async function run(dataset: GraphDataset, authorized: boolean, work: () => Promise<boolean>) {
    const limitations = dataset === "assignments" ? assignmentLimitations : dataset === "files" ? fileLimitations : dataset === "sharepoint" ? sharepointLimitations : dataset === "mail" ? mailLimitations : dataset === "chats" ? chatLimitations : dataset === "channels" ? channelLimitations : dataset === "planner" ? ["Only tasks assigned to the signed-in user are collected; entire plans are not yet traversed."] : dataset === "onenote" ? ["Embedded image and attachment bodies are not downloaded."] : dataset === "contacts" ? ["Contacts in nested contact folders are not yet traversed."] : [];
    if (!authorized) { coverage.push({ dataset, imported: 0, complete: false, contentComplete: false, limitations, error: "scope_not_granted" }); return; }
    const start = imported;
    try { const complete = await work(); coverage.push({ dataset, imported: imported - start, complete, contentComplete: complete && limitations.length === 0, limitations, error: complete ? null : "provider_coverage_incomplete" }); }
    catch (error) { coverage.push({ dataset, imported: imported - start, complete: false, contentComplete: false, limitations, error: error instanceof GraphReadError ? error.code : "provider_read_failed" }); }
  }
  let imported = 0;
  async function emit(source: GraphSource) { await save(source); imported++; }
  const fileReadAllowed = has("Files.Read") || has("Files.Read.All") || has("Sites.Read.All");
  async function driveFileOriginal(item: Record<string, any>, budget: { used: number }, driveId: string | null) {
    if (!item.file) return { attachments: [] as NonNullable<GraphSource["attachments"]>, contentDownloaded: false, extractedText: null as string | null, fileMissing: false };
    const size = item.size;
    if (!Number.isSafeInteger(size) || size < 0 || size > maxFileBytes || budget.used + size > 1_000_000_000) {
      return { attachments: [] as NonNullable<GraphSource["attachments"]>, contentDownloaded: false, extractedText: null as string | null, fileMissing: true };
    }
    try {
      const id = str(item.id);
      if (!id) throw new Error("graph_drive_file_id_missing");
      const file = driveId
        ? await graph.downloadAssignmentFile(path(`/drives/${encode(driveId)}/items/${encode(id)}`))
        : await graph.downloadPersonalDriveFile(id);
      if (budget.used + file.bytes.byteLength > 1_000_000_000) throw new Error("graph_drive_dataset_limit");
      budget.used += file.bytes.byteLength;
      return { attachments: [{ filename: (str(item.name) || "Drive file").slice(0, 240), mediaType: file.mediaType, bytes: file.bytes }], contentDownloaded: true, extractedText: readableFileText(file.bytes, file.mediaType), fileMissing: false };
    } catch { return { attachments: [] as NonNullable<GraphSource["attachments"]>, contentDownloaded: false, extractedText: null as string | null, fileMissing: true }; }
  }
  function safeDriveItem(item: Record<string, any>) {
    const { ["@microsoft.graph.downloadUrl"]: _temporaryUrl, ...safe } = item;
    return safe;
  }
  async function teamsMessageFiles(message: Record<string, any>, messageBase: string, limitations: string[]) {
    const attachments: NonNullable<GraphSource["attachments"]> = [];
    const attachmentManifest: Array<{ index: number; attachmentId: string | null; hostedContentId?: string; filename: string }> = [];
    let missing = 0, downloadedBytes = 0;
    for (const item of Array.isArray(message.attachments) ? message.attachments : []) {
      if (str(item.contentType).toLowerCase() !== "reference") continue;
      const contentUrl = str(item.contentUrl);
      if (!contentUrl || !fileReadAllowed || attachments.length >= 100 || downloadedBytes >= 100_000_000) { missing++; continue; }
      try {
        const file = await graph.downloadTeamsFile(contentUrl);
        if (downloadedBytes + file.bytes.byteLength > 100_000_000) { missing++; continue; }
        const filename = (str(item.name) || "Teams file").slice(0, 240);
        attachmentManifest.push({ index: attachments.length, attachmentId: str(item.id) || null, filename });
        attachments.push({ filename, mediaType: file.mediaType, bytes: file.bytes });
        downloadedBytes += file.bytes.byteLength;
      } catch { missing++; }
    }
    let missingHostedContentCount = 0;
    try {
      const hosted = await graph.list(path(`${messageBase}/hostedContents`), 100);
      if (!hosted.complete) { missingHostedContentCount++; limitations.push("Some Teams hosted content lists exceed the import limit."); }
      for (const item of hosted.items) {
        const hostedId = str(item.id);
        if (!hostedId || attachments.length >= 100 || downloadedBytes >= 100_000_000) { missingHostedContentCount++; continue; }
        try {
          const content = await graph.downloadHostedContent(path(`${messageBase}/hostedContents/${encode(hostedId)}/$value`));
          if (downloadedBytes + content.bytes.byteLength > 100_000_000) { missingHostedContentCount++; continue; }
          const filename = `Teams inline content ${attachments.length + 1}`;
          attachmentManifest.push({ index: attachments.length, attachmentId: null, hostedContentId: hostedId, filename });
          attachments.push({ filename, mediaType: content.mediaType, bytes: content.bytes });
          downloadedBytes += content.bytes.byteLength;
        } catch { missingHostedContentCount++; }
      }
    } catch { missingHostedContentCount++; limitations.push("A Teams hosted content list could not be read."); }
    if (missing) limitations.push(`${missing} linked Teams file(s) were not downloaded.`);
    if (missingHostedContentCount) limitations.push(`${missingHostedContentCount} hosted Teams content item(s) were not downloaded or enumerated.`);
    return { attachments, attachmentManifest, missingLinkedFileCount: missing, missingHostedContentCount };
  }
  await run("classes", has("EduRoster.ReadBasic"), async () => {
    const classes = await graph.list(path("/education/me/classes"));
    for (const item of classes.items) {
      const id = str(item.id);
      if (!id) continue;
      const name = str(item.displayName) || str(item.externalName) || str(item.classCode) || "Unnamed class";
      await emit({ providerObjectId: `education-class:${id}`, containerId: null, kind: "school_class", title: name, deepLink: str(item.webUrl) || null,
        content: [name, str(item.description), str(item.classCode)].filter(Boolean).join("\n"), metadata: { class: item } });
    }
    return classes.complete;
  });
  await run("assignments", has("EduAssignments.Read"), async () => {
    const assignments = await graph.list(path("/education/me/assignments")); let complete = assignments.complete;
    let missingFileCount = 0;
    for (const summary of assignments.items) {
      const classId = str(summary.classId), id = str(summary.id);
      if (!classId || !id) continue;
      const detail = await graph.get(path(`/education/classes/${encode(classId)}/assignments/${encode(id)}`));
      const resources = await graph.list(path(`/education/classes/${encode(classId)}/assignments/${encode(id)}/resources`), 1000);
      const submissions = await graph.list(path(`/education/classes/${encode(classId)}/assignments/${encode(id)}/submissions?$expand=outcomes,resources,submittedResources`), 1000);
      complete &&= resources.complete && submissions.complete;
      const title = str(detail.displayName) || str(summary.displayName) || "Assignment";
      const attachments: NonNullable<GraphSource["attachments"]> = [];
      const attachmentManifest: Array<{index:number;role:"assignment"|"working"|"submitted";submissionId:string|null;resourceId:string|null;filename:string}> = [];
      const submissionDetails: Array<{submissionId:string;resources:Record<string,any>[];submittedResources:Record<string,any>[];outcomes:Record<string,any>[];resourcesComplete:boolean;submittedResourcesComplete:boolean;outcomesComplete:boolean}> = [];
      const resourceRefs: Array<{item:Record<string,any>;role:"assignment"|"working"|"submitted";submissionId:string|null}> = resources.items.map(item=>({item,role:"assignment",submissionId:null}));
      for (const submission of submissions.items) {
        const submissionId = str(submission.id);
        if (!submissionId) { complete = false; continue; }
        const base = `/education/classes/${encode(classId)}/assignments/${encode(id)}/submissions/${encode(submissionId)}`;
        const [workingResult,submittedResult,outcomeResult] = await Promise.allSettled([
          graph.list(path(`${base}/resources`),1000),
          graph.list(path(`${base}/submittedResources`),1000),
          graph.list(path(`${base}/outcomes`),1000)
        ]);
        const working = workingResult.status === "fulfilled" ? workingResult.value : {items:Array.isArray(submission.resources)?submission.resources:[],complete:false};
        const submitted = submittedResult.status === "fulfilled" ? submittedResult.value : {items:Array.isArray(submission.submittedResources)?submission.submittedResources:[],complete:false};
        const outcomes = outcomeResult.status === "fulfilled" ? outcomeResult.value : {items:Array.isArray(submission.outcomes)?submission.outcomes:[],complete:false};
        complete &&= working.complete && submitted.complete && outcomes.complete;
        if (!working.complete || !submitted.complete || !outcomes.complete) assignmentLimitations.push("Some submission resource or outcome lists could not be read completely.");
        submissionDetails.push({submissionId,resources:working.items,submittedResources:submitted.items,outcomes:outcomes.items,resourcesComplete:working.complete,submittedResourcesComplete:submitted.complete,outcomesComplete:outcomes.complete});
        resourceRefs.push(...working.items.map(item=>({item,role:"working" as const,submissionId})),...submitted.items.map(item=>({item,role:"submitted" as const,submissionId})));
      }
      let missingForAssignment = 0;
      let downloadedBytes = 0;
      for (const {item,role,submissionId} of resourceRefs) {
        const fileUrl = str(item.resource?.fileUrl);
        if (!fileUrl) { if (item.resource) { missingFileCount++; missingForAssignment++; } continue; }
        if (!fileReadAllowed) { missingFileCount++; missingForAssignment++; continue; }
        if (attachments.length >= 100 || downloadedBytes >= 100_000_000) { missingFileCount++; missingForAssignment++; continue; }
        try {
          const downloaded = await graph.downloadAssignmentFile(fileUrl);
          if (downloadedBytes + downloaded.bytes.byteLength > 100_000_000) { missingFileCount++; missingForAssignment++; continue; }
          const filename=(str(item.resource?.displayName) || str(item.displayName) || "Assignment file").slice(0, 240);
          attachmentManifest.push({index:attachments.length,role,submissionId,resourceId:str(item.id)||null,filename});
          attachments.push({ filename, mediaType: downloaded.mediaType, bytes: downloaded.bytes });
          downloadedBytes += downloaded.bytes.byteLength;
        } catch { missingFileCount++; missingForAssignment++; }
      }
      await emit({ providerObjectId: `education-assignment:${classId}:${id}`, containerId: classId, kind: "assignment", title, deepLink: str(detail.webUrl) || null,
        content: [title, htmlText(detail.instructions?.content), ...resources.items.map(item => [str(item.displayName), str(item.resource?.webUrl)].filter(Boolean).join(" "))].filter(Boolean).join("\n"),
        metadata: { detail, resources: resources.items, submissions: submissions.items, submissionDetails, resourcesComplete: resources.complete, submissionsComplete: submissions.complete, attachmentManifest, linkedFileCount: attachments.length, missingLinkedFileCount: missingForAssignment }, attachments });
    }
    if (missingFileCount) assignmentLimitations.push(`${missingFileCount} linked assignment file(s) were not downloaded.`);
    if (assignmentLimitations.length) assignmentLimitations.splice(0,assignmentLimitations.length,...new Set(assignmentLimitations));
    return complete;
  });
  await run("chats", has("Chat.Read"), async () => {
    const chats = await graph.list(path("/me/chats")); let complete = chats.complete;
    for (const chat of chats.items) {
      const id = str(chat.id); if (!id) continue;
      const messages = await graph.list(path(`/me/chats/${encode(id)}/messages`)); complete &&= messages.complete;
      for (const message of messages.items) {
        if (!message.id) continue;
        const files = await teamsMessageFiles(message, `/chats/${encode(id)}/messages/${encode(str(message.id))}`, chatLimitations);
        await emit({ providerObjectId: `chat:${id}:${message.id}`, containerId: id, kind: "teams_message", title: str(chat.topic) || "Teams chat", deepLink: str(message.webUrl) || null, content: teamsMessageText(message), metadata: { chatId: id, message, attachmentManifest: files.attachmentManifest, missingLinkedFileCount: files.missingLinkedFileCount, missingHostedContentCount: files.missingHostedContentCount }, attachments: files.attachments });
      }
    }
    if (chatLimitations.length) chatLimitations.splice(0,chatLimitations.length,...new Set(chatLimitations));
    return complete;
  });
  await run("channels", has("Team.ReadBasic.All", "Channel.ReadBasic.All", "ChannelMessage.Read.All"), async () => {
    const teams = await graph.list(path("/me/joinedTeams")); let complete = teams.complete;
    for (const team of teams.items) {
      const teamId = str(team.id); if (!teamId) continue;
      const channels = await graph.list(path(`/teams/${encode(teamId)}/channels`)); complete &&= channels.complete;
      for (const channel of channels.items) {
        const channelId = str(channel.id); if (!channelId) continue;
        const base = `/teams/${encode(teamId)}/channels/${encode(channelId)}/messages`;
        const messages = await graph.list(path(base)); complete &&= messages.complete;
        for (const message of messages.items) {
          if (!message.id) continue;
          const files = await teamsMessageFiles(message, `${base}/${encode(str(message.id))}`, channelLimitations);
          await emit({ providerObjectId: `channel:${teamId}:${channelId}:${message.id}`, containerId: channelId, kind: "teams_message", title: str(channel.displayName) || "Teams channel", deepLink: str(message.webUrl) || null, content: teamsMessageText(message), metadata: { teamId, channelId, message, attachmentManifest: files.attachmentManifest, missingLinkedFileCount: files.missingLinkedFileCount, missingHostedContentCount: files.missingHostedContentCount }, attachments: files.attachments });
          const replies = await graph.list(path(`${base}/${encode(str(message.id))}/replies`)); complete &&= replies.complete;
          for (const reply of replies.items) {
            if (!reply.id) continue;
            const replyFiles = await teamsMessageFiles(reply, `${base}/${encode(str(message.id))}/replies/${encode(str(reply.id))}`, channelLimitations);
            await emit({ providerObjectId: `channel-reply:${teamId}:${channelId}:${message.id}:${reply.id}`, containerId: channelId, kind: "teams_message", title: str(channel.displayName) || "Teams channel reply", deepLink: str(reply.webUrl) || null, content: teamsMessageText(reply), metadata: { teamId, channelId, parentMessageId: message.id, message: reply, attachmentManifest: replyFiles.attachmentManifest, missingLinkedFileCount: replyFiles.missingLinkedFileCount, missingHostedContentCount: replyFiles.missingHostedContentCount }, attachments: replyFiles.attachments });
          }
        }
      }
    }
    if (channelLimitations.length) channelLimitations.splice(0,channelLimitations.length,...new Set(channelLimitations));
    return complete;
  });
  await run("calendar", has("Calendars.Read") || has("Calendars.ReadWrite"), async () => {
    const events = await graph.list(path("/me/events"));
    for (const event of events.items) if (event.id) await emit({ providerObjectId: `event:${event.id}`, containerId: null, kind: "calendar_event", title: str(event.subject) || "Calendar event", deepLink: str(event.webLink) || null, content: [str(event.subject), htmlText(event.body?.content), str(event.location?.displayName)].filter(Boolean).join("\n"), metadata: { event } });
    return events.complete;
  });
  await run("mail", has("Mail.Read"), async () => {
    const messages = await graph.list(path("/me/messages"));
    for (const message of messages.items) {
      const id = str(message.id);
      if (!id) continue;
      const attachments: NonNullable<GraphSource["attachments"]> = [];
      const attachmentManifest: Array<{index:number;attachmentId:string;filename:string;type:string}> = [];
      const attachmentNames: string[] = [];
      let missingAttachmentCount = 0, downloadedBytes = 0;
      try {
        const listed = await graph.list(path(`/me/messages/${encode(id)}/attachments?$select=id,name,size,contentType,isInline`), 100);
        if (!listed.complete) { missingAttachmentCount++; mailLimitations.push("Some mail attachment lists exceed the import limit."); }
        for (const item of listed.items) {
          const attachmentId = str(item.id), filename = (str(item.name) || "Mail attachment").slice(0, 240);
          attachmentNames.push(filename);
          const type = str(item["@odata.type"]).toLowerCase();
          const size = item.size;
          if (!attachmentId || !Number.isSafeInteger(size) || size < 0 || size > maxFileBytes || attachments.length >= 100 || downloadedBytes + size > 100_000_000) { missingAttachmentCount++; continue; }
          try {
            const downloaded = type.endsWith("fileattachment") || type.endsWith("itemattachment")
              ? await graph.downloadMailAttachment(id, attachmentId)
              : type.endsWith("referenceattachment")
                ? await graph.downloadTeamsFile(str((await graph.get(path(`/me/messages/${encode(id)}/attachments/${encode(attachmentId)}`))).sourceUrl))
                : null;
            if (!downloaded || downloadedBytes + downloaded.bytes.byteLength > 100_000_000) { missingAttachmentCount++; continue; }
            attachmentManifest.push({index:attachments.length,attachmentId,filename,type});
            attachments.push({filename,mediaType:downloaded.mediaType,bytes:downloaded.bytes});
            downloadedBytes += downloaded.bytes.byteLength;
          } catch { missingAttachmentCount++; }
        }
      } catch { missingAttachmentCount++; mailLimitations.push("A mail attachment list could not be read."); }
      if (missingAttachmentCount) mailLimitations.push(`${missingAttachmentCount} mail attachment(s) were not downloaded or enumerated.`);
      await emit({ providerObjectId: `mail:${id}`, containerId: str(message.conversationId) || null, kind: "mail_message", title: str(message.subject) || "Email", deepLink: str(message.webLink) || null, content: [str(message.subject), htmlText(message.body?.content), ...attachmentNames].filter(Boolean).join("\n"), metadata: { message, attachmentManifest, missingAttachmentCount }, attachments });
    }
    if (mailLimitations.length) mailLimitations.splice(0,mailLimitations.length,...new Set(mailLimitations));
    return messages.complete;
  });
  await run("files", has("Files.Read") || has("Files.Read.All"), async () => {
    const pending = ["/me/drive/root/children"]; let complete = true, count = 0, missingFileCount = 0;
    const budget = { used: 0 };
    while (pending.length && count < 5000) {
      const children = await graph.list(path(pending.shift()!), 5000 - count); complete &&= children.complete;
      for (const item of children.items) {
        if (!item.id) continue;
        count++;
        const original = await driveFileOriginal(item, budget, null);
        if (original.fileMissing) missingFileCount++;
        await emit({ providerObjectId: `drive:${item.id}`, containerId: str(item.parentReference?.id) || null, kind: "drive_file", title: str(item.name) || "Drive item", deepLink: str(item.webUrl) || null, content: [str(item.name), original.extractedText].filter(Boolean).join("\n"), metadata: { item: safeDriveItem(item), contentDownloaded: original.contentDownloaded, textExtracted: original.extractedText !== null, originalFileCount: original.attachments.length }, attachments: original.attachments });
        if (item.folder) pending.push(`/me/drive/items/${encode(str(item.id))}/children`);
      }
    }
    if (missingFileCount) fileLimitations.push(`${missingFileCount} OneDrive file original(s) were not downloaded.`);
    return complete && pending.length === 0;
  });
  await run("sharepoint", has("Sites.Read.All"), async () => {
    const followed = await graph.list(path("/me/followedSites"));
    let complete = followed.complete;
    let missingFileCount = 0;
    const budget = { used: 0 };
    const sites = new Map<string, Record<string, any>>();
    for (const site of followed.items) if (str(site.id)) sites.set(str(site.id), site);
    if (has("Team.ReadBasic.All")) {
      const teams = await graph.list(path("/me/joinedTeams"));
      complete &&= teams.complete;
      for (const team of teams.items) {
        const teamId = str(team.id); if (!teamId) continue;
        try {
          const site = await graph.get(path(`/groups/${encode(teamId)}/sites/root`));
          if (str(site.id)) sites.set(str(site.id), site);
        } catch (error) {
          if (error instanceof GraphReadError && [403, 404].includes(error.status)) complete = false;
          else throw error;
        }
      }
    }
    for (const site of sites.values()) {
      const siteId = str(site.id); if (!siteId) continue;
      await emit({ providerObjectId: `sharepoint-site:${siteId}`, containerId: null, kind: "sharepoint_site", title: str(site.displayName) || str(site.name) || "SharePoint site", deepLink: str(site.webUrl) || null, content: [str(site.displayName), str(site.description)].filter(Boolean).join("\n"), metadata: { site } });
      const lists = await graph.list(path(`/sites/${encode(siteId)}/lists`)); complete &&= lists.complete;
      for (const list of lists.items) {
        const listId = str(list.id); if (!listId) continue;
        await emit({ providerObjectId: `sharepoint-list:${siteId}:${listId}`, containerId: siteId, kind: "sharepoint_list", title: str(list.displayName) || str(list.name) || "SharePoint list", deepLink: str(list.webUrl) || null, content: str(list.description), metadata: { siteId, list } });
        const entries = await graph.list(path(`/sites/${encode(siteId)}/lists/${encode(listId)}/items?$expand=fields`)); complete &&= entries.complete;
        for (const item of entries.items) {
          const id = str(item.id); if (!id) continue;
          const fields = item.fields && typeof item.fields === "object" ? item.fields : {};
          await emit({ providerObjectId: `sharepoint-list-item:${siteId}:${listId}:${id}`, containerId: listId, kind: "sharepoint_list_item", title: str(fields.Title) || str(fields.FileLeafRef) || `List item ${id}`, deepLink: str(item.webUrl) || null, content: Object.entries(fields).map(([key, value]) => `${key}: ${typeof value === "string" || typeof value === "number" ? value : JSON.stringify(value)}`).join("\n"), metadata: { siteId, listId, item } });
        }
      }
      const drives = await graph.list(path(`/sites/${encode(siteId)}/drives`)); complete &&= drives.complete;
      for (const drive of drives.items) {
        const driveId = str(drive.id); if (!driveId) continue;
        const pending = [`/drives/${encode(driveId)}/root/children`]; let count = 0;
        while (pending.length && count < 5000) {
          const children = await graph.list(path(pending.shift()!), 5000 - count); complete &&= children.complete;
          for (const item of children.items) {
            const id = str(item.id); if (!id) continue;
            count++;
            const original = await driveFileOriginal(item, budget, driveId);
            if (original.fileMissing) missingFileCount++;
            await emit({ providerObjectId: `sharepoint-drive:${driveId}:${id}`, containerId: str(item.parentReference?.id) || driveId, kind: "drive_file", title: str(item.name) || "SharePoint file", deepLink: str(item.webUrl) || null, content: [str(item.name), original.extractedText].filter(Boolean).join("\n"), metadata: { siteId, driveId, item: safeDriveItem(item), contentDownloaded: original.contentDownloaded, textExtracted: original.extractedText !== null, originalFileCount: original.attachments.length }, attachments: original.attachments });
            if (item.folder) pending.push(`/drives/${encode(driveId)}/items/${encode(id)}/children`);
          }
        }
        if (pending.length) complete = false;
      }
    }
    if (missingFileCount) sharepointLimitations.push(`${missingFileCount} SharePoint file original(s) were not downloaded.`);
    return complete;
  });
  await run("todo", has("Tasks.Read"), async () => {
    const lists = await graph.list(path("/me/todo/lists")); let complete = lists.complete;
    for (const list of lists.items) {
      const listId = str(list.id); if (!listId) continue;
      const tasks = await graph.list(path(`/me/todo/lists/${encode(listId)}/tasks`)); complete &&= tasks.complete;
      for (const task of tasks.items) if (task.id) await emit({ providerObjectId: `todo:${listId}:${task.id}`, containerId: listId, kind: "todo_task", title: str(task.title) || "To Do task", deepLink: null, content: [str(task.title), htmlText(task.body?.content)].filter(Boolean).join("\n"), metadata: { list, task } });
    }
    return complete;
  });
  await run("planner", has("Tasks.Read"), async () => {
    const tasks = await graph.list(path("/me/planner/tasks"));
    for (const task of tasks.items) if (task.id) await emit({ providerObjectId: `planner:${task.id}`, containerId: str(task.planId) || null, kind: "planner_task", title: str(task.title) || "Planner task", deepLink: null, content: str(task.title), metadata: { task } });
    return tasks.complete;
  });
  await run("onenote", has("Notes.Read") || has("Notes.Read.All"), async () => {
    const pages = await graph.list(path("/me/onenote/pages")); let complete = pages.complete;
    for (const page of pages.items) {
      const id = str(page.id); if (!id) continue;
      const html = await graph.getText(path(`/me/onenote/pages/${encode(id)}/content`));
      await emit({ providerObjectId: `onenote:${id}`, containerId: str(page.parentSection?.id) || null, kind: "onenote_page", title: str(page.title) || "OneNote page", deepLink: str(page.links?.oneNoteWebUrl?.href) || null, content: htmlText(html), metadata: { page, html } });
    }
    return complete;
  });
  await run("contacts", has("Contacts.Read"), async () => {
    const contacts = await graph.list(path("/me/contacts"));
    for (const contact of contacts.items) if (contact.id) await emit({ providerObjectId: `contact:${contact.id}`, containerId: str(contact.parentFolderId) || null, kind: "contact", title: str(contact.displayName) || "Contact", deepLink: null, content: [str(contact.displayName), ...(Array.isArray(contact.emailAddresses) ? contact.emailAddresses.map((item:Record<string,unknown>) => str(item.address)) : [])].filter(Boolean).join("\n"), metadata: { contact } });
    return contacts.complete;
  });
  return coverage;
}
