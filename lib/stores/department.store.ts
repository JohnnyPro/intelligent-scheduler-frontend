import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as repository from "../repositories/repository"
import toast from "react-hot-toast"

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
            await toast.promise(repository.addDepartment(department), {
              loading: "Adding...",
              success: () => {
                get().fetchDepartments()
                return "Department Added!"
              },
              error: (e) => {
                let userFriendlyMessage = "An unexpected error occurred while adding department."
                if (e instanceof Error) {
                  userFriendlyMessage = e.message
                }
                return userFriendlyMessage
              },
            })
            set({ isLoading: false })
          },
          updateDepartment: async (id, department) => {
            set({ isLoading: true })
            await toast.promise(repository.updateDepartment(id, department), {
              loading: "Updating...",
              success: () => {
                get().fetchDepartments()
                return "Department Updated!"
              },
              error: (e) => {
                let userFriendlyMessage = "An unexpected error occurred while updating department."
                if (e instanceof Error) {
                  userFriendlyMessage = e.message
                }
                return userFriendlyMessage
              },
            })
            set({ isLoading: false })
          },
          deleteDepartment: async (id) => {
            set({ isLoading: true })
            await toast.promise(repository.deleteDepartment(id), {
              loading: "Deleting...",
              success: () => {
                get().fetchDepartments()
                return "Department Deleted!"
              },
              error: (e) => {
                let userFriendlyMessage = "An unexpected error occurred while deleting department."
                if (e instanceof Error) {
                  userFriendlyMessage = e.message
                }
                return userFriendlyMessage
              },
            })
            set({ isLoading: false })
          },
          setActive: (id) => set({ activeDepartment: get().departments.find(x => x.deptId == id) || null }),

    }),
    {
      name: "department",
    },
  )
)
