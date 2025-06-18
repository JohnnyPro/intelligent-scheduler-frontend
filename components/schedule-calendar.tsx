"use client";
import {
  ScheduledSessionDto,
  SearchSessionsRequest,
} from "@/lib/types/schedule.types";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { Calendar, ChevronDownSquare, Download, Filter } from "lucide-react"; // Removed ChevronDownSquare as Popover handles its own chevron
import { DayOfWeek } from "@/lib/types";
import { useScheduleStore } from "@/lib/stores/schedule.store";
import useAuthStore from "@/lib/stores/auth-store";
import { Role } from "@/lib/types/users.types";
import { useTeacherStore } from "@/lib/stores/teacher.store";
import { useStudentGroupStore } from "@/lib/stores/student-group.store";
import { useClassroomStore } from "@/lib/stores/classroom.store";
import { useCourseStore } from "@/lib/stores/course.store";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"; // Import Popover components

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

export const ScheduleCalendar = () => {
  const days: ScheduledSessionDto["day"][] = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
  ];
  const { activeSchedule, sessions, filterSessionsInSchedule } =
    useScheduleStore();
  const { teachers, fetchTeachers } = useTeacherStore();
  const { studentGroups, fetchStudentGroups } = useStudentGroupStore();
  const { classrooms, fetchClassrooms } = useClassroomStore();
  const { courses, fetchCourses } = useCourseStore();

  const { user } = useAuthStore();
  const hours = Array.from(
    { length: TOTAL_HOURS },
    (_, i) => i + CALENDAR_START_HOUR
  );
  useEffect(() => {
    fetchTeachers(1, 10000);
    fetchStudentGroups(1, 10000);
    fetchClassrooms(1, 10000);
    fetchCourses(1, 10000);
  }, [fetchTeachers, fetchStudentGroups, fetchClassrooms, fetchCourses]);

  // Search parameters or session filtering
  const [searchParams, setSearchParams] = useState<SearchSessionsRequest>({
    scheduleId: "",
  });

  useEffect(() => {
    if (!user) return;

    const currentTeacherId = searchParams.teacherId;
    const currentStudentGroupId = searchParams.studentGroupId;

    if (user.role === Role.TEACHER) {
      const teacherId = teachers.find(
        (x) => x.userId == user.userId
      )?.teacherId;
      if (teacherId && teacherId !== currentTeacherId) {
        setSearchParams((prev) => ({
          ...prev,
          teacherId: teacherId,
        }));
      }
    } else if (user.role === Role.STUDENT) {
      const studentGroupId = studentGroups.find(
        (x) =>
          x.students?.filter((y) => y.userId == user.userId)?.length ?? 0 > 0
      )?.studentGroupId;
      if (studentGroupId && studentGroupId !== currentStudentGroupId) {
        setSearchParams((prev) => ({
          ...prev,
          studentGroupId: studentGroupId,
        }));
      }
    }
  }, [
    user,
    teachers,
    studentGroups,
    searchParams.teacherId,
    searchParams.studentGroupId,
  ]);

  // update search params when active schedule changes (usually done outside this component to make it flexible)
  useEffect(() => {
    const newScheduleId = activeSchedule?.scheduleId || "";
    if (searchParams.scheduleId !== newScheduleId) {
      setSearchParams((prev) => ({
        ...prev,
        scheduleId: newScheduleId,
      }));
    }
  }, [activeSchedule?.scheduleId, searchParams.scheduleId]);

  // make a backend request to get sessions based on active schedule and relevant filters
  useEffect(() => {
    if (!activeSchedule || !searchParams.scheduleId) return;
    filterSessionsInSchedule(searchParams);
  }, [filterSessionsInSchedule, activeSchedule, searchParams]);

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

  // Helper to reset all filters
  const clearAllFilters = () => {
    if (!user) {
      setSearchParams({ scheduleId: activeSchedule?.scheduleId || "" });
      return;
    }
    if (user.role == Role.ADMIN)
      setSearchParams({
        scheduleId: activeSchedule?.scheduleId || "",
      });
    else if (user.role == Role.TEACHER)
      setSearchParams({
        scheduleId: activeSchedule?.scheduleId || "",
        teacherId: teachers.find((x) => x.userId == user.userId)?.teacherId,
      });
    else if (user.role == Role.STUDENT)
      setSearchParams({
        scheduleId: activeSchedule?.scheduleId || "",
        studentGroupId: studentGroups.find((x) =>
          x.students?.filter((y) => y.userId == user.userId)
        )?.studentGroupId,
      });
  };

  // Helper to update a field in searchParams and trigger filtering
  const updateFilter = (
    field: keyof SearchSessionsRequest,
    value: string | undefined
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value === "all" ? undefined : value,
    }));
  };

  return (
    <div className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">
            {activeSchedule?.scheduleName ?? "Schedule Calendar"}
          </span>
        </div>
        <div className="flex items-center gap-2 relative">
          <Button variant="secondary" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          {/* Popover implementation */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="default" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDownSquare strokeWidth={3} className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-6">
              {" "}
              {/* Remove absolute positioning and custom top style */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Filter Schedule</span>
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={clearAllFilters}
                  type="button"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-4">
                {user?.role !== Role.TEACHER && (
                  <div>
                    <Label htmlFor="teacher-select">Teacher</Label>
                    <Select
                      value={searchParams.teacherId || "all"}
                      onValueChange={(val) => updateFilter("teacherId", val)}
                    >
                      <SelectTrigger id="teacher-select" className="mt-1">
                        <SelectValue placeholder="All Teachers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Teachers</SelectItem>
                        {teachers.map((t) => (
                          <SelectItem key={t.teacherId} value={t.teacherId}>
                            {t.user.firstName} {t.user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {user?.role !== Role.STUDENT && (
                  <div>
                    <Label htmlFor="group-select">Student Group</Label>
                    <Select
                      value={searchParams.studentGroupId || "all"}
                      onValueChange={(val) =>
                        updateFilter("studentGroupId", val)
                      }
                    >
                      <SelectTrigger id="group-select" className="mt-1">
                        <SelectValue placeholder="All Groups" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Groups</SelectItem>
                        {studentGroups.map((g) => (
                          <SelectItem
                            key={g.studentGroupId}
                            value={g.studentGroupId}
                          >
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="classroom-select">Classroom</Label>
                  <Select
                    value={searchParams.classroomId || "all"}
                    onValueChange={(val) => updateFilter("classroomId", val)}
                  >
                    <SelectTrigger id="classroom-select" className="mt-1">
                      <SelectValue placeholder="All Classrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classrooms</SelectItem>
                      {classrooms.map((c) => (
                        <SelectItem key={c.classroomId} value={c.classroomId}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="course-select">Course</Label>
                  <Select
                    value={searchParams.courseId || "all"}
                    onValueChange={(val) => updateFilter("courseId", val)}
                  >
                    <SelectTrigger id="course-select" className="mt-1">
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((c) => (
                        <SelectItem key={c.courseId} value={c.courseId}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* End Popover implementation */}
        </div>
      </div>

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
