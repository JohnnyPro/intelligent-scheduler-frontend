import { SessionType } from "../types";
import { DayOfWeek } from "../types";

//REMOVE THIS AFTER IMPLEMENtING HISTORY COMP
export type Schedule = {
  id: string;
  name: string;
  date: string;
  status: "Completed" | "Failed" | "Published" | "In Progress";
  fitnessScore: string | null;
};

export type SearchSessionsRequest = {
  scheduleId: string;
  teacherId?: string;
  courseId?: string;
  sessionType?: SessionType;
  day?: DayOfWeek;
  classroomId?: string;
  classroomBuildingId?: string;
  studentGroupId?: string;
  classroomAccessibility?: boolean;
};

export interface ScheduledSessionDto {
   courseId: string;
   courseName: string;
   teacherId: string;
   teacherName: string;
   classroomId: string;
   classroomName: string;
   classGroupIds: string[];
   sessionType: SessionType;
   timeslot: string; // e.g., "13:30-15:00"
   day: DayOfWeek;
}

export interface ScheduleResponse {
   scheduleId: string;
   sessions: ScheduledSessionDto[];
}