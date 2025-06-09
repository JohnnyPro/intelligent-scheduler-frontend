import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as repository from "../repositories/repository"
import { Teacher, Room, StudentGroup, Building, Course, Alert, Metric, ScheduleResponse } from '../types'

// Store interface
interface StoreState {
  //Loading
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void

  // Data
  teachers: Teacher[]
  rooms: Room[]
  studentGroups: StudentGroup[]
  buildings: Building[]
  courses: Course[]
  schedules: ScheduleResponse[]
  alerts: Alert[]
  metrics: Metric[]
  currentSchedule: ScheduleResponse | null

  // CRUD operations
  fetchTeachers: () => void
  addTeacher: (teacher: Omit<Teacher, "id">) => void
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void
  deleteTeacher: (id: string) => void

  fetchRooms: () => void
  addRoom: (room: Omit<Room, "id">) => void
  updateRoom: (id: string, room: Partial<Room>) => void
  deleteRoom: (id: string) => void

  fetchStudentGroups: () => void
  addStudentGroup: (studentGroup: Omit<StudentGroup, "id">) => void
  updateStudentGroup: (id: string, studentGroup: Partial<StudentGroup>) => void
  deleteStudentGroup: (id: string) => void

  fetchBuildings: () => void
  addBuilding: (building: Omit<Building, "id">) => void
  updateBuilding: (id: string, building: Partial<Building>) => void
  deleteBuilding: (id: string) => void

  fetchCourses: () => void
  addCourse: (course: Omit<Course, "id">) => void
  updateCourse: (id: string, course: Partial<Course>) => void
  deleteCourse: (id: string) => void

  fetchSchedules: () => void
  fetchCurrentSchedule: () => void
  updateSchedule: (id: string, schedule: Partial<ScheduleResponse>) => void
  deleteSchedule: (id: string) => void
}

// Create store
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Loading
      isLoading: false,
      startLoading: () => set({ isLoading: true }),
      stopLoading: () => set({ isLoading: false }),

      // Data
      teachers: [],
      rooms: [],
      studentGroups: [],
      buildings: [],
      courses: [],
      schedules: [],
      alerts: [],
      metrics: [],
      currentSchedule: null,
      schedule: null,
      // CRUD operations
      fetchTeachers: async () => {
        set({ isLoading: true })
        try {
          const teachers = await repository.getTeachers()
          set({ teachers })
        } catch (e) {
          // Optionally handle error
        } finally {
          set({ isLoading: false })
        }
      },
      addTeacher: async (teacher) => {
        set({ isLoading: true })
        try {
          await repository.addTeacher(teacher)
          const teachers = await repository.getTeachers()
          set({ teachers })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      updateTeacher: async (id, teacher) => {
        set({ isLoading: true })
        try {
          await repository.updateTeacher(id, teacher)
          const teachers = await repository.getTeachers()
          set({ teachers })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      deleteTeacher: async (id) => {
        set({ isLoading: true })
        try {
          await repository.deleteTeacher(id)
          const teachers = await repository.getTeachers()
          set({ teachers })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },

      fetchRooms: async () => {
        set({ isLoading: true })
        try {
          const rooms = await repository.getRooms()
          set({ rooms })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      addRoom: async (room) => {
        set({ isLoading: true })
        try {
          await repository.addRoom(room)
          const rooms = await repository.getRooms()
          set({ rooms })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      updateRoom: async (id, room) => {
        set({ isLoading: true })
        try {
          await repository.updateRoom(id, room)
          const rooms = await repository.getRooms()
          set({ rooms })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      deleteRoom: async (id) => {
        set({ isLoading: true })
        try {
          await repository.deleteRoom(id)
          const rooms = await repository.getRooms()
          set({ rooms })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },

      fetchStudentGroups: async () => {
        set({ isLoading: true })
        try {
          const studentGroups = await repository.getStudentGroups()
          set({ studentGroups })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      addStudentGroup: async (studentGroup) => {
        set({ isLoading: true })
        try {
          await repository.addStudentGroup(studentGroup)
          const studentGroups = await repository.getStudentGroups()
          set({ studentGroups })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      updateStudentGroup: async (id, studentGroup) => {
        set({ isLoading: true })
        try {
          await repository.updateStudentGroup(id, studentGroup)
          const studentGroups = await repository.getStudentGroups()
          set({ studentGroups })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      deleteStudentGroup: async (id) => {
        set({ isLoading: true })
        try {
          await repository.deleteStudentGroup(id)
          const studentGroups = await repository.getStudentGroups()
          set({ studentGroups })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },

      fetchBuildings: async () => {
        set({ isLoading: true })
        try {
          const buildings = await repository.getBuildings()
          set({ buildings })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      addBuilding: async (building) => {
        set({ isLoading: true })
        try {
          await repository.addBuilding(building)
          const buildings = await repository.getBuildings()
          set({ buildings })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      updateBuilding: async (id, building) => {
        set({ isLoading: true })
        try {
          await repository.updateBuilding(id, building)
          const buildings = await repository.getBuildings()
          set({ buildings })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      deleteBuilding: async (id) => {
        set({ isLoading: true })
        try {
          await repository.deleteBuilding(id)
          const buildings = await repository.getBuildings()
          set({ buildings })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },

      fetchCourses: async () => {
        set({ isLoading: true })
        try {
          const courses = await repository.getCourses()
          set({ courses })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      addCourse: async (course) => {
        set({ isLoading: true })
        try {
          await repository.addCourse(course)
          const courses = await repository.getCourses()
          set({ courses })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      updateCourse: async (id, course) => {
        set({ isLoading: true })
        try {
          await repository.updateCourse(id, course)
          const courses = await repository.getCourses()
          set({ courses })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      deleteCourse: async (id) => {
        set({ isLoading: true })
        try {
          await repository.deleteCourse(id)
          const courses = await repository.getCourses()
          set({ courses })
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },

      fetchSchedules: async () => {
        set({ isLoading: true })
        try {
          const { success, data, message } = await repository.getSchedules();
          if (success && ((data?.length ?? 0) > 0))
            set({ schedules: data! })


        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      fetchCurrentSchedule: async () => {
        set({ isLoading: true })
        try {
          const { success, data, message } = await repository.getSchedules();
          if (success && ((data?.length ?? 0) > 0))
            set({ currentSchedule: data![0] })
          else
            set({ currentSchedule: null })
        }
        catch (e) {
          console.error(e);
        } finally {
          set({ isLoading: false })
        }

      },
      updateSchedule: async (id, schedule) => {
        set({ isLoading: true })
        try {
          await repository.updateSchedule(id, schedule)
          get().fetchSchedules()
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
      deleteSchedule: async (id) => {
        set({ isLoading: true })
        try {
          await repository.deleteSchedule(id)
          get().fetchSchedules()
        } catch (e) {
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: "intelligent-scheduling-system",
    },
  ),
)
