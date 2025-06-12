import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as repository from "../repositories/repository"

import { Department, DepartmentCreating, DepartmentUpdating } from "../types/department.type"
import { PaginationData } from "../types";

interface StoreState {
    isLoading: boolean
    startLoading: () => void
    stopLoading: () => void
    error: string
    setError: (error: string) => void

    departments: Department[]
    pagination: PaginationData | null
    activeDepartment: Department | null
    fetchDepartments: (page?: number, size?: number) => void
    addDepartment: (department: DepartmentCreating) => void
    updateDepartment: (id: string, department: DepartmentUpdating) => void
    deleteDepartment: (id: string) => void
    setActive: (id: string) => void
}

export const useDepartmentStore = create<StoreState>()(
  persist(
    (set, get) => ({
        isLoading: false,
        startLoading: () => set({ isLoading: true }),
        stopLoading: () => set({ isLoading: false }),
        
        error: "",
        setError: (error) => set ({ error }),

        departments: [],
        pagination: null,
        activeDepartment: null,
        fetchDepartments: async (page = 1, size = 10) => {
            set({ isLoading: true })
            try {
              const departments = await repository.getDepartments(page, size)
              if (departments.success && departments.data){
                set({ departments: departments.data })
                set({ pagination: departments.pagination || null })
              }
              else
                set({ error: `Error: ${departments.message}` })

            } catch (e) {
                set({ error: `Error: ${e}` })
            } finally {
              set({ isLoading: false })
            }
          },
          addDepartment: async (department) => {
            set({ isLoading: true })
            try {
              const resp = await repository.addDepartment(department)
              if (resp.success)
                get().fetchDepartments()
              else
                set({ error: `Error${resp.statusCode}: ${resp.message}` })

            } catch (e) {
                set({ error: `Error: ${e}` })

            } finally {
              set({ isLoading: false })
            }
          },
          updateDepartment: async (id, department) => {
            set({ isLoading: true })
            try {
              const resp = await repository.updateDepartment(id, department)
              if (resp.success)
                get().fetchDepartments()
              else
                set({ error: `Error${resp.statusCode}: ${resp.message}` })
            } catch (e) {
                set({ error: `Error: ${e}` })

            } finally {
              set({ isLoading: false })
            }
          },
          deleteDepartment: async (id) => {
            set({ isLoading: true })
            try {
              const resp = await repository.deleteDepartment(id)
              if (resp.success)
                get().fetchDepartments()
              else
                set({ error: `Error${resp.statusCode}: ${resp.message}` })

            } catch (e) {
                set({ error: `Error: ${e}` })

            } finally {
              set({ isLoading: false })
            }
          },
          setActive: (id) => set({ activeDepartment: get().departments.find(x => x.deptId == id) || null }),

    }),
    {
      name: "department",
    },
  )
)
