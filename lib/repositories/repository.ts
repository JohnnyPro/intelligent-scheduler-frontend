const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:3001';

import { Teacher, Room, StudentGroup, Building, Course, ApiResponse, ScheduleResponse } from '../types'
import { apiClient } from '../utils/api-client';

// Helper for fetch with JSON
async function fetchJSON(url: string, options: RequestInit = {}) {
   const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
   })
   if (!res.ok) throw new Error(await res.text())
   return res.json()
}
// Teachers CRUD
export const getTeachers = () => fetchJSON(`${API_BASE_URL}/teachers`)
export const addTeacher = (teacher: Omit<Teacher, 'teacherId'>) =>
   fetchJSON(`${API_BASE_URL}/teachers`, { method: 'POST', body: JSON.stringify(teacher) })
export const updateTeacher = (id: string, teacher: Partial<Teacher>) =>
   fetchJSON(`${API_BASE_URL}/teachers/${id}`, { method: 'PUT', body: JSON.stringify(teacher) })
export const deleteTeacher = (id: string) =>
   fetchJSON(`${API_BASE_URL}/teachers/${id}`, { method: 'DELETE' })

// Rooms CRUD
export const getRooms = () => fetchJSON(`${API_BASE_URL}/classrooms`)
export const addRoom = (room: Omit<Room, 'id'>) =>
   fetchJSON(`${API_BASE_URL}/classrooms`, { method: 'POST', body: JSON.stringify(room) })
export const updateRoom = (id: string, room: Partial<Room>) =>
   fetchJSON(`${API_BASE_URL}/classrooms/${id}`, { method: 'PUT', body: JSON.stringify(room) })
export const deleteRoom = (id: string) =>
   fetchJSON(`${API_BASE_URL}/classrooms/${id}`, { method: 'DELETE' })

// StudentGroups CRUD
export const getStudentGroups = () => fetchJSON(`${API_BASE_URL}/student-groups`)
export const addStudentGroup = (studentGroup: Omit<StudentGroup, 'id'>) =>
   fetchJSON(`${API_BASE_URL}/student-groups`, { method: 'POST', body: JSON.stringify(studentGroup) })
export const updateStudentGroup = (id: string, studentGroup: Partial<StudentGroup>) =>
   fetchJSON(`${API_BASE_URL}/student-groups/${id}`, { method: 'PUT', body: JSON.stringify(studentGroup) })
export const deleteStudentGroup = (id: string) =>
   fetchJSON(`${API_BASE_URL}/student-groups/${id}`, { method: 'DELETE' })

// Buildings CRUD
export const getBuildings = () => fetchJSON(`${API_BASE_URL}/buildings`)
export const addBuilding = (building: Omit<Building, 'id'>) =>
   fetchJSON(`${API_BASE_URL}/buildings`, { method: 'POST', body: JSON.stringify(building) })
export const updateBuilding = (id: string, building: Partial<Building>) =>
   fetchJSON(`${API_BASE_URL}/buildings/${id}`, { method: 'PUT', body: JSON.stringify(building) })
export const deleteBuilding = (id: string) =>
   fetchJSON(`${API_BASE_URL}/buildings/${id}`, { method: 'DELETE' })

// Courses CRUD
export const getCourses = () => fetchJSON(`${API_BASE_URL}/courses`)
export const addCourse = (course: Omit<Course, 'id'>) =>
   fetchJSON(`${API_BASE_URL}/courses`, { method: 'POST', body: JSON.stringify(course) })
export const updateCourse = (id: string, course: Partial<Course>) =>
   fetchJSON(`${API_BASE_URL}/courses/${id}`, { method: 'PUT', body: JSON.stringify(course) })
export const deleteCourse = (id: string) =>
   fetchJSON(`${API_BASE_URL}/courses/${id}`, { method: 'DELETE' })

// Schedules CRUD
export const getSchedules = () => apiClient<ApiResponse<ScheduleResponse[]>>(`/schedules`)
export const addSchedule = (schedule: Omit<ScheduleResponse, 'id'>) =>
   fetchJSON(`${API_BASE_URL}/schedules`, { method: 'POST', body: JSON.stringify(schedule) })
export const updateSchedule = (id: string, schedule: Partial<ScheduleResponse>) =>
   fetchJSON(`${API_BASE_URL}/schedules/${id}`, { method: 'PUT', body: JSON.stringify(schedule) })
export const deleteSchedule = (id: string) =>
   fetchJSON(`${API_BASE_URL}/schedules/${id}`, { method: 'DELETE' })

//TODO: NOT DONE ON THE BACKEND
export const getCurrentSchedule = () => apiClient<ApiResponse<ScheduleResponse>>(`/current-schedule`)
