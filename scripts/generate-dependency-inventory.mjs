import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");
const slash = (value) => value.replaceAll("\\", "/");
const read = (path) => readFileSync(join(root, path), "utf8");
const normalizeLineEndings = (value) => value.replaceAll("\r\n", "\n");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

function workspaceManifestPaths() {
  const paths = ["package.json"];
  for (const parent of ["apps", "packages"]) {
    const directory = join(root, parent);
    for (const child of readdirSync(directory, { withFileTypes: true })) {
      const manifest = join(directory, child.name, "package.json");
      if (child.isDirectory() && existsSync(manifest)) {
        paths.push(slash(relative(root, manifest)));
      }
    }
  }
  return paths.sort();
}

function directJavascriptDependencies(path) {
  const manifest = JSON.parse(read(path));
  const dependencies = [];
  for (const section of ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"]) {
    for (const [name, requested] of Object.entries(manifest[section] ?? {})) {
      dependencies.push({ name, requested, section });
    }
  }
  dependencies.sort((a, b) => a.name.localeCompare(b.name) || a.section.localeCompare(b.section));
  return {
    path,
    name: manifest.name,
    version: manifest.version,
    private: manifest.private === true,
    dependencies,
  };
}

function installedJavascriptPackages() {
  const command = process.platform === "win32"
    ? [process.env.ComSpec ?? "C:\\Windows\\System32\\cmd.exe", ["/d", "/s", "/c", "pnpm licenses list --json"]]
    : ["pnpm", ["licenses", "list", "--json"]];
  const raw = execFileSync(command[0], command[1], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    stdio: ["ignore", "pipe", "inherit"],
  });
  const grouped = JSON.parse(raw);
  const packages = [];
  for (const license of Object.keys(grouped).sort()) {
    for (const item of grouped[license]) {
      packages.push({
        name: item.name,
        versions: [...new Set(item.versions ?? [])].sort(),
        license: item.license ?? license,
        ...(item.author ? { author: typeof item.author === "string" ? item.author : JSON.stringify(item.author) } : {}),
        ...(item.homepage ? { homepage: item.homepage } : {}),
        ...(item.description ? { description: item.description } : {}),
      });
    }
  }
  return packages.sort((a, b) => a.name.localeCompare(b.name) || a.license.localeCompare(b.license));
}

function rustDependencies() {
  const path = "apps/desktop/src-tauri/Cargo.toml";
  const lines = read(path).split(/\r?\n/);
  const dependencies = [];
  let section = "";
  for (const line of lines) {
    const header = line.match(/^\[([^\]]+)\]$/);
    if (header) {
      section = header[1];
      continue;
    }
    if (!["dependencies", "build-dependencies"].includes(section)) continue;
    const dependency = line.match(/^([A-Za-z0-9_-]+)\s*=\s*(.+)$/);
    if (dependency) dependencies.push({ name: dependency[1], requested: dependency[2].trim(), section });
  }
  dependencies.sort((a, b) => a.name.localeCompare(b.name) || a.section.localeCompare(b.section));
  return {
    manifest: path,
    lockfile: existsSync(join(root, "apps/desktop/src-tauri/Cargo.lock"))
      ? "apps/desktop/src-tauri/Cargo.lock"
      : null,
    resolutionStatus: existsSync(join(root, "apps/desktop/src-tauri/Cargo.lock"))
      ? "locked; run a Cargo-aware license audit on the Windows build host"
      : "declared only; Cargo is unavailable here, so transitive versions and licenses are not resolved",
    dependencies,
  };
}

function containerImages() {
  const refs = new Set();
  for (const match of read("infra/compose/Dockerfile").matchAll(/^FROM\s+(\S+)/gm)) refs.add(match[1]);
  for (const match of read("compose.yaml").matchAll(/^\s*image:\s*(\S+)/gm)) refs.add(match[1]);
  return [...refs].sort().map((reference) => ({
    reference,
    digestPinned: reference.includes("@sha256:"),
    licenseStatus: "verify image contents and upstream terms before production release",
  }));
}

const installedPackages = installedJavascriptPackages();
const licenseCounts = new Map();
for (const item of installedPackages) {
  const current = licenseCounts.get(item.license) ?? { packages: 0, versions: 0 };
  current.packages += 1;
  current.versions += item.versions.length;
  licenseCounts.set(item.license, current);
}
const licenseSummary = [...licenseCounts].sort(([a], [b]) => a.localeCompare(b)).map(([license, counts]) => ({
  license,
  ...counts,
}));
const lockfile = read("pnpm-lock.yaml");
const rootManifest = JSON.parse(read("package.json"));

