import { ApiError } from "./api";

export type PasskeySignInStage = "options" | "browser" | "verify";

export function passkeySignInMessage(stage: PasskeySignInStage, error: unknown): string {
  if (stage === "options") return "Sorta could not contact its home host to start passkey sign-in. If this is a Tailscale address, connect Tailscale on this device, then reload.";
  if (stage === "browser") {
    if (error instanceof Error && error.message === "webauthn_unavailable") {
      return "This browser cannot use passkeys. On iPhone, open Sorta in Safari instead.";
    }
    if (error instanceof Error && error.name === "SecurityError") {
      return "This browser blocked passkeys for this address. Open Sorta's HTTPS address directly in Safari.";
    }
    return "No passkey was selected, or this browser could not complete the passkey prompt. On iPhone, try Safari. If this phone has no Sorta passkey, use a saved recovery code to add one.";
  }
  if (error instanceof ApiError && error.code === "unknown_passkey") {
    return "This passkey is not registered with Sorta. Use a saved recovery code to add a passkey on this device.";
  }
  if (error instanceof ApiError && error.code === "challenge_expired") {
    return "The passkey prompt took too long. Start sign-in again.";
  }
  return "Sorta could not verify this passkey. Try again in Safari, or use a saved recovery code to add a passkey on this device.";
}
