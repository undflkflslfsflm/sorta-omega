import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const publicFiles = ["manifest.webmanifest", "favicon.svg"];

export function renderOfflineWorker(template, bundle, publicContents) {
  if (!bundle["index.html"]) throw new Error("Offline shell requires index.html");
  const files = Object.keys(bundle).filter(name => name === "index.html" || /^assets\/[^/]+\.(?:js|css|woff2?|svg|png|webp|ico)$/.test(name)).sort();
  const hash = createHash("sha256").update(template);
  for (const name of files) {
    const entry = bundle[name];
    hash.update(name).update(entry.type === "chunk" ? entry.code : entry.source);
  }
  for (const name of publicFiles) hash.update(name).update(publicContents[name]);
  const shell = ["/", ...publicFiles.map(name => `/${name}`), ...files.filter(name => name !== "index.html").map(name => `/${name}`)];
  return template
    .replace('const CACHE = "sorta-shell-v2";', `const CACHE = "sorta-shell-${hash.digest("hex").slice(0, 24)}";`)
    .replace('const SHELL = ["/", "/manifest.webmanifest", "/favicon.svg"];', `const SHELL = ${JSON.stringify(shell)};`);
}

export function offlineShellPlugin() {
  return {
    name: "sorta-offline-shell",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      const template = readFileSync(new URL("./public/service-worker.js", import.meta.url), "utf8");
      const publicContents = Object.fromEntries(publicFiles.map(name => [name, readFileSync(new URL(`./public/${name}`, import.meta.url))]));
      this.emitFile({ type: "asset", fileName: "service-worker.js", source: renderOfflineWorker(template, bundle, publicContents) });
    }
  };
}
