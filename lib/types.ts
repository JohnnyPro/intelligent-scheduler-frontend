export type Teacher = {
   teacherId: string
   userId: string
   departmentId: string
   user: {
      firstName: string
      lastName: string
      email: string
   }
   department: {
      name: string
      campusId: string
   }
}

export type Room = {
   id: string
   name: string
   capacity: number
   building: string
   floor: number
   type: "Lecture Hall" | "Laboratory" | "Seminar Room" | "Computer Lab"
   isAccessible: boolean
   facilities: string[]
}
export type Classroom = {
   classroomId: string;
   name: string;
   capacity: number;
   type: ClassroomType;
   campusId: string;
   buildingId: string | null;
   isWheelchairAccessible: boolean;
   openingTime: string | null;
   closingTime: string | null;
   floor: number;
   campus: {
      name: string;
   };
   building?: {
      name: string;
   } | null;
}
export type ClassroomCreating = {
   name: string;
   capacity: number;
   type: ClassroomType;
   buildingId: string | null;
   isWheelchairAccessible: boolean;
   openingTime: string | null;
   closingTime: string | null;
   floor: number;
}
export type ClassroomUpdating = Partial<ClassroomCreating>;

export type ClassroomType = "LECTURE" | "LAB" | "SEMINAR"

export type StudentGroup = {
   studentGroupId: string
   name: string
   size: number
   accessibilityRequirement: boolean
   departmentId: string
   department: {
      name: string
      campusId: string
   }
}

export type Building = {
   id: string
   name: string
   address: string
   floors: number
   rooms: number
   isAccessible: boolean
}

export type Course = {
   id: string
   name: string
   department: string
   sessions: number
   teacher: string
   studentGroups: string[]
}

export enum Role {
   ADMIN,
   TEACHER,
   STUDENT
}

export type User = {
   userId: string
   firstName: string;
   lastName: string;
   email: string;
   role: Role;
   createdAt: Date;
   updatedAt: Date;
}




export type Schedule = {
   id: string
   name: string
   date: string
   status: "Completed" | "Failed" | "Published" | "In Progress"
   fitnessScore: string | null
}

export type Alert = {
   id: string
   type: "error" | "warning" | "success" | "info"
   title: string
   message: string
   actionLink?: string
   actionText?: string
}

export type Metric = {
   id: string
   title: string
   value: number
   change: {
      type: "increase" | "decrease" | "no-change"
      value: string
   }
   icon: string
}

export enum SessionType {
   LECTURE = "LECTURE",
   LAB = "LAB",
   TUTORIAL = "TUTORIAL",
}

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
   day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
}

export interface ScheduleResponse {
   scheduleId: string;
   sessions: ScheduledSessionDto[];
}

export type LoginResult = { success: boolean; accessToken: string; refreshToken: string; error: "" }
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