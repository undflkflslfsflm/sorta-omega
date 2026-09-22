import { invoke, isTauri } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { createDesktopBridge } from "@sorta/desktop";

export const desktopBridge = isTauri()
  ? createDesktopBridge(
      async (command, arguments_) => invoke(command, arguments_),
      async (event,handler)=>listen(event,message=>handler(message.payload))
    )
  : null;
