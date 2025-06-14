import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as repository from "../repositories/repository"

import { Teacher, TeacherCreating, TeacherUpdating } from "../types/teacher.type"
import { PaginationData } from "../types";

interface StoreState {
    isLoading: boolean
    startLoading: () => void
    stopLoading: () => void
    error: string
    setError: (error: string) => void

    teachers: Teacher[]
    pagination: PaginationData | null
    activeTeacher: Teacher | null
    fetchTeachers: (page?: number, size?: number) => void
    addTeacher: (teacher: TeacherCreating) => void
    updateTeacher: (id: string, teacher: TeacherUpdating) => void
    deleteTeacher: (id: string) => void
    setActive: (id: string) => void
}

export const useTeacherStore = create<StoreState>()(
  persist(
    (set, get) => ({
        isLoading: false,
        startLoading: () => set({ isLoading: true }),
        stopLoading: () => set({ isLoading: false }),
        
        error: "",
        setError: (error) => set ({ error }),

        teachers: [],
        pagination: null,
        activeTeacher: null,
        fetchTeachers: async (page = 1, size = 10) => {
            set({ isLoading: true })
            try {
              const teachers = await repository.getTeachers(page, size)
              if (teachers.success && teachers.data){
                set({ teachers: teachers.data })
                set({ pagination: teachers.pagination || null })
              }
              else
                set({ error: `Error: ${teachers.message}` })

            } catch (e) {
                set({ error: `Error: ${e}` })
            } finally {
              set({ isLoading: false })
            }
        },
        addTeacher: async (teacher) => {
            set({ isLoading: true })
            try {
              const resp = await repository.addTeacher(teacher)
              if (resp.success)
                get().fetchTeachers()
              else
                set({ error: `Error${resp.statusCode}: ${resp.message}` })

            } catch (e) {
                set({ error: `Error: ${e}` })

            } finally {
              set({ isLoading: false })
            }
        },
        updateTeacher: async (id, teacher) => {
            set({ isLoading: true })
            try {
              const resp = await repository.updateTeacher(id, teacher)
              if (resp.success)
                get().fetchTeachers()
              else
                set({ error: `Error${resp.statusCode}: ${resp.message}` })
            } catch (e) {
                set({ error: `Error: ${e}` })

            } finally {
              set({ isLoading: false })
            }
        },
        deleteTeacher: async (id) => {
            set({ isLoading: true })
            try {
              const resp = await repository.deleteTeacher(id)
              if (resp.success)
                get().fetchTeachers()
              else
                set({ error: `Error${resp.statusCode}: ${resp.message}` })

            } catch (e) {
                set({ error: `Error: ${e}` })

            } finally {
              set({ isLoading: false })
            }
        },
        setActive: (id) => set({ activeTeacher: get().teachers.find(x => x.teacherId == id) || null }),

    }),
    {
      name: "teacher",
    },
  )
)
