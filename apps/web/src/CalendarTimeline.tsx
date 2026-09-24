import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { CalendarView } from "@sorta/contracts";
import { placeTimelineDay, timelineBounds, timelineDateKey, timelineMinute, type TimelineItem } from "./calendar-timeline";

type Props = {
  days: Date[];
  items: TimelineItem[];
  markers: CalendarView["unknownTimeMarkers"];
  timezone: string;
};

const hourHeight = 64;

export function CalendarTimeline({ days, items, markers, timezone }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => new Date());
  const dates = useMemo(() => days.map(day => timelineDateKey(day.toISOString(), timezone)), [days, timezone]);
  const bounds = useMemo(() => timelineBounds(dates, items, timezone), [dates, items, timezone]);
  const height = (bounds.endHour - bounds.startHour) * hourHeight;
  const currentDate = timelineDateKey(now.toISOString(), timezone);
  const nowMinute = timelineMinute(now.toISOString(), timezone);
  const hourLabels = Array.from({ length: bounds.endHour - bounds.startHour + 1 }, (_, index) => bounds.startHour + index);
  const gridStyle = { "--timeline-days": days.length } as CSSProperties;

  useEffect(() => {
    const scroller = scrollRef.current;
    const index = dates.indexOf(currentDate);
    if (!scroller || index < 0 || scroller.scrollWidth <= scroller.clientWidth) return;
    const dayWidth = (scroller.scrollWidth - 54) / days.length;
    scroller.scrollLeft = Math.max(0, 54 + dayWidth * index - 54);
  }, [dates, currentDate, days.length]);
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 60_000); return () => window.clearInterval(timer); }, []);

  const time = (value: string) => new Intl.DateTimeFormat("nb-NO", { timeZone: timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(value));

  return <div className="calendar-timeline-scroll" ref={scrollRef} aria-label="Calendar time grid">
    <div className="calendar-timeline-inner" style={gridStyle}>
      <div className="calendar-timeline-header">
        <div className="calendar-timeline-zone">{timezone.split("/").at(-1)}</div>
        {days.map((day, index) => <div className={dates[index] === currentDate ? "calendar-timeline-heading today" : "calendar-timeline-heading"} key={dates[index]}>
          <span>{new Intl.DateTimeFormat("nb-NO", { timeZone: timezone, weekday: "short" }).format(day)}</span>
          <strong>{new Intl.DateTimeFormat("nb-NO", { timeZone: timezone, day: "numeric" }).format(day)}</strong>
        </div>)}
      </div>
      {markers.some(marker => dates.includes(marker.date ?? "")) && <div className="calendar-timeline-dated">
        <div className="calendar-timeline-dated-label">Time unknown</div>
        {dates.map(date => <div className="calendar-timeline-dated-day" key={date}>
          {markers.filter(marker => marker.date === date).map(marker => <div className={`calendar-timeline-marker ${marker.kind} ${marker.attendanceStatus ? `attendance-${marker.attendanceStatus}` : ""}`} key={`${marker.kind}-${marker.id}`} title="Date known; exact time not stated">
            <strong>{marker.title}</strong><small>{marker.kind === "attendance" ? marker.attendanceStatus === "absent" ? "Absent" : marker.attendanceStatus === "late" ? "Late" : "Attendance" : marker.kind} · time unknown</small>
          </div>)}
        </div>)}
      </div>}
      <div className="calendar-timeline-body">
        <div className="calendar-timeline-hours" style={{ height }}>
          {hourLabels.map(hour => <span key={hour} style={{ top: (hour - bounds.startHour) * hourHeight }}>{String(hour).padStart(2, "0")}:00</span>)}
        </div>
        {dates.map((date, index) => <div className={date === currentDate ? "calendar-timeline-day today" : "calendar-timeline-day"} style={{ height }} key={date} aria-label={new Intl.DateTimeFormat("nb-NO", { dateStyle: "full", timeZone: timezone }).format(days[index])}>
          {date === currentDate && nowMinute >= bounds.startHour * 60 && nowMinute <= bounds.endHour * 60 && <span className="calendar-timeline-now" style={{ top: ((nowMinute - bounds.startHour * 60) / 60) * hourHeight }} aria-label="Current time"/>}
          {placeTimelineDay(items, date, timezone).map(item => {
            const top = ((item.startMinute - bounds.startHour * 60) / 60) * hourHeight;
            const blockHeight = Math.max(20, ((item.endMinute - item.startMinute) / 60) * hourHeight - 2);
            const width = 100 / item.laneCount;
            return <article className={`calendar-timeline-event ${item.layer} ${item.attendanceStatus ? `attendance-${item.attendanceStatus}` : ""}`} key={item.id} style={{ top, height: blockHeight, left: `${item.lane * width}%`, width: `calc(${width}% - 3px)` }} title={`${item.title} · ${item.detail}`}>
              <strong>{item.title}</strong><small>{time(item.startsAt)}–{item.endsAt ? time(item.endsAt) : "time unknown"}{item.attendanceStatus === "absent" ? " · Absent" : item.attendanceStatus === "late" ? " · Late" : ""}</small>
            </article>;
          })}
        </div>)}
      </div>
    </div>
  </div>;
}
