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
import { mockTimeslots } from "../mock-data";
import {
  AllTasksResponse,
  CsvUpload,
  TaskResponse,
} from "../types/csv-validation.types";

// Teachers CRUD
export const getTeachers = () => apiClient<ApiResponse<Teacher[]>>(`/teachers`);
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
export const deleteTeacher = (id: string) =>
  apiClient<ApiResponse<any>>(`/teachers/${id}`, { method: "DELETE" });

// Rooms CRUD
export const getRooms = () =>
  apiClient<ApiResponse<Classroom[]>>(`/classrooms`);
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
export const getStudentGroups = () =>
  apiClient<ApiResponse<StudentGroup[]>>(`/student-groups`);
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
export const getBuildings = () =>
  apiClient<ApiResponse<Building[]>>(`/buildings`);
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
export const getCourses = () => apiClient<ApiResponse<Course[]>>(`/courses`);
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
export const generateSchedule = () =>
  apiClient<ApiResponse<ScheduleResponse>>(`/schedules/generate`, {
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

export const getProfile = async (
  accessToken: string
): Promise<ApiResponse<User>> => apiClient<ApiResponse<User>>(`/users/me`);

// TODO: Remove mock data and make it fetch from the backend
// export const getTimeslots = () => apiClient<ApiResponse<TimeSlot[]>>(`/timeslots`)
export const getTimeslots = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    data: mockTimeslots,
  };
};

// Departments CRUD
export const getDepartments = () =>
  apiClient<ApiResponse<Department[]>>(`/departments`);
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
export const getUsers = () => apiClient<ApiResponse<User[]>>(`/users`);
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

// Validation Status CRUD

export const getAllTasks = () => {
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
