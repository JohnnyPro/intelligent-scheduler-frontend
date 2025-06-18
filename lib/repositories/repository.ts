import { ApiResponse, TimeSlot } from "../types";
import {
  ScheduleResponse,
  SearchSessionsRequest,
} from "../types/schedule.types";
import {
  Classroom,
  ClassroomCreating,
  ClassroomUpdating,
} from "../types/classroom.types";
import {
  StudentGroup,
  StudentGroupCreating,
  StudentGroupUpdating,
} from "../types/student-group.types";
import {
  Teacher,
  TeacherCreating,
  TeacherUpdating,
} from "../types/teacher.type";
import {
  Building,
  BuildingCreating,
  BuildingUpdating,
} from "../types/building.types";
import { Course, CourseCreating, CourseUpdating } from "../types/course.types";
import { User, UserCreating, UserUpdating } from "../types/users.types";
import {
  Department,
  DepartmentCreating,
  DepartmentUpdating,
} from "../types/department.type";
import { apiClient } from "../utils/api-client";
import { Constraint, ConstraintCreating } from "../types/constraints.types";
import {
  AllTasksResponse,
  CsvUpload,
  TaskResponse,
} from "../types/csv-validation.types";
import { CsvCategory } from "../types";
import useAuthStore from "@/lib/stores/auth-store";

// Teachers CRUD
export const getTeachers = (page?: number, size?: number) =>
  apiClient<ApiResponse<Teacher[]>>(
    `/teachers?${page ? `page=${page}` : ""}${size ? `&size=${size}` : ""}`
  );
export const addTeacher = (teacher: TeacherCreating) =>
  apiClient<ApiResponse<Teacher>>(`/teachers`, {
    method: "POST",
    body: JSON.stringify(teacher),
  });
export const updateTeacher = (id: string, teacher: TeacherUpdating) =>
  apiClient<ApiResponse<Teacher>>(`/teachers/${id}`, {
    method: "PUT",
    body: JSON.stringify(teacher),
  });

export const assignTeacher = (id: string, teacher: TeacherUpdating) =>
  apiClient<ApiResponse<Teacher>>(`/teachers`, {
    method: "PATCH",
    body: JSON.stringify({
      teacherId: id,
      departmentId: teacher.departmentId,
      courseId: teacher.courseId,
    }),
  });

export const unassignTeacher = (teacherId: string, courseIds: string[]) =>
  apiClient<ApiResponse<void>>(`/teachers/unassign`, {
    method: "POST",
    body: JSON.stringify({
      teacherId: teacherId,
      courseIds: courseIds,
    }),
  });

export const deleteTeacher = (id: string) =>
  apiClient<ApiResponse<any>>(`/teachers/${id}`, { method: "DELETE" });

// Rooms CRUD
export const getRooms = (page?: number, size?: number) =>
  apiClient<ApiResponse<Classroom[]>>(
    `/classrooms?${page ? `page=${page}` : ""}${size ? `&size=${size}` : ""}`
  );
export const addRoom = (room: ClassroomCreating) =>
  apiClient<ApiResponse<Classroom>>(`/classrooms`, {
    method: "POST",
    body: JSON.stringify(room),
  });
