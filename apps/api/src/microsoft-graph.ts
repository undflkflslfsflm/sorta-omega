export type GraphSource = {
  providerObjectId: string;
  containerId: string | null;
  kind: string;
  title: string;
  deepLink: string | null;
  content: string;
  metadata: Record<string, unknown>;
};

export type GraphDataset = "classes" | "assignments" | "chats" | "channels" | "calendar" | "mail" | "files" | "sharepoint" | "todo" | "planner" | "onenote" | "contacts";
export type GraphCoverage = { dataset: GraphDataset; imported: number; complete: boolean; contentComplete: boolean; limitations: string[]; error: string | null };

const origin = "https://graph.microsoft.com";
const maxJsonBytes = 8_000_000;
const maxHtmlBytes = 2_000_000;
const maxPages = 100;
const path = (value: string) => `${origin}/v1.0${value}`;
const str = (value: unknown) => typeof value === "string" ? value : "";
const htmlText = (value: unknown) => str(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const encode = (value: string) => encodeURIComponent(value);

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

export function createGraphReader(token: string, fetcher: typeof fetch = fetch) {
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
  return { get, getText, list };
}

export async function collectMicrosoftGraph(token: string, scopes: string[], save: (source: GraphSource) => Promise<void>, fetcher: typeof fetch = fetch): Promise<GraphCoverage[]> {
  const graph = createGraphReader(token, fetcher);
  const granted = new Set(scopes.map(item => item.toLowerCase()));
  const has = (...required: string[]) => required.every(item => granted.has(item.toLowerCase()));
  const coverage: GraphCoverage[] = [];
  async function run(dataset: GraphDataset, authorized: boolean, work: () => Promise<boolean>) {
    const limitations = dataset === "assignments" ? ["Linked assignment file bodies are not downloaded."] : dataset === "files" ? ["File bodies are not downloaded; only file metadata is stored."] : dataset === "sharepoint" ? ["Only followed sites and joined Teams are discovered; other accessible sites may be absent.", "Document bodies are not downloaded; only library metadata and list fields are stored."] : dataset === "mail" ? ["Attachment bodies are not downloaded; message metadata is stored."] : dataset === "chats" || dataset === "channels" ? ["Linked and attached file bodies are not downloaded."] : dataset === "planner" ? ["Only tasks assigned to the signed-in user are collected; entire plans are not yet traversed."] : dataset === "onenote" ? ["Embedded image and attachment bodies are not downloaded."] : dataset === "contacts" ? ["Contacts in nested contact folders are not yet traversed."] : [];
    if (!authorized) { coverage.push({ dataset, imported: 0, complete: false, contentComplete: false, limitations, error: "scope_not_granted" }); return; }
    const start = imported;
    try { const complete = await work(); coverage.push({ dataset, imported: imported - start, complete, contentComplete: complete && limitations.length === 0, limitations, error: complete ? null : "provider_coverage_incomplete" }); }
    catch (error) { coverage.push({ dataset, imported: imported - start, complete: false, contentComplete: false, limitations, error: error instanceof GraphReadError ? error.code : "provider_read_failed" }); }
  }
  let imported = 0;
  async function emit(source: GraphSource) { await save(source); imported++; }
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
    for (const summary of assignments.items) {
      const classId = str(summary.classId), id = str(summary.id);
      if (!classId || !id) continue;
      const detail = await graph.get(path(`/education/classes/${encode(classId)}/assignments/${encode(id)}`));
      const resources = await graph.list(path(`/education/classes/${encode(classId)}/assignments/${encode(id)}/resources`), 1000);
      const submissions = await graph.list(path(`/education/classes/${encode(classId)}/assignments/${encode(id)}/submissions?$expand=outcomes,resources,submittedResources`), 1000);
      complete &&= resources.complete && submissions.complete;
      const title = str(detail.displayName) || str(summary.displayName) || "Assignment";
      await emit({ providerObjectId: `education-assignment:${classId}:${id}`, containerId: classId, kind: "assignment", title, deepLink: str(detail.webUrl) || null,
        content: [title, htmlText(detail.instructions?.content), ...resources.items.map(item => [str(item.displayName), str(item.resource?.webUrl)].filter(Boolean).join(" "))].filter(Boolean).join("\n"),
        metadata: { detail, resources: resources.items, submissions: submissions.items, resourcesComplete: resources.complete, submissionsComplete: submissions.complete, linkedFileContentsDownloaded: false } });
    }
    return complete;
  });
  await run("chats", has("Chat.Read"), async () => {
    const chats = await graph.list(path("/me/chats")); let complete = chats.complete;
    for (const chat of chats.items) {
      const id = str(chat.id); if (!id) continue;
      const messages = await graph.list(path(`/me/chats/${encode(id)}/messages`)); complete &&= messages.complete;
      for (const message of messages.items) {
        if (!message.id) continue;
        await emit({ providerObjectId: `chat:${id}:${message.id}`, containerId: id, kind: "teams_message", title: str(chat.topic) || "Teams chat", deepLink: str(message.webUrl) || null, content: htmlText(message.body?.content), metadata: { chatId: id, message } });
      }
    }
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
          await emit({ providerObjectId: `channel:${teamId}:${channelId}:${message.id}`, containerId: channelId, kind: "teams_message", title: str(channel.displayName) || "Teams channel", deepLink: str(message.webUrl) || null, content: htmlText(message.body?.content), metadata: { teamId, channelId, message } });
          const replies = await graph.list(path(`${base}/${encode(str(message.id))}/replies`)); complete &&= replies.complete;
          for (const reply of replies.items) {
            if (!reply.id) continue;
            await emit({ providerObjectId: `channel-reply:${teamId}:${channelId}:${message.id}:${reply.id}`, containerId: channelId, kind: "teams_message", title: str(channel.displayName) || "Teams channel reply", deepLink: str(reply.webUrl) || null, content: htmlText(reply.body?.content), metadata: { teamId, channelId, parentMessageId: message.id, message: reply } });
          }
        }
      }
    }
    return complete;
  });
  await run("calendar", has("Calendars.Read") || has("Calendars.ReadWrite"), async () => {
    const events = await graph.list(path("/me/events"));
    for (const event of events.items) if (event.id) await emit({ providerObjectId: `event:${event.id}`, containerId: null, kind: "calendar_event", title: str(event.subject) || "Calendar event", deepLink: str(event.webLink) || null, content: [str(event.subject), htmlText(event.body?.content), str(event.location?.displayName)].filter(Boolean).join("\n"), metadata: { event } });
    return events.complete;
  });
  await run("mail", has("Mail.Read"), async () => {
    const messages = await graph.list(path("/me/messages"));
    for (const message of messages.items) if (message.id) await emit({ providerObjectId: `mail:${message.id}`, containerId: str(message.conversationId) || null, kind: "mail_message", title: str(message.subject) || "Email", deepLink: str(message.webLink) || null, content: [str(message.subject), htmlText(message.body?.content)].filter(Boolean).join("\n"), metadata: { message } });
    return messages.complete;
  });
  await run("files", has("Files.Read") || has("Files.Read.All"), async () => {
    const pending = ["/me/drive/root/children"]; let complete = true, count = 0;
    while (pending.length && count < 5000) {
      const children = await graph.list(path(pending.shift()!), 5000 - count); complete &&= children.complete;
      for (const item of children.items) {
        if (!item.id) continue;
        count++;
        await emit({ providerObjectId: `drive:${item.id}`, containerId: str(item.parentReference?.id) || null, kind: "drive_file", title: str(item.name) || "Drive item", deepLink: str(item.webUrl) || null, content: str(item.name), metadata: { item, contentDownloaded: false } });
        if (item.folder) pending.push(`/me/drive/items/${encode(str(item.id))}/children`);
      }
    }
    return complete && pending.length === 0;
  });
  await run("sharepoint", has("Sites.Read.All"), async () => {
    const followed = await graph.list(path("/me/followedSites"));
    let complete = followed.complete;
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
            await emit({ providerObjectId: `sharepoint-drive:${driveId}:${id}`, containerId: str(item.parentReference?.id) || driveId, kind: "drive_file", title: str(item.name) || "SharePoint file", deepLink: str(item.webUrl) || null, content: str(item.name), metadata: { siteId, driveId, item, contentDownloaded: false } });
            if (item.folder) pending.push(`/drives/${encode(driveId)}/items/${encode(id)}/children`);
          }
        }
        if (pending.length) complete = false;
      }
    }
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
