import { describe, expect, it } from "vitest";
import { attendanceForClass, type ClassAttendanceLink } from "./calendar-attendance.js";

const record = (id: string, date: string, lessonId: string | null, calendarEventId: string | null): ClassAttendanceLink => ({id,date,lessonId,calendarEventId,status:"absent",label:"Absent (excused)"});

describe("calendar class attendance", () => {
  it("colors only the lesson on the matching local date", () => {
    const records=[record("a","2026-09-24","lesson-1",null)];
    expect(attendanceForClass(records,{lessonId:"lesson-1",startsAt:"2026-09-24T07:55:00Z",timezone:"Europe/Oslo"})?.id).toBe("a");
    expect(attendanceForClass(records,{lessonId:"lesson-1",startsAt:"2026-09-25T07:55:00Z",timezone:"Europe/Oslo"})).toBeNull();
  });
  it("matches a calendar-linked class by event identity", () => {
    expect(attendanceForClass([record("a","2026-09-24","lesson-1","event-1")],{calendarEventId:"event-1",startsAt:"2026-09-24T07:55:00Z",timezone:"Europe/Oslo"})?.status).toBe("absent");
  });
  it("leaves conflicting attendance records separate instead of hiding one", () => {
    const records=[record("a","2026-09-24","lesson-1",null),record("b","2026-09-24","lesson-1",null)];
    expect(attendanceForClass(records,{lessonId:"lesson-1",startsAt:"2026-09-24T07:55:00Z",timezone:"Europe/Oslo"})).toBeNull();
  });
});