export const updateRoom = (id: string, room: Partial<ClassroomUpdating>) =>
  apiClient<ApiResponse<Classroom>>(`/classrooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(room),
  });
export const deleteRoom = (id: string) =>
  apiClient<ApiResponse<any>>(`/classrooms/${id}`, { method: "DELETE" });

// StudentGroups CRUD
export const getStudentGroups = (page?: number, size?: number) =>
  apiClient<ApiResponse<StudentGroup[]>>(
    `/student-groups?${page ? `page=${page}` : ""}${size ? `&size=${size}` : ""
    }`
  );
export const addStudentGroup = (studentGroup: StudentGroupCreating) =>
  apiClient<ApiResponse<StudentGroup>>(`/student-groups`, {
    method: "POST",
    body: JSON.stringify(studentGroup),
  });
export const updateStudentGroup = (
  id: string,
  studentGroup: StudentGroupUpdating
) =>
  apiClient<ApiResponse<StudentGroup>>(`/student-groups/${id}`, {
    method: "PUT",
    body: JSON.stringify(studentGroup),
  });
export const deleteStudentGroup = (id: string) =>
  apiClient<ApiResponse<any>>(`/student-groups/${id}`, { method: "DELETE" });

// Buildings CRUD
export const getBuildings = (page?: number, size?: number) =>
  apiClient<ApiResponse<Building[]>>(
    `/buildings?${page ? `page=${page}` : ""}${size ? `&size=${size}` : ""}`
  );
export const addBuilding = (building: BuildingCreating) =>
  apiClient<ApiResponse<Building>>(`/buildings`, {
    method: "POST",
    body: JSON.stringify(building),
  });
export const updateBuilding = (id: string, building: BuildingUpdating) =>
  apiClient<ApiResponse<Building>>(`/buildings/${id}`, {
    method: "PUT",
    body: JSON.stringify(building),
  });
export const deleteBuilding = (id: string) =>
  apiClient<ApiResponse<any>>(`/buildings/${id}`, { method: "DELETE" });

// Courses CRUD
export const getCourses = (page?: number, size?: number) =>
  apiClient<ApiResponse<Course[]>>(
    `/courses?${page ? `page=${page}` : ""}${size ? `&size=${size}` : ""}`
  );
export const addCourse = (course: CourseCreating) =>
  apiClient<ApiResponse<Course>>(`/courses`, {
    method: "POST",
    body: JSON.stringify(course),
  });
export const updateCourse = (id: string, course: CourseUpdating) =>
  apiClient<ApiResponse<Course>>(`/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(course),
  });
export const deleteCourse = (id: string) =>
  apiClient<ApiResponse<any>>(`/courses/${id}`, { method: "DELETE" });

// Schedules CRUD
export const getSchedules = () =>
  apiClient<ApiResponse<ScheduleResponse[]>>(`/schedules`);
export const generateSchedule = (name: string) =>
  apiClient<ApiResponse<ScheduleResponse>>(`/schedules/generate/${name}`, {
    method: "POST",
  });

export const activateSchedule = (id: string) =>
  apiClient<ApiResponse<ScheduleResponse>>(`/schedules/activate/id/${id}`, {
    method: "POST",
  });

export const deleteSchedule = (id: string) =>
  apiClient<ApiResponse<any>>(`/schedules/${id}`, { method: "DELETE" });
export const getCurrentSchedule = () =>
  apiClient<ApiResponse<ScheduleResponse>>(`/schedules/active`);
export const filterSessionsInSchedule = (params: SearchSessionsRequest) =>
  apiClient<ApiResponse<ScheduleResponse>>(`/schedules/sessions/id/search`, {
    method: "POST",
    body: JSON.stringify(params),
  });

export const exportScheduleToPdf = async (params: SearchSessionsRequest): Promise<Blob> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001"}/schedules/export/pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${useAuthStore.getState().accessToken}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to export schedule: ${response.statusText}`);
  }

  return response.blob();
};

export const getProfile = async (
  accessToken: string
): Promise<ApiResponse<User>> => apiClient<ApiResponse<User>>(`/users/me`);

export const getTimeslots = () =>
  apiClient<ApiResponse<TimeSlot[]>>(`/timeslots`);

// Departments CRUD
export const getDepartments = (page?: number, size?: number) =>
  apiClient<ApiResponse<Department[]>>(
    `/departments?${page ? `page=${page}` : ""}${size ? `&size=${size}` : ""}`
  );
export const addDepartment = (department: DepartmentCreating) =>
  apiClient<ApiResponse<Department>>(`/departments`, {
    method: "POST",
    body: JSON.stringify(department),
  });
export const updateDepartment = (id: string, department: DepartmentUpdating) =>
  apiClient<ApiResponse<Department>>(`/departments/${id}`, {
    method: "PUT",
    body: JSON.stringify(department),
  });
export const deleteDepartment = (id: string) =>
  apiClient<ApiResponse<any>>(`/departments/${id}`, { method: "DELETE" });

// Users CRUD
export const getUsers = (page?: number, size?: number) =>
  apiClient<ApiResponse<User[]>>(
    `/users?${page ? `page=${page}` : ""}${size ? `&size=${size}` : ""}`
  );
