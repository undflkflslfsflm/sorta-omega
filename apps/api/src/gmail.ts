import { extractDocumentText } from "./document-text.js";

export type GmailSource = {
  providerObjectId: string;
  containerId: string | null;
  kind: "mail_message";
  title: string;
  deepLink: null;
  content: string;
  metadata: Record<string, unknown>;
  attachments: Array<{ filename: string; mediaType: string; bytes: Uint8Array }>;
};
export type GmailCoverage = {
  dataset: "mail";
  imported: number;
  complete: boolean;
  contentComplete: boolean;
  limitations: string[];
  error: string | null;
  nextPageToken: string | null;
};

const origin = "https://gmail.googleapis.com";
const base = `${origin}/gmail/v1/users/me/messages`;
const maxJsonBytes = 8_000_000;
const maxAttachmentBytes = 20_000_000;
const maxAttachmentsPerMessage = 100;
const maxMessages = 10_000;
const maxPages = 20;
const maxSourceText = 1_000_000;
const str = (value: unknown) => typeof value === "string" ? value : "";
const htmlText = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

function decodeBase64Url(value: unknown, maximum: number): Uint8Array {
  if (typeof value !== "string" || value.length > Math.ceil(maximum * 4 / 3) + 8 || !/^[A-Za-z0-9_-]*={0,2}$/.test(value)) throw new Error("gmail_base64_invalid_or_too_large");
  const bytes = Buffer.from(value, "base64url");
  if (bytes.byteLength > maximum) throw new Error("gmail_decoded_part_too_large");
  return bytes;
}

async function boundedJson(response: Response, maximum = maxJsonBytes): Promise<Record<string, any>> {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maximum) throw new Error("gmail_response_too_large");
  const reader = response.body?.getReader();
  if (!reader) throw new Error("gmail_response_empty");
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maximum) throw new Error("gmail_response_too_large");
      chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => undefined); }
  const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("gmail_response_invalid");
  return parsed as Record<string, any>;
}

function flattenParts(root: Record<string, any>): { parts: Record<string, any>[]; complete: boolean } {
  const pending = [{ part: root, depth: 0 }];
  const parts: Record<string, any>[] = [];
  let complete = true;
  while (pending.length && parts.length < 100) {
    const { part, depth } = pending.shift()!;
    parts.push(part);
    if (Array.isArray(part.parts)) {
      if (depth >= 10) { complete = false; continue; }
      pending.push(...part.parts.filter((item: unknown) => item && typeof item === "object" && !Array.isArray(item)).map((item: Record<string, any>) => ({ part: item, depth: depth + 1 })));
    }
  }
  if (pending.length) complete = false;
  return { parts, complete };
}

function header(message: Record<string, any>, name: string): string {
  return str((Array.isArray(message.payload?.headers) ? message.payload.headers : []).find((item: Record<string, any>) => str(item.name).toLowerCase() === name)?.value).slice(0, 1000);
}

