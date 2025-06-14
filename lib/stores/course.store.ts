import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as repository from "../repositories/repository"

import { Course, CourseCreating, CourseUpdating } from "../types/course.types"
import { PaginationData } from "../types";

interface StoreState {
    isLoading: boolean
    startLoading: () => void
    stopLoading: () => void
    error: string
    setError: (error: string) => void

    courses: Course[]
    pagination: PaginationData | null
    activeCourse: Course | null
    fetchCourses: (page?: number, size?: number) => void
    addCourse: (course: CourseCreating) => void
    updateCourse: (id: string, course: CourseUpdating) => void
    deleteCourse: (id: string) => void
    setActive: (id: string) => void
}

export const useCourseStore = create<StoreState>()(
  persist(
    (set, get) => ({
        isLoading: false,
        startLoading: () => set({ isLoading: true }),
        stopLoading: () => set({ isLoading: false }),
        
        error: "",
        setError: (error) => set ({ error }),

        courses: [],
        pagination: null,
        activeCourse: null,
        fetchCourses: async (page = 1, size = 10) => {
            set({ isLoading: true })
            try {
              const courses = await repository.getCourses(page, size)
              if (courses.success && courses.data){
                set({ courses: courses.data })
                set({ pagination: courses.pagination || null })
              }
              else
                set({ error: `Error: ${courses.message}` })

            } catch (e) {
                set({ error: `Error: ${e}` })
            } finally {
              set({ isLoading: false })
            }
          },
          addCourse: async (course) => {
            set({ isLoading: true })
            try {
              const resp = await repository.addCourse(course)
              if (resp.success)
                get().fetchCourses()
              else
                set({ error: `Error${resp.statusCode}: ${resp.message}` })

            } catch (e) {
                set({ error: `Error: ${e}` })

            } finally {
              set({ isLoading: false })
            }
          },
          updateCourse: async (id, course) => {
            set({ isLoading: true })
            try {
              const resp = await repository.updateCourse(id, course)
              if (resp.success)
                get().fetchCourses()
              else
                set({ error: `Error${resp.statusCode}: ${resp.message}` })
            } catch (e) {
                set({ error: `Error: ${e}` })

            } finally {
              set({ isLoading: false })
            }
          },
          deleteCourse: async (id) => {
            set({ isLoading: true })
            try {
              const resp = await repository.deleteCourse(id)
              if (resp.success)
                get().fetchCourses()
              else
                set({ error: `Error${resp.statusCode}: ${resp.message}` })

            } catch (e) {
                set({ error: `Error: ${e}` })

            } finally {
              set({ isLoading: false })
            }
          },
          setActive: (id) => set({ activeCourse: get().courses.find(x => x.courseId == id) || null }),

    }),
    {
      name: "course-store",
    },
  )
)
