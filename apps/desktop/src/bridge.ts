import {
  nativeClipboardCaptureSchema,
  nativeDesktopStatusSchema,
  nativePickedFileSchema,
  nativePairingChallengeSchema,
  nativePairingStatusSchema,
  nativeAuthStatusSchema,
  nativeApiRequestSchema,
  nativeApiResponseSchema,
  nativeWorkspaceTargetSchema,
  type NativeApiRequest,
  type NativeApiResponse,
  type NativeAuthStatus,
  type NativeClipboardCapture,
  type NativeDesktopStatus,
  type NativePairingChallenge,
  type NativePairingStatus,
  type NativePickedFile,
  type NativeWorkspaceTarget
} from "@sorta/contracts";

export type NativeInvoke = (command: string, arguments_?: Record<string, unknown>) => Promise<unknown>;

export function createDesktopBridge(invoke: NativeInvoke) {
  return {
    openCapture: async () => { await invoke("capture_open"); },
    async captureClipboardSelection(): Promise<NativeClipboardCapture> {
      return nativeClipboardCaptureSchema.parse(await invoke("clipboard_capture_selection"));
    },
    async pickImportFile(): Promise<NativePickedFile | null> {
      const value = await invoke("file_import_pick");
      return value === null ? null : nativePickedFileSchema.parse(value);
    },
    async openWorkspace(target: NativeWorkspaceTarget): Promise<void> {
      const validated = nativeWorkspaceTargetSchema.parse(target);
      await invoke("app_open_workspace", { target: validated });
    },
    async status(): Promise<NativeDesktopStatus> {
      return nativeDesktopStatusSchema.parse(await invoke("desktop_status"));
    },
    setStartAtLogin: async (enabled: boolean) => { await invoke("set_start_at_login", { enabled }); },
    async beginPairing(deviceName: string): Promise<NativePairingChallenge> {
      const validatedName = deviceName.trim();
      if (!validatedName || validatedName.length > 120) throw new Error("Device name must contain 1 to 120 characters");
      return nativePairingChallengeSchema.parse(await invoke("native_pairing_begin", { deviceName: validatedName }));
    },
    async pollPairing(): Promise<NativePairingStatus> {
      return nativePairingStatusSchema.parse(await invoke("native_pairing_poll"));
    },
    async authStatus(): Promise<NativeAuthStatus> {
      return nativeAuthStatusSchema.parse(await invoke("native_auth_status"));
    },
    async apiRequest(request: NativeApiRequest): Promise<NativeApiResponse> {
      const validated = nativeApiRequestSchema.parse(request);
      return nativeApiResponseSchema.parse(await invoke("native_api_request", { request: validated }));
    },
    async unpair(): Promise<void> { await invoke("native_unpair"); }
  };
}
