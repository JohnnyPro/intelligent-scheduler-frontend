import { SessionType } from "../types";
import { Department } from "./department.type";

export type Course = {
  courseId: string;
  name: string;
  code: string;
  description: string | null;
  departmentId: string | null;
  ectsCredits: number;
  sessionType: SessionType;
  sessionsPerWeek: number;
  department?: Partial<Department> | null;
}


export type CourseCreating = {
  name: string;
  code: string;
  description?: string | null;
  departmentId?: string | null;
  ectsCredits?: number;
  sessionType?: SessionType;
  sessionsPerWeek: number;
}

export type CourseUpdating = Partial<CourseCreating>