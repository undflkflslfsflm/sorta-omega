import { describe, expect, it } from "vitest";
import { retryAssignmentListReturn } from "./teams-assignments.js";

describe("Teams assignment list return", () => {
  it("retries a transient embedded-frame navigation and returns the recovered value", async () => {
    let attempts = 0;
    const delays: number[] = [];
    const result = await retryAssignmentListReturn(async () => {
      attempts++;
      if (attempts < 3) throw new Error("frame was replaced");
      return "card found";
    }, async delay => { delays.push(delay); });
    expect(result).toBe("card found");
    expect(attempts).toBe(3);
    expect(delays).toEqual([500, 1000]);
  });

  it("fails closed after the bounded attempts", async () => {
    let attempts = 0;
    await expect(retryAssignmentListReturn(async () => {
      attempts++;
      throw new Error("card missing");
    }, async () => undefined)).rejects.toThrow("teams_assignment_list_return_failed");
    expect(attempts).toBe(3);
  });
});
