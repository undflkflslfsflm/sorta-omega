import { describe,expect,it } from "vitest";
import { calendarSchema,createCalendarSchema,updateCalendarSchema } from "@sorta/contracts";

const id="00000000-0000-4000-8000-000000000041";
const vaultId="00000000-0000-4000-8000-000000000001";

describe("canonical calendar lifecycle contracts",()=>{
  it("only creates private Sorta calendars and keeps provider capabilities factual",()=>{
    expect(createCalendarSchema.safeParse({name:"School",timezone:"Europe/Oslo",origin:"sorta",displayPreferences:{color:"#3355aa",showWeekends:true}}).success).toBe(true);
    expect(createCalendarSchema.safeParse({name:"Remote",timezone:"UTC",origin:"microsoft",displayPreferences:{color:"#3355aa",showWeekends:true}}).success).toBe(false);
    const provider=calendarSchema.parse({id,vaultId,name:"Microsoft school",timezone:"Europe/Oslo",origin:"microsoft",ownership:"provider",capabilities:{read:true,write:false},selectedVisible:true,displayPreferences:{color:"#3355aa",showWeekends:true},providerMapping:{connectionId:id,providerCalendarId:"provider-calendar-42"},freshness:{state:"stale",lastSyncedAt:null},revision:3,archivedAt:null,createdAt:"2026-09-20T12:00:00.000Z",updatedAt:"2026-09-20T12:00:00.000Z"});
    expect(provider.capabilities.write).toBe(false);
    expect(provider.providerMapping?.providerCalendarId).toBe("provider-calendar-42");
  });

  it("requires a non-empty bounded owner patch and represents archive undo explicitly",()=>{
    expect(updateCalendarSchema.safeParse({}).success).toBe(false);
    expect(updateCalendarSchema.safeParse({selectedVisible:false}).success).toBe(true);
    expect(updateCalendarSchema.safeParse({archived:false,selectedVisible:true}).success).toBe(true);
    expect(updateCalendarSchema.safeParse({capabilities:{write:true}}).success).toBe(false);
  });
});
