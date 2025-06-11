"use client";
import { ScheduledSessionDto } from "@/lib/types/schedule.types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";
import { Calendar, Download, Filter } from "lucide-react";
import { DayOfWeek } from "@/lib/types";

const CALENDAR_START_HOUR = 8;
const CALENDAR_END_HOUR = 19;
const TOTAL_HOURS = CALENDAR_END_HOUR - CALENDAR_START_HOUR;

// The fixed height for each schedule item, as a percentage of the day's total height.
const ITEM_HEIGHT = 10;

// The vertical offset for each overlapping item in a stack, as a percentage.
const STACK_OFFSET = 2.5;

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const getCourseColor = (courseName: string) => {
  const colors = [
    "bg-purple-100 border-purple-300 text-purple-800",
    "bg-blue-100 border-blue-300 text-blue-800",
    "bg-green-100 border-green-300 text-green-800",
    "bg-yellow-100 border-yellow-300 text-yellow-800",
    "bg-pink-100 border-pink-300 text-pink-800",
    "bg-indigo-100 border-indigo-300 text-indigo-800",
  ];
  // const colors = [
  //    "bg-purple-100 border-purple-300",
  //    "bg-blue-100 border-blue-300",
  //    "bg-green-100 border-green-300",
  //    "bg-yellow-100 border-yellow-300",
  //    "bg-pink-100 border-pink-300",
  //    "bg-indigo-100 border-indigo-300",
  // ];
  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

interface PositionedSession extends ScheduledSessionDto {
  top: number;
  height: number;
  zIndex: number;
}

interface ScheduleItemProps {
  session: PositionedSession;
}

interface ScheduleCalendarProps {
  sessions: ScheduledSessionDto[];
}

const ScheduleItem = ({ session }: ScheduleItemProps) => {
  const colorClasses = getCourseColor(session.courseName);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "absolute w-[98%] rounded-md border p-2 overflow-hidden text-xs shadow-sm",
        "transition-all duration-200 ease-in-out cursor-pointer",
        "hover:scale-105 hover:shadow-lg",
        colorClasses
      )}
      style={{
        top: `${session.top}%`,
        height: `${session.height}%`,
        zIndex: hovered ? 50 : session.zIndex,
      }}
      title={`${session.courseName}\n${session.timeslot}\n${session.teacherName}\nRoom: ${session.classroomName}`}
    >
      <p className="font-bold leading-tight truncate">{session.courseName}</p>
      <p className="leading-tight truncate">{session.teacherName}</p>
      <p className="leading-tight">Room: {session.classroomName}</p>
    </div>
  );
};

export const ScheduleCalendar = ({ sessions }: ScheduleCalendarProps) => {
  const days: ScheduledSessionDto["day"][] = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
  ];
  const hours = Array.from(
    { length: TOTAL_HOURS },
    (_, i) => i + CALENDAR_START_HOUR
  );

  const getPositionedSessionsForDay = (
    daySessions: ScheduledSessionDto[]
  ): PositionedSession[] => {
    if (!daySessions.length) {
      return [];
    }

    // Sort sessions by start time to ensure a consistent stacking order.
    const sortedSessions = [...daySessions].sort((a, b) => {
      const startA = timeToMinutes(a.timeslot.split("-")[0]);
      const startB = timeToMinutes(b.timeslot.split("-")[0]);
      if (startA === startB) {
        return a.courseName.localeCompare(b.courseName); // Secondary sort for stability
      }
      return startA - startB;
    });

    const positionedSessions: PositionedSession[] = [];
    const calendarStartMinutes = CALENDAR_START_HOUR * 60;
    const totalCalendarMinutes = TOTAL_HOURS * 60;

    // A map to track how many items we've already placed at a given start time.
    const stackCount: { [key: number]: number } = {};

    for (const session of sortedSessions) {
      const startMinutes = timeToMinutes(session.timeslot.split("-")[0]);

      const stackIndex = stackCount[startMinutes] || 0;
      stackCount[startMinutes] = stackIndex + 1;

      const baseTop =
        ((startMinutes - calendarStartMinutes) / totalCalendarMinutes) * 100;

      const finalTop = baseTop + stackIndex * STACK_OFFSET;

      positionedSessions.push({
        ...session,
        top: finalTop,
        height: ITEM_HEIGHT,
        zIndex: stackIndex,
      });
    }

    return positionedSessions;
  };

  const templateColumns = days.map((day) =>
    sessions.some((s) => s.day.toUpperCase() === day) ? "3fr" : "1fr"
  );
  return (
    <div className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b p-4 bg-neutral-200 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">Generic Calendar Name</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {/* <div className="flex rounded-md border">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none rounded-l-md border-r bg-gray-100">
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-r">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none rounded-r-md">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div> */}
        </div>
      </div>

      {/* === Replace the old static grid with our new dynamic component === */}

      <div className="grid grid-cols-[auto_1fr] bg-white">
        {/* Time Column */}
        <div className="flex flex-col border-r">
          <div className="h-10 border-b"></div> {/* Empty corner */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex h-16 items-start justify-end pr-2 pt-1 border-b"
            >
              <span className="text-sm text-gray-500">{hour}:00</span>
            </div>
          ))}
        </div>

        {/* Schedule Grid */}
        <div
          className="grid grid-cols-7"
          style={{ gridTemplateColumns: templateColumns.join(" ") }}
        >
          {days.map((day) => {
            const daySessions = sessions.filter(
              (s) => s.day.toUpperCase() === day
            );
            const positionedSessions = getPositionedSessionsForDay(daySessions);

            return (
              <div key={day} className="flex-1 border-r last:border-r-0">
                {/* Day Header */}
                <div className="h-10 border-b p-2 text-center font-medium">
                  {day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
                </div>
                {/* Sessions Column */}
                <div className="relative h-full">
                  {/* Hour lines for visual reference */}
                  {hours.map((_, index) => (
                    <div key={index} className="h-16 border-b"></div>
                  ))}
                  {positionedSessions.map((session) => (
                    <ScheduleItem key={session.courseId} session={session} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
