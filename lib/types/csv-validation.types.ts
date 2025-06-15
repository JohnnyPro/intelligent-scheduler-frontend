import { TaskStatus } from "../types";

export enum Severity {
  ERROR = "ERROR",
  WARNING = "WARNING",
}

export type CsvUpload = {
  file: File;
  category: string;
  description?: string;
};

export type AllTasksResponse = {
  taskId: string;
  adminId: string;
  campusId?: string | null;
  status: TaskStatus;
  errorCount: number;
  fileName: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskError = {
  row: number;
  column: string;
  message: string;
  severity: Severity;
};

export type TaskResponse = AllTasksResponse & {
  errors: TaskError[];
};
