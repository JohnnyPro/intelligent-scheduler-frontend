import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as repository from "../repositories/repository"
import toast from "react-hot-toast"

import { StudentGroup, StudentGroupCreating, StudentGroupUpdating } from "../types/student-group.types"
import { PaginationData } from "../types";

interface StoreState {
    isLoading: boolean
    startLoading: () => void
    stopLoading: () => void
    error: string
    setError: (error: string) => void

    studentGroups: StudentGroup[]
    pagination: PaginationData | null
    activeStudentGroup: StudentGroup | null
    fetchStudentGroups: (page?: number, size?: number) => void
    addStudentGroup: (studentGroup: StudentGroupCreating) => void
    updateStudentGroup: (id: string, studentGroup: StudentGroupUpdating) => void
    deleteStudentGroup: (id: string) => void
    setActive: (id: string) => void
}

export const useStudentGroupStore = create<StoreState>()(
  persist(
    (set, get) => ({
        isLoading: false,
        startLoading: () => set({ isLoading: true }),
        stopLoading: () => set({ isLoading: false }),
        
        error: "",
        setError: (error) => set ({ error}),

        studentGroups: [],
        pagination: null,
        activeStudentGroup: null,
    fetchStudentGroups: async (page = 1, size = 10) => {
        set({ isLoading: true })
        try {
          const studentGroups = await repository.getStudentGroups(page, size)
          if (studentGroups.success && studentGroups.data){
            set({ studentGroups: studentGroups.data})
            set({ pagination: studentGroups.pagination || null })
          }
          else
            set( { error: `Error: ${studentGroups.message}` })

        } catch (e) {
            set( { error: `Error: ${e}` })
        } finally {
          set({ isLoading: false })
        }
      },
      addStudentGroup: async (studentGroup) => {
        set({ isLoading: true })
        await toast.promise(repository.addStudentGroup(studentGroup), {
          loading: "Adding...",
          success: () => {
            get().fetchStudentGroups()
            return "Student Group Added!"
          },
          error: (e) => {
            let userFriendlyMessage = "An unexpected error occurred while adding student group."
            if (e instanceof Error) {
              userFriendlyMessage = e.message
            }
            return userFriendlyMessage
          },
        })
        set({ isLoading: false })
      },
      updateStudentGroup: async (id, studentGroup) => {
        set({ isLoading: true })
        await toast.promise(repository.updateStudentGroup(id, studentGroup), {
          loading: "Updating...",
          success: () => {
            get().fetchStudentGroups()
            return "Student Group Updated!"
          },
          error: (e) => {
            let userFriendlyMessage = "An unexpected error occurred while updating student group."
            if (e instanceof Error) {
              userFriendlyMessage = e.message
            }
            return userFriendlyMessage
          },
        })
        set({ isLoading: false })
      },
      deleteStudentGroup: async (id) => {
        set({ isLoading: true })
        await toast.promise(repository.deleteStudentGroup(id), {
          loading: "Deleting...",
          success: () => {
            get().fetchStudentGroups()
            return "Student Group Deleted!"
          },
          error: (e) => {
            let userFriendlyMessage = "An unexpected error occurred while deleting student group."
            if (e instanceof Error) {
              userFriendlyMessage = e.message
            }
            return userFriendlyMessage
          },
        })
        set({ isLoading: false })
      },
      setActive: (id) => set({ activeStudentGroup: get().studentGroups.find(x => x.studentGroupId == id) || null}),

    }),
    {
      name: "student-group",
    },
))
