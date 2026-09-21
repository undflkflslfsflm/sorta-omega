export type ReminderStatus="scheduled"|"snoozed"|"delivered"|"missed"|"dismissed"|"cancelled";

export function dueReminderStatus(remindAt:string|Date,now=new Date(),missedAfterMs=86_400_000):"delivered"|"missed"|null{
  const dueAt=new Date(remindAt).getTime();
  if(!Number.isFinite(dueAt)||dueAt>now.getTime())return null;
  return dueAt<now.getTime()-missedAfterMs?"missed":"delivered";
}

export function reminderUpdateDecision(input:{currentStatus:ReminderStatus;currentRemindAt:string;requestedStatus?:"scheduled"|"snoozed"|"dismissed";requestedRemindAt?:string;now?:Date}):{ok:true;status:ReminderStatus;remindAt:string}|{ok:false;error:"reminder_cancelled"|"snooze_time_required"|"reminder_time_must_be_future"|"reminder_dismissed"}{
  if(input.currentStatus==="cancelled")return {ok:false,error:"reminder_cancelled"};
  if(input.requestedStatus==="snoozed"&&!input.requestedRemindAt)return {ok:false,error:"snooze_time_required"};
  const status=input.requestedStatus??input.currentStatus,remindAt=input.requestedRemindAt??input.currentRemindAt;
  const now=input.now??new Date();
  if((status==="scheduled"||status==="snoozed")&&Date.parse(remindAt)<=now.getTime())return {ok:false,error:"reminder_time_must_be_future"};
  if(input.currentStatus==="dismissed"&&status!=="dismissed")return {ok:false,error:"reminder_dismissed"};
  return {ok:true,status,remindAt};
}