export async function collectGmail(token: string, scopes: string[], save: (source: GmailSource) => Promise<void>, fetcher: typeof fetch = fetch, startPageToken: string | null = null): Promise<GmailCoverage> {
  const coverage: GmailCoverage = { dataset: "mail", imported: 0, complete: false, contentComplete: false, limitations: [], error: null, nextPageToken: startPageToken };
  if (!scopes.some(scope => scope.toLowerCase() === "https://www.googleapis.com/auth/gmail.readonly")) {
    coverage.error = "scope_not_granted";
    return coverage;
  }
  async function get(url: URL, maximum = maxJsonBytes): Promise<Record<string, any>> {
    if (url.origin !== origin || !url.pathname.startsWith("/gmail/v1/users/me/messages") || url.username || url.password || url.hash) throw new Error("gmail_url_invalid");
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await fetcher(url, { headers: { authorization: `Bearer ${token}`, accept: "application/json" }, redirect: "error", signal: AbortSignal.timeout(20_000) });
      if ((response.status === 429 || response.status >= 500) && attempt < 2) {
        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
        continue;
      }
      if (!response.ok) throw new Error(response.status === 400 ? "gmail_bad_request" : response.status === 401 ? "gmail_authorization_required" : response.status === 403 ? "gmail_permission_denied" : response.status === 429 ? "gmail_rate_limited" : "gmail_provider_failed");
      return boundedJson(response, maximum);
    }
    throw new Error("gmail_retry_exhausted");
  }

  let pageToken: string | null = startPageToken;
  const seenPages = new Set<string>();
  const seenMessages = new Set<string>();
  try {
    for (let pageIndex = 0; pageIndex < maxPages && coverage.imported < maxMessages; pageIndex++) {
      const listUrl = new URL(base);
      listUrl.searchParams.set("maxResults", "500");
      listUrl.searchParams.set("includeSpamTrash", "true");
      if (pageToken) {
        if (seenPages.has(pageToken)) throw new Error("gmail_pagination_cycle");
        seenPages.add(pageToken);
        listUrl.searchParams.set("pageToken", pageToken);
      }
      const listed = await get(listUrl);
      if (listed.messages !== undefined && !Array.isArray(listed.messages)) throw new Error("gmail_list_invalid");
      for (const summary of listed.messages ?? []) {
        if (coverage.imported >= maxMessages) break;
        const id = str(summary?.id);
        if (!/^[A-Za-z0-9_-]{1,128}$/.test(id) || seenMessages.has(id)) continue;
        seenMessages.add(id);
        let message: Record<string, any>;
        try {
          const url = new URL(`${base}/${encodeURIComponent(id)}`);
          url.searchParams.set("format", "full");
          message = await get(url);
        } catch { coverage.limitations.push("Some Gmail message details could not be read."); continue; }
        const payload = message.payload && typeof message.payload === "object" ? message.payload as Record<string, any> : {};
        const flattened = flattenParts(payload);
        if (!flattened.complete) coverage.limitations.push("Some nested Gmail MIME parts exceed the import limit.");
        const plainBodies: string[] = [], htmlBodies: string[] = [], attachmentTexts: string[] = [];
        const attachments: GmailSource["attachments"] = [];
        const attachmentManifest: Array<{ index: number; partId: string | null; filename: string; complete: boolean; reason: string | null }> = [];
        let totalBytes = 0;
        for (const part of flattened.parts) {
          const mimeType = str(part.mimeType).split(";", 1)[0].toLowerCase();
          const filename = str(part.filename).slice(0, 240);
          const body = part.body && typeof part.body === "object" ? part.body as Record<string, any> : {};
          const attachmentId = str(body.attachmentId);
          if (!filename && (mimeType === "text/plain" || mimeType === "text/html")) {
            try {
              const raw = attachmentId ? await get(new URL(`${base}/${encodeURIComponent(id)}/attachments/${encodeURIComponent(attachmentId)}`), 28_000_000) : body;
              const decoded = new TextDecoder("utf-8", { fatal: true }).decode(decodeBase64Url(raw.data, maxAttachmentBytes));
              (mimeType === "text/html" ? htmlBodies : plainBodies).push(mimeType === "text/html" ? htmlText(decoded) : decoded.trim());
            } catch { coverage.limitations.push("Some Gmail message body parts could not be decoded."); }
            continue;
          }
          if (!filename && !attachmentId && !body.data) continue;
          const displayedName = filename || `inline-${attachments.length + 1}`;
          if (attachments.length >= maxAttachmentsPerMessage || totalBytes >= 100_000_000 || Number(body.size) > maxAttachmentBytes) { coverage.limitations.push("Some Gmail attachments exceed import limits."); continue; }
          try {
            const raw = attachmentId ? await get(new URL(`${base}/${encodeURIComponent(id)}/attachments/${encodeURIComponent(attachmentId)}`), 28_000_000) : body;
            const bytes = decodeBase64Url(raw.data, maxAttachmentBytes);
            if (totalBytes + bytes.byteLength > 100_000_000) throw new Error("gmail_attachment_budget");
            totalBytes += bytes.byteLength;
            attachments.push({ filename: displayedName, mediaType: mimeType || "application/octet-stream", bytes });
            const extracted = await extractDocumentText(bytes, displayedName, mimeType).catch(() => ({ text: null, complete: false, reason: "extraction_failed" }));
            if (extracted.text) attachmentTexts.push(`[Attachment: ${displayedName}]\n${extracted.text}`);
            attachmentManifest.push({ index: attachments.length - 1, partId: str(part.partId) || null, filename: displayedName, complete: extracted.complete, reason: extracted.reason });
            if (!extracted.complete) coverage.limitations.push("Some Gmail attachment text could not be extracted; originals were retained.");
          } catch { coverage.limitations.push("Some Gmail attachments could not be downloaded or decoded."); }
        }
        const subject = header(message, "subject") || "Email";
        const messageBodies = plainBodies.length ? plainBodies : htmlBodies;
        const unboundedText = [subject, header(message, "from"), header(message, "to"), ...(messageBodies.length ? messageBodies : [str(message.snippet)]), ...attachmentTexts].filter(Boolean).join("\n");
        const text = unboundedText.slice(0, maxSourceText);
        if (unboundedText.length > maxSourceText) coverage.limitations.push("Some Gmail message text exceeded the per-source limit.");
        const source: GmailSource = {
          providerObjectId: `gmail:${id}`,
          containerId: str(message.threadId) || null,
          kind: "mail_message",
          title: subject,
          deepLink: null,
          content: text,
          metadata: { messageId: id, threadId: str(message.threadId) || null, internalDate: str(message.internalDate) || null, labelIds: Array.isArray(message.labelIds) ? message.labelIds.filter((item: unknown) => typeof item === "string") : [], headers: { from: header(message, "from"), to: header(message, "to"), date: header(message, "date"), subject }, attachmentManifest, textTruncated: unboundedText.length > maxSourceText },
          attachments
        };
        await save(source);
        coverage.imported++;
      }
      pageToken = str(listed.nextPageToken) || null;
      coverage.nextPageToken = pageToken;
      if (!pageToken) { coverage.complete = true; break; }
    }
    if (!coverage.complete) coverage.limitations.push("Gmail backfill reached the per-sync page limit; older messages are not yet imported.");
  } catch (error) {
    coverage.error = error instanceof Error && /^gmail_[a-z_]+$/.test(error.message) ? error.message : "gmail_read_failed";
    if (coverage.error === "gmail_bad_request" && startPageToken && coverage.imported === 0) {
      coverage.nextPageToken = null;
      coverage.error = "gmail_backfill_cursor_invalid";
      coverage.limitations.push("The saved Gmail backfill cursor was rejected; the next sync will restart enumeration.");
    }
  }
  coverage.limitations = [...new Set(coverage.limitations)];
  coverage.contentComplete = coverage.complete && coverage.limitations.length === 0 && !coverage.error;
  return coverage;
}