const inventory = {
  schemaVersion: 1,
  sources: {
    packageManager: rootManifest.packageManager,
    nodeEngine: rootManifest.engines?.node ?? null,
    pnpmLockfile: "pnpm-lock.yaml",
    pnpmLockfileSha256: sha256(lockfile),
    javascriptLicenseCommand: "pnpm licenses list --json",
  },
  summary: {
    workspaceManifests: workspaceManifestPaths().length,
    installedJavascriptPackages: installedPackages.length,
    installedJavascriptPackageVersions: installedPackages.reduce((sum, item) => sum + item.versions.length, 0),
    javascriptLicenseExpressions: licenseSummary.length,
  },
  directJavascriptDependencies: workspaceManifestPaths().map(directJavascriptDependencies),
  installedJavascriptLicenses: {
    summary: licenseSummary,
    packages: installedPackages,
  },
  rust: rustDependencies(),
  containers: containerImages(),
  operationalDependencies: [
    {
      name: "Qwen/Qwen3.8-Flash-Next",
      role: "owner-selected local general model target",
      status: "not installed or benchmarked on this computer; version, digest, quantization, runtime compatibility, and license must be recorded on the RTX 4090 host",
    },
    {
      name: "Qwen3-Embedding-0.6B",
      role: "default local embedding model target",
      status: "runtime artifact and 1024-dimensional output must be verified on the deployment host",
    },
    {
      name: "Ollama or an approved OpenAI-compatible local runtime",
      role: "loopback-only local inference service",
      status: "external runtime; not vendored or version-pinned in this repository",
    },
    {
      name: "Docker Desktop or compatible Compose engine",
      role: "application and PostgreSQL/pgvector services",
      status: "external host prerequisite; version not pinned",
    },
    {
      name: "WebView2 Runtime, Rust, MSVC Build Tools, and Windows SDK",
      role: "Tauri Windows build and runtime",
      status: "external host prerequisites; Rust/MSVC/SDK are unavailable on this computer",
    },
    {
      name: "Tailscale",
      role: "optional private remote access",
      status: "optional external runtime; installation and account configuration require owner approval",
    },
  ],
  review: {
    legalReviewPerformed: false,
    notes: [
      "This is an engineering inventory, not legal advice or a legal clearance.",
      "The JavaScript inventory describes the currently installed lockfile graph; rerun after every lockfile change.",
      "Rust transitive licenses remain incomplete until Cargo resolves a lockfile on a build-capable host.",
      "Container images and model artifacts require digest pinning and separate upstream-license verification before release.",
    ],
  },
};

const json = `${JSON.stringify(inventory, null, 2)}\n`;
const licenseRows = licenseSummary.map((row) => `| ${row.license} | ${row.packages} | ${row.versions} |`).join("\n");
const workspaceRows = inventory.directJavascriptDependencies
  .map((workspace) => `| \`${workspace.name}\` | \`${workspace.path}\` | ${workspace.dependencies.length} |`)
  .join("\n");
const rustRows = inventory.rust.dependencies
  .map((dependency) => `| \`${dependency.name}\` | ${dependency.section} | \`${dependency.requested.replaceAll("|", "\\|")}\` |`)
  .join("\n");
const containerRows = inventory.containers
  .map((container) => `| \`${container.reference}\` | ${container.digestPinned ? "yes" : "no"} |`)
  .join("\n");
const operationalRows = inventory.operationalDependencies
  .map((dependency) => `| ${dependency.name} | ${dependency.role} | ${dependency.status} |`)
  .join("\n");

const markdown = `# Dependency and license inventory

This file is generated by \`pnpm deps:inventory\`. Run \`pnpm deps:check\` in CI or before release to detect drift. The complete package-level inventory is in [DEPENDENCY-INVENTORY.json](./DEPENDENCY-INVENTORY.json).

Lockfile SHA-256: \`${inventory.sources.pnpmLockfileSha256}\`

## Summary

- ${inventory.summary.workspaceManifests} JavaScript workspace manifests.
- ${inventory.summary.installedJavascriptPackages} installed JavaScript packages covering ${inventory.summary.installedJavascriptPackageVersions} package versions.
- ${inventory.summary.javascriptLicenseExpressions} distinct JavaScript license expressions.
- Rust dependencies are ${inventory.rust.lockfile ? "locked, but still require a Cargo-aware license audit" : "manifest-only because no Cargo.lock has been generated"}.
- No legal review has been performed.

## JavaScript licenses

| SPDX/license expression | Packages | Versions |
| --- | ---: | ---: |
${licenseRows}

## Workspace manifests

| Package | Manifest | Direct declarations |
| --- | --- | ---: |
${workspaceRows}

## Rust declarations

Resolution status: ${inventory.rust.resolutionStatus}.

| Crate | Section | Requested version/features |
| --- | --- | --- |
${rustRows}

## Container images

| Reference | Digest pinned |
| --- | --- |
${containerRows}

Image contents and upstream terms must be reviewed, and production images must be digest-pinned.

## Operational and host dependencies

| Dependency | Role | Current evidence/status |
| --- | --- | --- |
${operationalRows}

## Release review requirements

1. Run the generator after every manifest or lockfile change and commit both generated files.
2. Resolve and commit the Rust lockfile on the Windows build host, then run a Cargo-aware license audit.
3. Pin container and model artifacts by immutable digest after live validation.
4. Verify model, runtime, container, fonts/assets, and distribution terms for the intended release method.
5. Treat this inventory as engineering evidence, not legal advice or legal clearance.
`;

const outputs = new Map([
  ["docs/DEPENDENCY-INVENTORY.json", json],
  ["docs/DEPENDENCY-INVENTORY.md", markdown],
]);

let drift = false;
for (const [path, content] of outputs) {
  const absolute = join(root, path);
  if (checkOnly) {
    if (!existsSync(absolute) || normalizeLineEndings(readFileSync(absolute, "utf8")) !== content) {
      console.error(`${path} is out of date; run pnpm deps:inventory`);
      drift = true;
    }
  } else {
    writeFileSync(absolute, content);
    console.log(`wrote ${path}`);
  }
}

if (drift) process.exitCode = 1;
else if (checkOnly) console.log("dependency inventory is current");
