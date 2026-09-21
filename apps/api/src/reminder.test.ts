import {describe,expect,it} from "vitest";
import {dueReminderStatus,reminderUpdateDecision} from "./reminder.js";

describe("reminder policy",()=>{
  const now=new Date("2026-09-20T12:00:00.000Z");
  it("distinguishes future, due, and missed reminders",()=>{
    expect(dueReminderStatus("2026-09-20T12:01:00.000Z",now)).toBeNull();
    expect(dueReminderStatus("2026-09-20T11:59:00.000Z",now)).toBe("delivered");
    expect(dueReminderStatus("2026-09-19T11:59:59.000Z",now)).toBe("missed");
  });
  it("requires a new future instant for snooze and keeps dismissal terminal",()=>{
    expect(reminderUpdateDecision({currentStatus:"delivered",currentRemindAt:"2026-09-20T11:00:00.000Z",requestedStatus:"snoozed",now})).toEqual({ok:false,error:"snooze_time_required"});
    expect(reminderUpdateDecision({currentStatus:"delivered",currentRemindAt:"2026-09-20T11:00:00.000Z",requestedStatus:"snoozed",requestedRemindAt:"2026-09-20T13:00:00.000Z",now})).toEqual({ok:true,status:"snoozed",remindAt:"2026-09-20T13:00:00.000Z"});
    expect(reminderUpdateDecision({currentStatus:"dismissed",currentRemindAt:"2026-09-20T11:00:00.000Z",requestedStatus:"scheduled",requestedRemindAt:"2026-09-20T13:00:00.000Z",now})).toEqual({ok:false,error:"reminder_dismissed"});
  });
});
