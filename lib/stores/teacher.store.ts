import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as repository from "../repositories/repository"
import toast from "react-hot-toast"

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
            await toast.promise(repository.addTeacher(teacher), {
              loading: "Adding...",
              success: () => {
                get().fetchTeachers()
                return "Teacher Added!"
              },
              error: (e) => {
                let userFriendlyMessage = "An unexpected error occurred while adding teacher."
                if (e instanceof Error) {
                  userFriendlyMessage = e.message
                }
                set({ isLoading: false })
                return userFriendlyMessage
              },
            })
            set({ isLoading: false })
        },
        updateTeacher: async (id, teacher) => {
            set({ isLoading: true })
            await toast.promise(repository.updateTeacher(id, teacher), {
              loading: "Updating...",
              success: () => {
                get().fetchTeachers()
                return "Teacher Updated!"
              },
              error: (e) => {
                let userFriendlyMessage = "An unexpected error occurred while updating teacher."
                if (e instanceof Error) {
                  userFriendlyMessage = e.message
                }
                set({ isLoading: false })
                return userFriendlyMessage
              },
            })
            set({ isLoading: false })
        },
        deleteTeacher: async (id) => {
            set({ isLoading: true })
            await toast.promise(repository.deleteTeacher(id), {
              loading: "Deleting...",
              success: () => {
                get().fetchTeachers()
                return "Teacher Deleted!"
              },
              error: (e) => {
                let userFriendlyMessage = "An unexpected error occurred while deleting teacher."
                if (e instanceof Error) {
                  userFriendlyMessage = e.message
                }
                set({ isLoading: false })
                return userFriendlyMessage
              },
            })
            set({ isLoading: false })
        },
        setActive: (id) => set({ activeTeacher: get().teachers.find(x => x.teacherId == id) || null }),

    }),
    {
      name: "teacher",
    },
  )
)
