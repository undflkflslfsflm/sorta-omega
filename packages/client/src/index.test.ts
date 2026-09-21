import { describe, expect, it } from "vitest";
import { createSortaClient } from "./index.js";

describe("generated client", () => {
  it("uses the configured canonical origin and includes credentials", async () => {
    const requests: Request[] = [];
    const fetch: typeof globalThis.fetch = async (input) => {
      requests.push(input instanceof Request ? input : new Request(input));
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    };
    const client = createSortaClient({ baseUrl: "https://omega.example", fetch });
    const result = await client.GET("/health/live");

    expect(result.data).toEqual({ status: "ok" });
    expect(requests).toHaveLength(1);
    expect(requests[0]?.url).toBe("https://omega.example/health/live");
    expect(requests[0]?.credentials).toBe("include");
  });
});
