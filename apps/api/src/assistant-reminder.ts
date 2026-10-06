import { isDirectReminderRequest } from "@sorta/contracts";

export type ReminderProposal = {
  kind: "reminder";
  title: string;
  remindAt: string;
  requestQuote: string;
};

// The model may interpret the date, but it cannot create an action from retrieved
// material or from a question about the feature. Only a direct owner request can
// cross the write boundary.
export function validateReminderProposal(
  question: string,
  proposal: ReminderProposal,
  now: Date,
  timezone: string
): { title: string; remindAt: string } | null {
  const quote = proposal.requestQuote.trim();
  if (!quote || !question.toLocaleLowerCase().includes(quote.toLocaleLowerCase())) return null;
  if (!isDirectReminderRequest(quote) || !isDirectReminderRequest(question)) return null;
  // A bare “remind me” is not permission to invent a convenient hour.
  if (!/(?:\b\d{1,2}[:.]\d{2}\b|\b(?:at|klokken|kl)\s*\d{1,2}\b|\b(?:noon|midnight)\b|\b(?:in|om)\s+\d+\s*(?:minutes?|hours?|minutter?|timer?)\b)/iu.test(question)) return null;
  const title = proposal.title.trim();
  if (!title || title.length > 240 || /[\r\n]/u.test(title) || !question.toLocaleLowerCase().includes(title.toLocaleLowerCase())) return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/u.test(proposal.remindAt)) return null;
  const time = Date.parse(proposal.remindAt);
  if (!Number.isFinite(time) || time <= now.getTime() + 60_000 || time > now.getTime() + 366 * 86400_000) return null;
  try {
    const formatter = new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
    const parts = formatter.formatToParts(new Date(time));
    const component = (name: string) => parts.find(part => part.type === name)?.value ?? "";
    const wallTime = `${component("year")}-${component("month")}-${component("day")}T${component("hour")}:${component("minute")}:${component("second")}`;
    if (wallTime !== proposal.remindAt.slice(0, 19)) return null;
    const today = formatter.formatToParts(now);
    const todayPart = (name: string) => today.find(part => part.type === name)?.value ?? "";
    const todayDate = `${todayPart("year")}-${todayPart("month")}-${todayPart("day")}`;
    const requestedDay = /\b(?:tomorrow|i\s+morgen)\b/iu.test(question) ? 1 : /\b(?:today|tonight|i\s+dag|i\s+kveld)\b/iu.test(question) ? 0 : null;
    if (requestedDay !== null) {
      const expectedDate = new Date(Date.UTC(Number(todayPart("year")), Number(todayPart("month")) - 1, Number(todayPart("day")) + requestedDay)).toISOString().slice(0, 10);
      if (wallTime.slice(0, 10) !== expectedDate) return null;
    }
    const hasDateOrInterval = /(?:\b(?:today|tomorrow|tonight|next|monday|tuesday|wednesday|thursday|friday|saturday|sunday|i\s+dag|i\s+morgen|i\s+kveld|neste|mandag|tirsdag|onsdag|torsdag|fredag|lørdag|søndag)\b|\b\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?\b|\b(?:in|om)\s+\d+\s*(?:minutes?|hours?|minutter?|timer?)\b)/iu.test(question);
    if (!hasDateOrInterval && wallTime.slice(0, 10) !== todayDate) return null;
  } catch { return null; }
  return { title, remindAt: new Date(time).toISOString() };
}
