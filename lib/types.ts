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

export type PaginationData = {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
};

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
  pagination?: PaginationData;
}
export interface ApiErrorData {
  message?: string;
  code?: string;
  details?: any;
  timestamp?: string;
}

export type TimeSlot = {
  timeslotId: string;
  code: string;
  label: string;
  startTime: string;
  endTime: string;
  order: number;
};