export const addUser = (user: UserCreating) =>
  apiClient<ApiResponse<User>>(`/users`, {
    method: "POST",
    body: JSON.stringify(user),
  });
export const updateUser = (id: string, user: UserUpdating) =>
  apiClient<ApiResponse<User>>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });
export const deleteUser = (id: string) =>
  apiClient<ApiResponse<any>>(`/users/${id}`, { method: "DELETE" });

// CSV Upload CRUD

export const uploadCsv = (data: CsvUpload) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("category", data.category);
  if (data.description) {
    formData.append("description", data.description);
  }

  return apiClient<ApiResponse<string>>("/file/upload", {
    method: "POST",
    body: formData,
  });
};

export const downloadTemplate = (category: CsvCategory) => {
  return apiClient<Blob>(`/file/template/${category}`, {
    method: "GET",
    headers: {
      Accept: "text/csv",
    },
  });
};

// Validation Status CRUD

export const getAllTasks = (page?: number, size?: number) => {
  return apiClient<ApiResponse<AllTasksResponse[]>>("/validation/status", {
    method: "GET",
  });
};

export const getTask = (id: string) => {
  return apiClient<ApiResponse<TaskResponse>>(`/validation/status/${id}`, {
    method: "GET",
  });
};

export const deleteTask = (id: string) => {
  return apiClient<ApiResponse<AllTasksResponse>>(`/validation/${id}`, {
    method: "DELETE",
  });
};

// Teacher Preferences CRUD
export const getTeacherPreferences = () =>
  apiClient<ApiResponse<Constraint[]>>(`/constraints`);

export const createConstraint = (constraint: ConstraintCreating) =>
  apiClient<ApiResponse<Constraint>>("/constraints", {
    method: "POST",
    body: JSON.stringify(constraint),
  });

// Metrics API functions
export const getDashboardMetrics = () =>
  apiClient<ApiResponse<{
    id: string;
    title: string;
    value: number;
    change: {
      type: 'increase' | 'decrease' | 'no-change';
      value: string;
    };
    icon: string;
  }[]>>('/metrics/dashboard');

export const getSystemAlerts = () =>
  apiClient<ApiResponse<{
    id: string;
    type: 'error' | 'warning' | 'success' | 'info';
    title: string;
    message: string;
    actionLink?: string;
    actionText?: string;
  }[]>>('/metrics/alerts');

export const getRoomUtilization = (scheduleId?: string) =>
  apiClient<ApiResponse<{
    overall: number;
    byBuilding: Array<{
      buildingId: string;
      buildingName: string;
      utilization: number;
      totalMinutesScheduled: number;
      totalMinutesAvailable: number;
    }>;
  }>>(`/metrics/room-utilization${scheduleId ? `?scheduleId=${scheduleId}` : ''}`);

export const getScheduleQuality = (scheduleId?: string) =>
  apiClient<ApiResponse<{
    roomUtilization: number;
    teacherPreferenceSatisfaction: number;
    teacherWorkloadBalance: number;
    studentGroupConflictRate: number;
    scheduleCompactness: number;
    overallScore: number;
  }>>(`/metrics/schedule-quality${scheduleId ? `?scheduleId=${scheduleId}` : ''}`);

export const getTeacherWorkload = (scheduleId?: string) =>
  apiClient<ApiResponse<Array<{
    teacherId: string;
    teacherName: string;
    totalSessions: number;
    preferenceSatisfactionRatio: number;
    dailySessions: number[];
  }>>>(`/metrics/teacher-workload${scheduleId ? `?scheduleId=${scheduleId}` : ''}`);

export const getTeacherPreferenceTrends = () =>
  apiClient<ApiResponse<Array<{
    timeslot: string;
    preferCount: number;
    avoidCount: number;
    neutralCount: number;
  }>>>('/metrics/teacher-preference-trends');

export const getCrowdedTimeslots = (scheduleId?: string) =>
  apiClient<ApiResponse<Array<{
    day: string;
    timeslot: string;
    usagePercentage: number;
    sessionCount: number;
    roomsAvailable: number;
  }>>>(`/metrics/crowded-timeslots${scheduleId ? `?scheduleId=${scheduleId}` : ''}`);
