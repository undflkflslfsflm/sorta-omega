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
