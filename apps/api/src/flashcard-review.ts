export type FlashcardRating = "again" | "hard" | "good" | "easy";
export const FLASHCARD_REVIEW_POLICY_VERSION = "omega-review-v1";

const DAY_MS = 86_400_000;
const goodDays = [1, 3, 7, 14, 30, 60, 120];
const easyDays = [3, 7, 14, 30, 60, 120, 240];

export function nextReviewAt(observedAt: string, rating: FlashcardRating, priorReviewCount: number) {
  const base = Date.parse(observedAt);
  if (!Number.isFinite(base) || !Number.isInteger(priorReviewCount) || priorReviewCount < 0) throw new Error("invalid_review_input");
  if (rating === "again") return new Date(base + 10 * 60_000).toISOString();
  const index = Math.min(priorReviewCount, goodDays.length - 1);
  const days = rating === "hard" ? Math.max(1, Math.ceil(goodDays[index] / 2)) : rating === "good" ? goodDays[index] : easyDays[index];
  return new Date(base + days * DAY_MS).toISOString();
}
