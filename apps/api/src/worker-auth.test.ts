import { describe, expect, it } from "vitest";
import { hashWorkerSecret, leaseSecretMatches } from "./worker-secrets.js";

describe("worker secrets", () => {
  it("matches only the exact secret hash", () => {
    const expected = hashWorkerSecret("worker-secret-with-enough-entropy");
    expect(leaseSecretMatches("worker-secret-with-enough-entropy", expected)).toBe(true);
    expect(leaseSecretMatches("worker-secret-with-enough-entropz", expected)).toBe(false);
  });
});
