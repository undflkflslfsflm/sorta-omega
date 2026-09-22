import {
  idSchema,
  blobSummarySchema,
  nativeClipboardCaptureSchema,
  nativeDesktopStatusSchema,
  nativePairingChallengeSchema,
  nativePairingStatusSchema,
  nativeAuthStatusSchema,
  nativeApiRequestSchema,
  nativeApiResponseSchema,
  nativeEventSourceTargetSchema,
  nativeHostPreflightSchema,
  nativeModelInspectionSchema,
  nativeWorkspaceTargetSchema,
  type NativeApiRequest,
  type NativeApiResponse,
  type NativeAuthStatus,
  type NativeClipboardCapture,
  type NativeDesktopStatus,
  type NativePairingChallenge,
  type NativePairingStatus,
  type BlobSummary,
  type NativeEventSourceTarget,
  type NativeHostPreflight,
  type NativeModelInspection,
  type NativeWorkspaceTarget
} from "@sorta/contracts";

export type NativeInvoke = (command: string, arguments_?: Record<string, unknown>) => Promise<unknown>;
export type NativeListen = (event: string, handler: (payload: unknown) => void) => Promise<() => void>;

export function createDesktopBridge(invoke: NativeInvoke,listen?:NativeListen) {
  return {
    openCapture: async () => { await invoke("capture_open"); },
    async captureClipboardSelection(): Promise<NativeClipboardCapture> {
      return nativeClipboardCaptureSchema.parse(await invoke("clipboard_capture_selection"));
    },
    async importFile(vaultId: string): Promise<BlobSummary | null> {
      const validatedVaultId = idSchema.parse(vaultId);
      const value = await invoke("file_import", { vaultId: validatedVaultId });
      return value === null ? null : blobSummarySchema.parse(value);
    },
    async openWorkspace(target: NativeWorkspaceTarget): Promise<void> {
      const validated = nativeWorkspaceTargetSchema.parse(target);
      await invoke("app_open_workspace", { target: validated });
    },
    launchCalendarView:async()=>{await invoke("launch_calendar_view");},
    async openCalendarEvent(eventId:string):Promise<void>{
      const id=idSchema.parse(eventId);
      await invoke("open_calendar_event",{eventId:id});
    },
    async openCommitment(commitmentId:string):Promise<void>{
      const id=idSchema.parse(commitmentId);
      await invoke("open_commitment",{commitmentId:id});
    },
    async navigateToEventSource(target:NativeEventSourceTarget):Promise<void>{
      const validated=nativeEventSourceTargetSchema.parse(target);
      await invoke("navigate_to_event_source",{target:validated});
    },
    async hostPreflight():Promise<NativeHostPreflight>{
      return nativeHostPreflightSchema.parse(await invoke("host_preflight"));
    },
    async inspectModels():Promise<NativeModelInspection>{
      return nativeModelInspectionSchema.parse(await invoke("model_inspect"));
    },
    async onNavigate(handler:(target:NativeWorkspaceTarget)=>void):Promise<()=>void>{
      if(!listen)throw new Error("Native event listener is unavailable");
      return listen("desktop:navigate",payload=>handler(nativeWorkspaceTargetSchema.parse(payload)));
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
