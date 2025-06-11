import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as repository from "../repositories/repository"

import { Building, BuildingCreating, BuildingUpdating } from "../types/building.types"

interface StoreState {
    isLoading: boolean
    startLoading: () => void
    stopLoading: () => void
    error: string
    setError: (error: string) => void

    buildings: Building[]
    activeBuilding: Building | null
    fetchBuildings: () => void
    addBuilding: (building: BuildingCreating) => void
    updateBuilding: (id: string, building: BuildingUpdating) => void
    deleteBuilding: (id: string) => void
    setActive: (id: string) => void
}

export const useBuildingStore = create<StoreState>()(
  persist(
    (set, get) => ({
        isLoading: false,
        startLoading: () => set({ isLoading: true }),
        stopLoading: () => set({ isLoading: false }),
        
        error: "",
        setError: (error) => set ({ error }),

        buildings: [],
        activeBuilding: null,
        fetchBuildings: async () => {
            set({ isLoading: true })
            try {
              const buildings = await repository.getBuildings()
              if (buildings.success && buildings.data){
                set({ buildings: buildings.data })
              }
              else
                set({ error: `Error: ${buildings.message}` })

            } catch (e) {
                set({ error: `Error: ${e}` })
            } finally {
              set({ isLoading: false })
            }
        },
        addBuilding: async (building) => {
            set({ isLoading: true })
            try {
              const resp = await repository.addBuilding(building)
              if (resp.success)
                get().fetchBuildings()
              else
                set({ error: `Error${resp.statusCode}: ${resp.message}` })

            } catch (e) {
                set({ error: `Error: ${e}` })

            } finally {
              set({ isLoading: false })
            }
        },
        updateBuilding: async (id, building) => {
            set({ isLoading: true })
            try {
              const resp = await repository.updateBuilding(id, building)
              if (resp.success)
                get().fetchBuildings()
              else
                set({ error: `Error${resp.statusCode}: ${resp.message}` })
            } catch (e) {
                set({ error: `Error: ${e}` })

            } finally {
              set({ isLoading: false })
            }
        },
        deleteBuilding: async (id) => {
            set({ isLoading: true })
            try {
              const resp = await repository.deleteBuilding(id)
              if (resp.success)
                get().fetchBuildings()
              else
                set({ error: `Error${resp.statusCode}: ${resp.message}` })

            } catch (e) {
                set({ error: `Error: ${e}` })

            } finally {
              set({ isLoading: false })
            }
        },
        setActive: (id) => set({ activeBuilding: get().buildings.find(x => x.buildingId == id) || null }),

    }),
    {
      name: "building",
    },
  )
)
