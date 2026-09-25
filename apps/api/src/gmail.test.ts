import { describe, expect, it } from "vitest";
import { collectGmail, type GmailSource } from "./gmail.js";

const scope = "https://www.googleapis.com/auth/gmail.readonly";
const encoded = (value: string) => Buffer.from(value).toString("base64url");
const json = (value: unknown) => new Response(JSON.stringify(value), { status: 200, headers: { "content-type": "application/json" } });

describe("Gmail read-only collection", () => {
  it("pages full messages, decodes bodies, and retains original attachments", async () => {
    const sources: GmailSource[] = [], calls: Array<{ path: string; token: string | null }> = [];
    const fetcher = (async (input: string | URL | Request, init?: RequestInit) => {
      const url = new URL(String(input));
      calls.push({ path: `${url.pathname}${url.search}`, token: new Headers(init?.headers).get("authorization") });
      if (url.pathname === "/gmail/v1/users/me/messages" && !url.searchParams.has("pageToken")) return json({ messages: [{ id: "one" }], nextPageToken: "next" });
      if (url.pathname === "/gmail/v1/users/me/messages" && url.searchParams.get("pageToken") === "next") return json({ messages: [{ id: "two" }] });
      if (url.pathname === "/gmail/v1/users/me/messages/one") return json({ id: "one", threadId: "thread-1", payload: { mimeType: "multipart/mixed", headers: [{ name: "Subject", value: "Math test" }, { name: "From", value: "teacher@example.com" }], parts: [
        { mimeType: "text/plain", body: { data: encoded("Bring calculator") } },
        { mimeType: "text/plain", filename: "revision.txt", partId: "2", body: { attachmentId: "att-1", size: 13 } }
      ] } });
      if (url.pathname === "/gmail/v1/users/me/messages/one/attachments/att-1") return json({ data: encoded("Chapter notes") });
      if (url.pathname === "/gmail/v1/users/me/messages/two") return json({ id: "two", threadId: "thread-2", payload: { mimeType: "text/html", headers: [{ name: "subject", value: "Homework" }], body: { data: encoded("<p>Submit Friday</p>") } } });
      throw new Error(`unexpected ${url}`);
    }) as typeof fetch;
    const coverage = await collectGmail("secret", [scope], async source => { sources.push(source); }, fetcher);
    expect(coverage).toMatchObject({ imported: 2, complete: true, contentComplete: true, limitations: [], nextPageToken: null });
    expect(sources[0].content).toContain("Bring calculator");
    expect(sources[0].content).toContain("[Attachment: revision.txt]\nChapter notes");
    expect(new TextDecoder().decode(sources[0].attachments[0].bytes)).toBe("Chapter notes");
    expect(sources[0].metadata.attachmentManifest).toMatchObject([{ index: 0, filename: "revision.txt", complete: true }]);
    expect(sources[1].content).toContain("Submit Friday");
    expect(calls.every(call => call.token === "Bearer secret")).toBe(true);
    expect(calls).toHaveLength(5);
  });

  it("requires the dedicated Gmail scope and does not make a request without it", async () => {
    let called = false;
    const fetcher = (async () => { called = true; throw new Error("should not fetch"); }) as typeof fetch;
    const coverage = await collectGmail("secret", ["https://www.googleapis.com/auth/calendar.readonly"], async () => {}, fetcher);
    expect(coverage).toMatchObject({ error: "scope_not_granted", imported: 0, complete: false });
    expect(called).toBe(false);
  });

  it("resumes an older-mail backfill from its saved page token", async () => {
    const calls: string[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      const url = new URL(String(input));
      calls.push(url.toString());
      if (url.pathname === "/gmail/v1/users/me/messages" && url.searchParams.get("pageToken") === "resume") return json({ messages: [] });
      throw new Error(`unexpected ${url}`);
    }) as typeof fetch;
    const coverage = await collectGmail("secret", [scope], async () => {}, fetcher, "resume");
    expect(coverage).toMatchObject({ imported: 0, complete: true, nextPageToken: null });
    expect(calls).toHaveLength(1);
  });

  it("clears a rejected backfill cursor so the next sync can restart", async () => {
    const fetcher = (async () => new Response("{}", { status: 400 })) as typeof fetch;
    const coverage = await collectGmail("secret", [scope], async () => {}, fetcher, "expired");
    expect(coverage).toMatchObject({ error: "gmail_backfill_cursor_invalid", nextPageToken: null, imported: 0 });
  });

  it("keeps a message when an attachment cannot be decoded", async () => {
    const sources: GmailSource[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      const url = new URL(String(input));
      if (url.pathname === "/gmail/v1/users/me/messages") return json({ messages: [{ id: "one" }] });
      if (url.pathname === "/gmail/v1/users/me/messages/one") return json({ id: "one", payload: { mimeType: "multipart/mixed", headers: [{ name: "Subject", value: "Materials" }], parts: [{ mimeType: "application/pdf", filename: "test.pdf", body: { data: "%%%", size: 3 } }] } });
      throw new Error(`unexpected ${url}`);
    }) as typeof fetch;
    const coverage = await collectGmail("secret", [scope], async source => { sources.push(source); }, fetcher);
    expect(sources).toHaveLength(1);
    expect(sources[0].content).toContain("Materials");
    expect(sources[0].attachments).toHaveLength(0);
    expect(coverage).toMatchObject({ imported: 1, complete: true, contentComplete: false });
    expect(coverage.limitations).toContain("Some Gmail attachments could not be downloaded or decoded.");
  });
});
