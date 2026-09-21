export type PrepStatus = "needed" | "packed" | "dismissed" | "completed";

export function prepStatusTransition(current: PrepStatus, requested?: PrepStatus) {
  const status = requested ?? current;
  return {
    status,
    suppressFutureSuggestion: status === "dismissed",
    commitmentEffect: "none" as const
  };
}
