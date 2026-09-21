import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { httpOperations } from "@sorta/contracts";

const here = path.dirname(fileURLToPath(import.meta.url));

function normalizePath(value: string) {
  return value.replace(/:([A-Za-z][A-Za-z0-9_]*)/g, "{$1}");
}

describe("HTTP operation registry", () => {
  it("matches every registered Fastify route", async () => {
    const sources = await Promise.all([
      readFile(path.join(here, "server.ts"), "utf8"),
      readFile(path.join(here, "auth.ts"), "utf8")
    ]);
    const actual = sources.flatMap((source) => [...source.matchAll(/app\.(get|post|patch|delete|put)\("([^"]+)"/g)]
      .map((match) => `${match[1]} ${normalizePath(match[2])}`)).sort();
    const documented = httpOperations.map((operation) => `${operation.method} ${operation.path}`).sort();
    expect(documented).toEqual(actual);
    expect(new Set(httpOperations.map((operation) => operation.operationId)).size).toBe(httpOperations.length);
  });
});
