import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { offlineShellPlugin } from "./offline-shell-plugin.mjs";

export default defineConfig({
  plugins: [react(), offlineShellPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized=id.replace(/\\/g,"/");
          if(normalized.includes("/node_modules/yjs/")||normalized.includes("/node_modules/y-prosemirror/"))return "yjs-vendor";
          if(normalized.includes("/node_modules/prosemirror-"))return "prosemirror-vendor";
          if(normalized.includes("/node_modules/@tiptap/"))return "tiptap-vendor";
          if(normalized.includes("/node_modules/react/")||normalized.includes("/node_modules/react-dom/")||normalized.includes("/node_modules/scheduler/"))return "react-vendor";
          if(normalized.includes("/node_modules/lucide-react/"))return "icons";
          if(normalized.includes("/node_modules/@simplewebauthn/"))return "webauthn";
          if(normalized.includes("/packages/contracts/src/"))return "contracts";
          if(normalized.includes("/node_modules/@tauri-apps/"))return "tauri";
        }
      }
    }
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3210",
      "/health": "http://127.0.0.1:3210"
    }
  }
});
