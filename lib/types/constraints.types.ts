export type Constraint = {
  id: string;
  constraintTypeId: string;
  value: Record<string, unknown>;
  weight: number;
  teacherId: string | null;
  campusId: string | null;
  constraintType: ConstraintType;
};

export type ConstraintType = {
  id: string;
  name: string;
  category: string;
  description: string;
  valueType: string;
};

export type TimePreference = {
  day: string;
  timeslotId: string;
  preference: "prefer" | "avoid" | "neutral";
};

export type RoomPreference = {
  classroomId: string;
  preference: "prefer" | "avoid";
};

export type ScheduleDistributionType = {
  maxDaysPerWeek: number;
  maxConsecutiveSessions: number;
  preferCompactSchedule: boolean;
};