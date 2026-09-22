import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { offlineShellPlugin } from "./offline-shell-plugin.mjs";

export default defineConfig({
  plugins: [react(), offlineShellPlugin()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3210",
      "/health": "http://127.0.0.1:3210"
    }
  }
});
