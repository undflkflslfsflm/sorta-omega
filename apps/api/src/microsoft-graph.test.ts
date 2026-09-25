import { describe, expect, it } from "vitest";
import { collectMicrosoftGraph, createGraphReader, type GraphSource } from "./microsoft-graph.js";

const response = (body: unknown, status = 200, headers?: HeadersInit) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

describe("Microsoft Graph ingestion", () => {
  it("follows same-origin pages and rejects an external nextLink before sending a token", async () => {
    const calls: string[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      const url = String(input); calls.push(url);
      return response({ value: [{ id: "first" }], "@odata.nextLink": "https://evil.example/steal" });
    }) as typeof fetch;
    await expect(createGraphReader("secret", fetcher).list("https://graph.microsoft.com/v1.0/me/chats")).rejects.toThrow("graph_nextlink_origin_invalid");
    expect(calls).toEqual(["https://graph.microsoft.com/v1.0/me/chats"]);
  });

  it("rejects a nextLink to another Graph collection before following it", async () => {
    const calls: string[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      calls.push(String(input));
      return response({ value: [{ id: "first" }], "@odata.nextLink": "https://graph.microsoft.com/v1.0/me/messages" });
    }) as typeof fetch;
    await expect(createGraphReader("secret", fetcher).list("https://graph.microsoft.com/v1.0/me/chats")).rejects.toThrow("graph_nextlink_path_invalid");
    expect(calls).toHaveLength(1);
  });

  it("does not retry before a long Graph Retry-After interval", async () => {
    let calls = 0;
    const fetcher = (async () => {
      calls++;
      return response({ error: { code: "TooManyRequests" } }, 429, { "retry-after": "60" });
    }) as typeof fetch;
    await expect(createGraphReader("secret", fetcher).get("https://graph.microsoft.com/v1.0/me/chats")).rejects.toMatchObject({ status: 429, code: "rate_limited" });
    expect(calls).toBe(1);
  });

  it("rejects oversized JSON even without a Content-Length header", async () => {
    const fetcher = (async () => new Response(JSON.stringify({ data: "a".repeat(8_000_000) }), { status: 200 })) as typeof fetch;
    await expect(createGraphReader("secret", fetcher).get("https://graph.microsoft.com/v1.0/me/chats")).rejects.toThrow("graph_content_too_large");
  });

  it("captures assignment detail and resource contents rather than only a title", async () => {
    const sources: GraphSource[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      const url = new URL(String(input));
      if (url.pathname === "/v1.0/education/me/assignments") return response({ value: [{ id: "a1", classId: "c1", displayName: "Essay" }] });
      if (url.pathname === "/v1.0/education/classes/c1/assignments/a1") return response({ id: "a1", displayName: "Essay", instructions: { content: "<p>Read chapter &amp; write notes</p>" }, dueDateTime: "2026-10-01T12:00:00Z" });
      if (url.pathname.endsWith("/submissions/s1/resources") || url.pathname.endsWith("/submissions/s1/submittedResources") || url.pathname.endsWith("/submissions/s1/outcomes")) return response({ value: [] });
      if (url.pathname.endsWith("/resources")) return response({ value: [{ displayName: "Worksheet", resource: { webUrl: "https://school.example/file" } }] });
      if (url.pathname.endsWith("/submissions")) return response({ value: [{ id: "s1", status: "submitted" }] });
      throw new Error(`unexpected ${url.pathname}`);
    }) as typeof fetch;
    const coverage = await collectMicrosoftGraph("secret", ["EduAssignments.Read"], async item => { sources.push(item); }, fetcher);
    expect(sources).toHaveLength(1);
    expect(sources[0].content).toContain("Read chapter & write notes");
    expect(sources[0].content).toContain("Worksheet");
    expect(sources[0].metadata.detail).toMatchObject({ dueDateTime: "2026-10-01T12:00:00Z" });
    expect(sources[0].metadata.submissions).toMatchObject([{ id: "s1", status: "submitted" }]);
    expect(coverage.find(item => item.dataset === "assignments")).toMatchObject({ imported: 1, complete: true, error: null });
    expect(coverage.find(item => item.dataset === "chats")?.error).toBe("scope_not_granted");
  });

  it("captures authorized assignment file bytes without forwarding the Graph token to the download host", async () => {
    const sources: GraphSource[] = [];
    const fileUrl = "https://graph.microsoft.com/v1.0/drives/drive-1/items/file-1";
    const temporaryUrl = "https://school.sharepoint.com/download?temporary=secret";
    const calls: Array<{url:string;authorization:string|null}> = [];
    const fetcher = (async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input); calls.push({url,authorization:new Headers(init?.headers).get("authorization")});
      const path = new URL(url).pathname;
      if (path === "/v1.0/education/me/assignments") return response({ value: [{ id: "a1", classId: "c1" }] });
      if (path === "/v1.0/education/classes/c1/assignments/a1") return response({ id: "a1", displayName: "Maths worksheet", instructions: { content: "Read the attached file" } });
      if (path.endsWith("/resources")) return response({ value: [{ resource: { displayName: "questions.txt", fileUrl } }] });
      if (path.endsWith("/submissions")) return response({ value: [] });
      if (url === fileUrl) return response({ id: "file-1", file: { mimeType: "text/plain" }, size: 9, "@microsoft.graph.downloadUrl": temporaryUrl });
      if (url === temporaryUrl) return new Response("Exercises", {status: 200});
      throw new Error(`unexpected ${path}`);
    }) as typeof fetch;
    const coverage = await collectMicrosoftGraph("secret", ["EduAssignments.Read", "Files.Read.All"], async item => { sources.push(item); }, fetcher);
    const assignment = sources.find(item => item.kind === "assignment")!;
    expect(assignment.attachments).toMatchObject([{filename:"questions.txt",mediaType:"text/plain"}]);
    expect(new TextDecoder().decode(assignment.attachments![0].bytes)).toBe("Exercises");
    expect(assignment.metadata).not.toHaveProperty("@microsoft.graph.downloadUrl");
    expect(calls.find(call=>call.url===temporaryUrl)?.authorization).toBeNull();
    expect(coverage.find(item=>item.dataset==="assignments")).toMatchObject({complete:true,contentComplete:true,limitations:[]});
  });

  it("rejects an untrusted assignment download host without sending it a request", async () => {
    const calls: string[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      const url = String(input);calls.push(url);
      if (url === "https://graph.microsoft.com/v1.0/drives/d/items/i") return response({id:"i",file:{mimeType:"text/plain"},size:3,"@microsoft.graph.downloadUrl":"https://evil.example/secret"});
      throw new Error(`unexpected ${url}`);
    }) as typeof fetch;
    await expect(createGraphReader("secret",fetcher).downloadAssignmentFile("https://graph.microsoft.com/v1.0/drives/d/items/i")).rejects.toThrow("graph_download_host_untrusted");
    expect(calls).toEqual(["https://graph.microsoft.com/v1.0/drives/d/items/i"]);
  });

  it("retains working and submitted resource originals with their submission provenance", async () => {
    const sources: GraphSource[]=[];
    const workingUrl="https://graph.microsoft.com/v1.0/drives/d/items/working";
    const submittedUrl="https://graph.microsoft.com/v1.0/drives/d/items/submitted";
    const fetcher=(async(input:string|URL|Request)=>{
      const url=String(input),path=new URL(url).pathname;
      if(path==="/v1.0/education/me/assignments")return response({value:[{id:"a",classId:"c"}]});
      if(path==="/v1.0/education/classes/c/assignments/a")return response({id:"a",displayName:"Maths"});
      if(path.endsWith("/assignments/a/resources"))return response({value:[]});
      if(path.endsWith("/assignments/a/submissions"))return response({value:[{id:"mine",status:"submitted",outcomes:[{id:"mark"}]}]});
      if(path.endsWith("/submissions/mine/resources"))return response({value:[{id:"w",resource:{displayName:"draft.txt",fileUrl:workingUrl}}]});
      if(path.endsWith("/submissions/mine/submittedResources"))return response({value:[{id:"s",resource:{displayName:"final.txt",fileUrl:submittedUrl}}]});
      if(path.endsWith("/submissions/mine/outcomes"))return response({value:[{id:"mark", "@odata.type":"#microsoft.graph.educationPointsOutcome", publishedPoints:{points:4}}]});
      if(url===workingUrl)return response({file:{mimeType:"text/plain"},size:5,"@microsoft.graph.downloadUrl":"https://school.sharepoint.com/draft"});
      if(url===submittedUrl)return response({file:{mimeType:"text/plain"},size:5,"@microsoft.graph.downloadUrl":"https://school.sharepoint.com/final"});
      if(path==="/draft")return new Response("Draft",{status:200});
      if(path==="/final")return new Response("Final",{status:200});
      throw new Error(`unexpected ${url}`);
    }) as typeof fetch;
    const coverage=await collectMicrosoftGraph("secret",["EduAssignments.Read","Files.Read.All"],async item=>{sources.push(item);},fetcher);
    expect(sources[0].attachments?.map(item=>new TextDecoder().decode(item.bytes))).toEqual(["Draft","Final"]);
    expect(sources[0].metadata.attachmentManifest).toMatchObject([{index:0,role:"working",submissionId:"mine",resourceId:"w"},{index:1,role:"submitted",submissionId:"mine",resourceId:"s"}]);
    expect(sources[0].metadata.submissions).toMatchObject([{outcomes:[{id:"mark"}]}]);
    expect(sources[0].metadata.submissionDetails).toMatchObject([{submissionId:"mine",outcomes:[{publishedPoints:{points:4}}],outcomesComplete:true}]);
    expect(coverage.find(item=>item.dataset==="assignments")).toMatchObject({complete:true,contentComplete:true});
  });

  it("keeps readable submission resources while reporting an unreadable outcome list", async () => {
    const sources: GraphSource[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      const pathname = new URL(String(input)).pathname;
      if (pathname === "/v1.0/education/me/assignments") return response({ value: [{ id: "a", classId: "c" }] });
      if (pathname === "/v1.0/education/classes/c/assignments/a") return response({ id: "a", displayName: "Maths" });
      if (pathname.endsWith("/assignments/a/resources")) return response({ value: [] });
      if (pathname.endsWith("/assignments/a/submissions")) return response({ value: [{ id: "mine", outcomes: [{ id: "expanded" }] }] });
      if (pathname.endsWith("/submissions/mine/resources")) return response({ value: [{ id: "work", resource: { displayName: "working link", webUrl: "https://school.example/work" } }] });
      if (pathname.endsWith("/submissions/mine/submittedResources")) return response({ value: [] });
      if (pathname.endsWith("/submissions/mine/outcomes")) return response({ error: "forbidden" }, 403);
      throw new Error(`unexpected ${pathname}`);
    }) as typeof fetch;
    const coverage = await collectMicrosoftGraph("secret", ["EduAssignments.Read"], async item => { sources.push(item); }, fetcher);
    expect(sources[0].metadata.submissionDetails).toMatchObject([{ resources: [{ id: "work" }], outcomes: [{ id: "expanded" }], outcomesComplete: false }]);
    expect(coverage.find(item => item.dataset === "assignments")).toMatchObject({ complete: false, contentComplete: false, error: "provider_coverage_incomplete" });
  });

  it("collects education classes as course evidence before assignments", async () => {
    const sources: GraphSource[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      const url = new URL(String(input));
      if (url.pathname === "/v1.0/education/me/classes") return response({ value: [{ id: "class-1", displayName: "Mathematics 1P", classCode: "1P" }] });
      if (url.pathname === "/v1.0/education/me/assignments") return response({ value: [] });
      throw new Error(`unexpected ${url.pathname}`);
    }) as typeof fetch;
    const coverage = await collectMicrosoftGraph("secret", ["EduRoster.ReadBasic", "EduAssignments.Read"], async item => { sources.push(item); }, fetcher);
    expect(sources).toMatchObject([{ providerObjectId: "education-class:class-1", kind: "school_class", title: "Mathematics 1P" }]);
    expect(coverage.find(item => item.dataset === "classes")).toMatchObject({ imported: 1, complete: true, error: null });
  });

  it("marks missing provider permissions as incomplete, not a successful empty sync", async () => {
    const coverage = await collectMicrosoftGraph("secret", [], async () => { throw new Error("must not save"); });
    expect(coverage).toHaveLength(12);
    expect(coverage.every(item => !item.complete && item.error === "scope_not_granted")).toBe(true);
  });

  it("collects To Do tasks and OneNote page bodies with separate coverage", async () => {
    const sources: GraphSource[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      const url = new URL(String(input));
      if (url.pathname === "/v1.0/me/todo/lists") return response({ value: [{ id: "list-1", displayName: "School" }] });
      if (url.pathname === "/v1.0/me/todo/lists/list-1/tasks") return response({ value: [{ id: "task-1", title: "Homework", body: { content: "<p>Page 10</p>" } }] });
      if (url.pathname === "/v1.0/me/planner/tasks") return response({ value: [] });
      if (url.pathname === "/v1.0/me/onenote/pages") return response({ value: [{ id: "page-1", title: "Notes" }] });
      if (url.pathname === "/v1.0/me/onenote/pages/page-1/content") return new Response("<html><body>Full lesson notes</body></html>", { status: 200 });
      throw new Error(`unexpected ${url.pathname}`);
    }) as typeof fetch;
    const coverage = await collectMicrosoftGraph("secret", ["Tasks.Read", "Notes.Read"], async item => { sources.push(item); }, fetcher);
    expect(sources.map(item => item.kind)).toEqual(["todo_task", "onenote_page"]);
    expect(sources[1].content).toContain("Full lesson notes");
    expect(coverage.find(item => item.dataset === "onenote")).toMatchObject({ imported: 1, complete: true, contentComplete: false });
  });

  it("collects followed SharePoint list fields and nested document-library metadata", async () => {
    const sources: GraphSource[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      const url = new URL(String(input));
      if (url.pathname === "/v1.0/me/followedSites") return response({ value: [{ id: "school,site,web", displayName: "School" }] });
      if (url.pathname === "/v1.0/sites/school%2Csite%2Cweb/lists") return response({ value: [{ id: "lessons", displayName: "Lessons" }] });
      if (url.pathname === "/v1.0/sites/school%2Csite%2Cweb/lists/lessons/items") return response({ value: [{ id: "1", fields: { Title: "Physics", Room: "A101" } }] });
      if (url.pathname === "/v1.0/sites/school%2Csite%2Cweb/drives") return response({ value: [{ id: "drive-1" }] });
      if (url.pathname === "/v1.0/drives/drive-1/root/children") return response({ value: [{ id: "folder", name: "Class files", folder: {} }] });
      if (url.pathname === "/v1.0/drives/drive-1/items/folder/children") return response({ value: [{ id: "file", name: "Worksheet.docx" }] });
      throw new Error(`unexpected ${url.pathname}`);
    }) as typeof fetch;
    const coverage = await collectMicrosoftGraph("secret", ["Sites.Read.All"], async item => { sources.push(item); }, fetcher);
    expect(sources.map(item => item.kind)).toEqual(["sharepoint_site", "sharepoint_list", "sharepoint_list_item", "drive_file", "drive_file"]);
    expect(sources.find(item => item.kind === "sharepoint_list_item")?.content).toContain("Room: A101");
    expect(coverage.find(item => item.dataset === "sharepoint")).toMatchObject({ imported: 5, complete: true, contentComplete: false, error: null });
  });

  it("reports a joined Team site access gap while retaining accessible SharePoint data", async () => {
    const sources: GraphSource[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      const url = new URL(String(input));
      if (url.pathname === "/v1.0/me/followedSites") return response({ value: [{ id: "followed", displayName: "Followed" }] });
      if (url.pathname === "/v1.0/me/joinedTeams") return response({ value: [{ id: "class-1" }] });
      if (url.pathname === "/v1.0/groups/class-1/sites/root") return response({ error: { code: "accessDenied" } }, 403);
      if (url.pathname === "/v1.0/sites/followed/lists" || url.pathname === "/v1.0/sites/followed/drives") return response({ value: [] });
      throw new Error(`unexpected ${url.pathname}`);
    }) as typeof fetch;
    const coverage = await collectMicrosoftGraph("secret", ["Sites.Read.All", "Team.ReadBasic.All"], async item => { sources.push(item); }, fetcher);
    expect(sources.map(item => item.providerObjectId)).toEqual(["sharepoint-site:followed"]);
    expect(coverage.find(item => item.dataset === "sharepoint")).toMatchObject({ imported: 1, complete: false, error: "provider_coverage_incomplete" });
  });
});
