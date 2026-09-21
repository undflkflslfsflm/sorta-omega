import { invoke, isTauri } from "@tauri-apps/api/core";
import { createDesktopBridge } from "@sorta/desktop";

export const desktopBridge = isTauri()
  ? createDesktopBridge(async (command, arguments_) => invoke(command, arguments_))
  : null;
