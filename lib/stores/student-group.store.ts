import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as repository from "../repositories/repository"

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
        try {
          const resp = await repository.addStudentGroup(studentGroup)
          if (resp.success)
            get().fetchStudentGroups()
          else
            set( { error: `Error${resp.statusCode}: ${resp.message}` })

        } catch (e) {
            set( { error: `Error: ${e}` })

        } finally {
          set({ isLoading: false })
        }
      },
      updateStudentGroup: async (id, studentGroup) => {
        set({ isLoading: true })
        try {
          const resp = await repository.updateStudentGroup(id, studentGroup)
          if (resp.success)
            get().fetchStudentGroups()
          else
            set( { error: `Error${resp.statusCode}: ${resp.message}` })
        } catch (e) {
            set( { error: `Error: ${e}` })

        } finally {
          set({ isLoading: false })
        }
      },
      deleteStudentGroup: async (id) => {
        set({ isLoading: true })
        try {
          const resp = await repository.deleteStudentGroup(id)
          if (resp.success)
            get().fetchStudentGroups()
          else
            set( { error: `Error${resp.statusCode}: ${resp.message}` })

        } catch (e) {
            set( { error: `Error: ${e}` })

        } finally {
          set({ isLoading: false })
        }
      },
      setActive: (id) => set({ activeStudentGroup: get().studentGroups.find(x => x.studentGroupId == id) || null}),

    }),
    {
      name: "student-group",
    },
))
