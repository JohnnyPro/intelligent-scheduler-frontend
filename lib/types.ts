export type Alert = {
  id: string;
  type: "error" | "warning" | "success" | "info";
  title: string;
  message: string;
  actionLink?: string;
  actionText?: string;
};

export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}
/**
 * enum TaskStatus {
  COMPLETED
  QUEUED
  FAILED
}

 */
export enum TaskStatus {
  COMPLETED = "COMPLETED",
  QUEUED = "QUEUED",
  FAILED = "FAILED",
}
export type Metric = {
  id: string;
  title: string;
  value: number;
  change: {
    type: "increase" | "decrease" | "no-change";
    value: string;
  };
  icon: string;
};

export enum SessionType {
  LECTURE = "LECTURE",
  LAB = "LAB",
  SEMINAR = "SEMINAR",
}

export enum ClassroomType {
  LECTURE = "LECTURE",
  LAB = "LAB",
  SEMINAR = "SEMINAR",
}

export enum CsvCategory {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  CLASSROOM = "CLASSROOM",
  DEPARTMENT = "DEPARTMENT",
  COURSE = "COURSE",
  STUDNETGROUP = "STUDNETGROUP",
  SGCOURSE = "SGCOURSE",
}

export type LoginResult =
  | { success: boolean; accessToken: string; refreshToken: string; error: "" }
  | { success: false; accessToken: null; refreshToken: null; error: string };

export interface TokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T | null;
  statusCode: number;
}

export type TimeSlot = {
  timeslotId: string;
  code: string;
  label: string;
  startTime: string;
  endTime: string;
  order: number;
};
