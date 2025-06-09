import { apiClient } from '@/lib/utils/api-client';

const api_url = 'http://localhost:3001'

import { Teacher, Room, StudentGroup, Building, Course, Schedule } from './types'

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
export const getTeachers = () => fetchJSON(`${api_url}/teachers`)
export const addTeacher = (teacher: Omit<Teacher, 'teacherId'>) =>
   fetchJSON(`${api_url}/teachers`, { method: 'POST', body: JSON.stringify(teacher) })
export const updateTeacher = (id: string, teacher: Partial<Teacher>) =>
   fetchJSON(`${api_url}/teachers/${id}`, { method: 'PUT', body: JSON.stringify(teacher) })
export const deleteTeacher = (id: string) =>
   fetchJSON(`${api_url}/teachers/${id}`, { method: 'DELETE' })

// Rooms CRUD
export const getRooms = () => fetchJSON(`${api_url}/classrooms`)
export const addRoom = (room: Omit<Room, 'id'>) =>
   fetchJSON(`${api_url}/classrooms`, { method: 'POST', body: JSON.stringify(room) })
export const updateRoom = (id: string, room: Partial<Room>) =>
   fetchJSON(`${api_url}/classrooms/${id}`, { method: 'PUT', body: JSON.stringify(room) })
export const deleteRoom = (id: string) =>
   fetchJSON(`${api_url}/classrooms/${id}`, { method: 'DELETE' })

// StudentGroups CRUD
export const getStudentGroups = () => fetchJSON(`${api_url}/student-groups`)
export const addStudentGroup = (studentGroup: Omit<StudentGroup, 'id'>) =>
   fetchJSON(`${api_url}/student-groups`, { method: 'POST', body: JSON.stringify(studentGroup) })
export const updateStudentGroup = (id: string, studentGroup: Partial<StudentGroup>) =>
   fetchJSON(`${api_url}/student-groups/${id}`, { method: 'PUT', body: JSON.stringify(studentGroup) })
export const deleteStudentGroup = (id: string) =>
   fetchJSON(`${api_url}/student-groups/${id}`, { method: 'DELETE' })

// Buildings CRUD
export const getBuildings = () => fetchJSON(`${api_url}/buildings`)
export const addBuilding = (building: Omit<Building, 'id'>) =>
   fetchJSON(`${api_url}/buildings`, { method: 'POST', body: JSON.stringify(building) })
export const updateBuilding = (id: string, building: Partial<Building>) =>
   fetchJSON(`${api_url}/buildings/${id}`, { method: 'PUT', body: JSON.stringify(building) })
export const deleteBuilding = (id: string) =>
   fetchJSON(`${api_url}/buildings/${id}`, { method: 'DELETE' })

// Courses CRUD
export const getCourses = () => fetchJSON(`${api_url}/courses`)
export const addCourse = (course: Omit<Course, 'id'>) =>
   fetchJSON(`${api_url}/courses`, { method: 'POST', body: JSON.stringify(course) })
export const updateCourse = (id: string, course: Partial<Course>) =>
   fetchJSON(`${api_url}/courses/${id}`, { method: 'PUT', body: JSON.stringify(course) })
export const deleteCourse = (id: string) =>
   fetchJSON(`${api_url}/courses/${id}`, { method: 'DELETE' })

// Schedules CRUD
export const getSchedules = () => fetchJSON(`${api_url}/schedules`)
export const addSchedule = (schedule: Omit<Schedule, 'id'>) =>
   fetchJSON(`${api_url}/schedules`, { method: 'POST', body: JSON.stringify(schedule) })
export const updateSchedule = (id: string, schedule: Partial<Schedule>) =>
   fetchJSON(`${api_url}/schedules/${id}`, { method: 'PUT', body: JSON.stringify(schedule) })
export const deleteSchedule = (id: string) =>
   fetchJSON(`${api_url}/schedules/${id}`, { method: 'DELETE' })

export const getCurrentSchedule = () => fetchJSON(`${api_url}/schedules`)
