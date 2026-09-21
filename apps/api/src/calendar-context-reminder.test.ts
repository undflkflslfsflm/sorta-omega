import {describe,expect,it} from "vitest";
import {calendarBriefQuerySchema,calendarBriefSchema,eventReminderPlanSchema,jobKindSchema,refreshPrivateEventContextSchema,setEventReminderPlanSchema} from "@sorta/contracts";

const id="00000000-0000-4000-8000-000000000051";
describe("calendar context and reminder contracts",()=>{
  it("requires revision-fenced bounded context refresh and recognizes every persisted calendar job kind",()=>{
    expect(refreshPrivateEventContextSchema.safeParse({expectedRevision:2,occurrenceId:null}).success).toBe(true);
    expect(refreshPrivateEventContextSchema.safeParse({expectedRevision:0}).success).toBe(false);
    for(const kind of ["commitment_rematch","calendar_policy_dry_run","calendar_context_refresh"])expect(jobKindSchema.safeParse(kind).success).toBe(true);
  });
  it("requires coherent reminder scope and reports delivery honestly",()=>{
    expect(setEventReminderPlanSchema.safeParse({occurrenceScope:"occurrence",occurrenceId:null,schedules:[{minutesBefore:30}],channels:["in_app"]}).success).toBe(false);
    expect(setEventReminderPlanSchema.safeParse({occurrenceScope:"series",occurrenceId:null,schedules:[{minutesBefore:30},{minutesBefore:30}],channels:["in_app"]}).success).toBe(false);
    const plan=eventReminderPlanSchema.parse({eventId:id,vaultId:id,eventRevision:2,occurrenceScope:"series",occurrenceId:null,schedules:[{minutesBefore:30}],channels:["in_app","windows_native"],revision:1,nextTriggers:[],deliverability:{inApp:"durable_queue",windowsNative:"unverified_host_delivery",guaranteedOsDelivery:false,quietHoursApplied:false},createdAt:"2026-09-20T12:00:00.000Z",updatedAt:"2026-09-20T12:00:00.000Z"});
    expect(plan.deliverability.guaranteedOsDelivery).toBe(false);
  });
  it("keeps daily briefs date-bounded, source-linked, and freshness-explicit",()=>{
    expect(calendarBriefQuerySchema.safeParse({date:"2026-09-20",timezone:"Europe/Oslo"}).success).toBe(true);
    expect(calendarBriefQuerySchema.safeParse({date:"this Sunday",timezone:"Europe/Oslo"}).success).toBe(false);
    const brief=calendarBriefSchema.parse({vaultId:id,date:"2026-09-20",timezone:"Europe/Oslo",state:"stale",revision:2,generatedAt:"2026-09-20T06:00:00.000Z",items:[],deterministicSummary:["No timed items."],sourceManifest:[],generation:{method:"deterministic-calendar-brief-v1",sourceCount:0,cached:true}});
    expect(brief.state).toBe("stale");expect(brief.generation.cached).toBe(true);expect(jobKindSchema.safeParse("calendar_brief_refresh").success).toBe(true);
  });
});
