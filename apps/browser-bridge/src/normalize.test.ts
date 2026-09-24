import { describe,expect,it } from "vitest";
import { cleanVisibleTexts,inSchoolSnapshot,inSchoolTimetableSnapshot,teamsNotes } from "./normalize.js";

describe("browser bridge normalization",()=>{it("deduplicates visible text and labels snapshots honestly",()=>{expect(cleanVisibleTexts([" Hello  world ","Hello world",""])).toEqual(["Hello world"]);const notes=teamsNotes(["Alice\nMessage"],"2026-09-21T12:00:00.000Z");expect(notes[0].body).toContain("browser snapshot, not live synchronization");expect(notes[0]).not.toHaveProperty("cookies");});it("stays within the normal note-import item and byte ceilings",()=>{expect(cleanVisibleTexts(Array.from({length:700},(_,index)=>`message ${index}`))).toHaveLength(500);expect(cleanVisibleTexts(["å".repeat(10),"next"],500,20)).toEqual(["å".repeat(10)]);});it("creates bounded school snapshot records without claiming a live connection",()=>{const value=inSchoolSnapshot(["Mathematics · room 10"],"2026-09-21T12:00:00.000Z");expect(value.version).toBe("omega_school_json_v1");expect(value.records).toHaveLength(1);expect(value.records[0].kind).toBe("lesson");});});

it("derives stable subjects, courses, and timed lessons from InSchool timetable fields",()=>{
  const item={entityId:"lesson-1",teachingGroupId:"group-1",startUnix:"1790146800",hours:"08:00 - 08:45",subjectCode:"MAT101",subjectName:"Matematikk 1P",room:"A12",teachers:"Teacher",lessonType:"LESSON"};
  const first=inSchoolTimetableSnapshot([item,item],"2026-09-23T12:00:00.000Z");
  const second=inSchoolTimetableSnapshot([item],"2026-09-24T12:00:00.000Z");
  expect(first.records.map(record=>record.kind)).toEqual(["subject","course","lesson"]);
  expect(first.records[2]).toMatchObject({startsAt:new Date(Number(item.startUnix)*1000).toISOString(),endsAt:new Date(Number(item.startUnix)*1000+45*60_000).toISOString(),room:"A12",timezone:"Europe/Oslo"});
  expect(first.records[2].externalId).toBe(second.records[2].externalId);
  expect(JSON.stringify(first)).not.toContain("cookie");
  const tooMany=Array.from({length:1000},(_,index)=>({...item,entityId:`lesson-${index}`,startUnix:String(Number(item.startUnix)+index*3600)}));
  expect(()=>inSchoolTimetableSnapshot(tooMany,"2026-09-24T12:00:00.000Z")).toThrow("inschool_timetable_snapshot_record_limit_exceeded");
});
