import { describe, expect, it } from "vitest";
import { placeTimelineDay, timelineBounds, timelineDateKey, type TimelineItem } from "./calendar-timeline";

const item = (id: string, startsAt: string, endsAt: string): TimelineItem => ({ id, title: id, startsAt, endsAt, layer: "school", attendanceStatus: null, detail: "" });

describe("calendar timeline", () => {
  it("places lessons by local time rather than stacking them", () => {
    const lessons = placeTimelineDay([item("maths", "2026-09-24T07:55:00.000Z", "2026-09-24T08:40:00.000Z"), item("history", "2026-09-24T08:45:00.000Z", "2026-09-24T09:30:00.000Z")], "2026-09-24", "Europe/Oslo");
    expect(lessons.map(value => [value.id, value.startMinute, value.endMinute])).toEqual([["maths", 595, 640], ["history", 645, 690]]);
    expect(timelineBounds(["2026-09-24"], lessons, "Europe/Oslo")).toEqual({startHour:7,endHour:21});
  });

  it("puts overlapping items in separate lanes and resets after a gap", () => {
    const items = placeTimelineDay([item("one", "2026-09-24T08:00:00Z", "2026-09-24T09:00:00Z"), item("two", "2026-09-24T08:30:00Z", "2026-09-24T09:30:00Z"), item("three", "2026-09-24T10:00:00Z", "2026-09-24T10:30:00Z")], "2026-09-24", "Europe/Oslo");
    expect(items.map(value => [value.id, value.lane, value.laneCount])).toEqual([["one",0,2],["two",1,2],["three",0,1]]);
  });

  it("clips overnight events to each local day, including the DST boundary", () => {
    const overnight = item("overnight", "2026-10-24T21:30:00Z", "2026-10-25T02:30:00Z");
    expect(timelineDateKey(overnight.startsAt,"Europe/Oslo")).toBe("2026-10-24");
    expect(placeTimelineDay([overnight],"2026-10-24","Europe/Oslo")[0]).toMatchObject({startMinute:1410,endMinute:1440});
    expect(placeTimelineDay([overnight],"2026-10-25","Europe/Oslo")[0]).toMatchObject({startMinute:0,endMinute:210});
  });
});
