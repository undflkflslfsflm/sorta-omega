import { describe, expect, it, vi } from "vitest";
import { createDesktopBridge } from "./bridge.js";

describe("desktop native bridge", () => {
  it("reads clipboard text only after the explicit command", async () => {
    const invoke = vi.fn(async () => ({ text: "exact clipboard text", mimeType: "text/plain" }));
    const bridge = createDesktopBridge(invoke);

    expect(invoke).not.toHaveBeenCalled();
    await expect(bridge.captureClipboardSelection()).resolves.toEqual({ text: "exact clipboard text", mimeType: "text/plain" });
    expect(invoke).toHaveBeenCalledOnce();
    expect(invoke).toHaveBeenCalledWith("clipboard_capture_selection");
  });

  it("imports a picker-selected file without exposing its local path", async () => {
    const blob={id:"00000000-0000-4000-8000-000000000042",vaultId:"00000000-0000-4000-8000-000000000001",filename:"archive.zip",mediaType:"application/zip",byteLength:70_000_000,sha256:"a".repeat(64),createdAt:"2026-09-22T12:00:00.000Z"};
    const invoke=vi.fn(async()=>blob),bridge=createDesktopBridge(invoke);
    await expect(bridge.importFile(blob.vaultId)).resolves.toEqual(blob);
    expect(invoke).toHaveBeenCalledWith("file_import",{vaultId:blob.vaultId});
    expect(JSON.stringify(await bridge.importFile(blob.vaultId))).not.toContain(":\\\\");
  });

  it("rejects arbitrary workspaces before native IPC", async () => {
    const invoke = vi.fn(async () => undefined);
    const bridge = createDesktopBridge(invoke);

    await expect(bridge.openWorkspace({ workspace: "https://attacker.example" } as never)).rejects.toThrow();
    expect(invoke).not.toHaveBeenCalled();
  });

  it("passes only an allowlisted workspace and validated record id", async () => {
    const invoke = vi.fn(async () => undefined);
    const bridge = createDesktopBridge(invoke);
    const recordId = "00000000-0000-4000-8000-000000000042";

    await bridge.openWorkspace({ workspace: "calendar", recordId });
    expect(invoke).toHaveBeenCalledWith("app_open_workspace", { target: { workspace: "calendar", recordId } });
  });

  it("validates native navigation events before exposing them to the renderer",async()=>{
    let emit:(payload:unknown)=>void=()=>undefined;
    const stop=vi.fn();
    const listen=vi.fn(async(_event:string,handler:(payload:unknown)=>void)=>{emit=handler;return stop;});
    const handler=vi.fn();
    const bridge=createDesktopBridge(vi.fn(),listen);
    const unlisten=await bridge.onNavigate(handler);
    emit({workspace:"calendar",recordId:"00000000-0000-4000-8000-000000000042"});
    expect(handler).toHaveBeenCalledWith({workspace:"calendar",recordId:"00000000-0000-4000-8000-000000000042"});
    expect(()=>emit({workspace:"https://attacker.example",recordId:null})).toThrow();
    unlisten();expect(stop).toHaveBeenCalledOnce();
  });

  it("exposes finite record-navigation commands with validated ids",async()=>{
    const invoke=vi.fn(async()=>undefined),bridge=createDesktopBridge(invoke);
    const id="00000000-0000-4000-8000-000000000042";
    await bridge.launchCalendarView();await bridge.openCalendarEvent(id);await bridge.openCommitment(id);await bridge.navigateToEventSource({kind:"note",recordId:id});
    expect(invoke.mock.calls).toEqual([
      ["launch_calendar_view"],
      ["open_calendar_event",{eventId:id}],
      ["open_commitment",{commitmentId:id}],
      ["navigate_to_event_source",{target:{kind:"note",recordId:id}}]
    ]);
    await expect(bridge.openCalendarEvent("not-an-id")).rejects.toThrow();
    await expect(bridge.navigateToEventSource({kind:"url",recordId:id} as never)).rejects.toThrow();
    await expect(bridge.navigateToEventSource({kind:"task",recordId:"not-an-id"})).rejects.toThrow();
    expect(invoke).toHaveBeenCalledTimes(4);
  });

  it("reads and changes explicit Windows startup state",async()=>{
    const invoke=vi.fn(async(command:string)=>command==="desktop_status"?{shortcut:"Ctrl+Shift+Space",shortcutRegistered:true,startAtLogin:false,platform:"windows"}:undefined);
    const bridge=createDesktopBridge(invoke);
    await expect(bridge.status()).resolves.toMatchObject({startAtLogin:false,shortcutRegistered:true});
    await bridge.setStartAtLogin(true);
    expect(invoke).toHaveBeenLastCalledWith("set_start_at_login",{enabled:true});
  });

  it("returns only a bounded read-only host preflight report",async()=>{
    const checks=[
      ["desktop_runtime","pass"],["docker_cli","pass"],["tailscale_cli","pass"],["ollama_cli","fail"],["node_runtime","pass"],["pnpm_runtime","pass"],["rust_toolchain","unknown"],["hardware_inventory","unknown"],["service_state","unknown"]
    ].map(([kind,status])=>({kind,status,detail:`${kind} ${status}`}));
    const invoke=vi.fn(async()=>({platform:"windows",architecture:"x86_64",checks,mutationsApplied:false,secretsIncluded:false}));
    const bridge=createDesktopBridge(invoke);
    await expect(bridge.hostPreflight()).resolves.toMatchObject({mutationsApplied:false,secretsIncluded:false,checks});
    expect(invoke).toHaveBeenCalledWith("host_preflight");
    await expect(createDesktopBridge(async()=>({...await invoke(),mutationsApplied:true})).hostPreflight()).rejects.toThrow();
  });

  it("accepts only bounded fixed-loopback model inspection results",async()=>{
    const result={runtimes:[
      {backend:"openai_compatible",endpoint:"http://127.0.0.1:8000/v1/models",status:"available",models:[{id:"Qwen/Qwen3.8-Flash-Next",digest:null}],limitation:"Listing proves presence, not capability."},
      {backend:"ollama",endpoint:"http://127.0.0.1:11434/api/tags",status:"available",models:[{id:"qwen3-embedding:0.6b",digest:"a".repeat(64)}],limitation:"Listing proves presence, not capability."}
    ],mutationsApplied:false,credentialsSent:false};
    const invoke=vi.fn(async()=>result),bridge=createDesktopBridge(invoke);
    await expect(bridge.inspectModels()).resolves.toEqual(result);
    expect(invoke).toHaveBeenCalledWith("model_inspect");
    await expect(createDesktopBridge(async()=>({...result,runtimes:[{...result.runtimes[0],endpoint:"http://192.168.1.2:8000/v1/models"},result.runtimes[1]]})).inspectModels()).rejects.toThrow();
  });

  it("rejects malformed native results", async () => {
    const bridge = createDesktopBridge(async () => ({ text: "secret", mimeType: "text/html" }));
    await expect(bridge.captureClipboardSelection()).rejects.toThrow();
  });

  it("keeps pairing secrets outside the renderer contract", async () => {
    const invoke = vi.fn(async () => ({ pairingId: "00000000-0000-4000-8000-000000000042", userCode: "ABCD-2345", expiresAt: "2026-09-20T12:00:00.000Z" }));
    const bridge = createDesktopBridge(invoke);

    await expect(bridge.beginPairing("Viktor's Surface")).resolves.toMatchObject({ userCode: "ABCD-2345" });
    expect(invoke).toHaveBeenCalledWith("native_pairing_begin", { deviceName: "Viktor's Surface" });
    expect(JSON.stringify(await bridge.beginPairing("Laptop"))).not.toContain("deviceCode");
  });

  it("rejects absolute and non-vault URLs before native IPC", async () => {
    const invoke = vi.fn(async () => ({ status: 200, body: null }));
    const bridge = createDesktopBridge(invoke);

    await expect(bridge.apiRequest({ method: "GET", path: "https://attacker.example/api/v1/vaults/x" })).rejects.toThrow();
    await expect(bridge.apiRequest({ method: "GET", path: "/api/v1/auth/sessions" })).rejects.toThrow();
    expect(invoke).not.toHaveBeenCalled();
  });

  it("passes only a validated relative vault request", async () => {
    const invoke = vi.fn(async () => ({ status: 201, body: { id: "created" } }));
    const bridge = createDesktopBridge(invoke);
    const request = { method: "POST" as const, path: "/api/v1/vaults/00000000-0000-4000-8000-000000000042/captures", body: { raw_text: "Remember this" } };

    await expect(bridge.apiRequest(request)).resolves.toEqual({ status: 201, body: { id: "created" } });
    expect(invoke).toHaveBeenCalledWith("native_api_request", { request });
  });
});
