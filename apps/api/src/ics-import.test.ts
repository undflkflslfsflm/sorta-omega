import {describe,expect,it} from "vitest";
import {parseCalendarImport} from "./ics-import.js";

describe("ICS import preview",()=>{
  it("parses bounded weekly data while refusing invitation semantics",()=>{const parsed=parseCalendarImport("BEGIN:VCALENDAR\r\nMETHOD:REQUEST\r\nBEGIN:VEVENT\r\nUID:lesson-1\r\nSEQUENCE:2\r\nDTSTART;TZID=Europe/Oslo:20261001T090000\r\nDTEND;TZID=Europe/Oslo:20261001T100000\r\nSUMMARY:Math\\, room 2\r\nRRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=4\r\nORGANIZER:mailto:teacher@example.no\r\nATTENDEE;RSVP=TRUE:mailto:student@example.no\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n","Europe/Oslo");expect(parsed.items[0]).toMatchObject({sourceUid:"lesson-1",sequence:2,title:"Math, room 2",action:"create_series",recurrence:{frequency:"weekly",interval:1,count:4}});expect(parsed.items[0].ignoredInvitationFields).toEqual(["ORGANIZER","ATTENDEE"]);expect(parsed.warnings.join(" ")).toMatch(/no invitations/i);});
  it("keeps cancellation explicit and blocks unsupported recurrence",()=>{const parsed=parseCalendarImport("BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:x\nDTSTART:20261001T090000Z\nDTEND:20261001T100000Z\nSUMMARY:X\nSTATUS:CANCELLED\nRRULE:FREQ=MONTHLY\nEND:VEVENT\nEND:VCALENDAR\n","UTC");expect(parsed.items[0].sourceStatus).toBe("cancelled");expect(parsed.items[0].action).toBe("blocked");expect(parsed.items[0].reasonCodes).toContain("unsupported_recurrence_frequency");});
});
