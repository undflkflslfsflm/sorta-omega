import { createHash, timingSafeEqual } from "node:crypto";

export function hashWorkerSecret(value: string) {
  return createHash("sha256").update(value).digest();
}

export function leaseSecretMatches(actual: string, expectedHash: Buffer) {
  const actualHash = hashWorkerSecret(actual);
  return actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash);
}
