import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";

import {
  Building,
  BuildingCreating,
  BuildingUpdating,
} from "../types/building.types";
import { PaginationData } from "../types";
import toast from "react-hot-toast";

interface StoreState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  error: string;
  setError: (error: string) => void;

  buildings: Building[];
  pagination: PaginationData | null;
  activeBuilding: Building | null;
  fetchBuildings: (page?: number, size?: number) => void;
  addBuilding: (building: BuildingCreating) => void;
  updateBuilding: (id: string, building: BuildingUpdating) => void;
  deleteBuilding: (id: string) => void;
  setActive: (id: string) => void;
}

export const useBuildingStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      startLoading: () => set({ isLoading: true }),
      stopLoading: () => set({ isLoading: false }),

      error: "",
      setError: (error) => set({ error }),

      buildings: [],
      pagination: null,
      activeBuilding: null,
      fetchBuildings: async (page = 1, size = 10) => {
        set({ isLoading: true });
        try {
          const buildings = await repository.getBuildings(page, size);
          if (buildings.success && buildings.data) {
            set({ buildings: buildings.data });
            set({ pagination: buildings.pagination || null });
          } else set({ error: `Error: ${buildings.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      addBuilding: async (building) => {
        set({ isLoading: true });
        await toast.promise(repository.addBuilding(building), {
          loading: "Adding...",
          success: () => {
            get().fetchBuildings();
            return "Building Added!";
          },
          error: (e) => {
            let userFriendlyMessage =
              "An unexpected error occurred while adding building.";

            if (e instanceof Error) {
              userFriendlyMessage = e.message;
            }
            set({ isLoading: false });
            return userFriendlyMessage;
          },
        });
        set({ isLoading: false });
      },
      updateBuilding: async (id, building) => {
        set({ isLoading: true });
        await toast.promise(repository.updateBuilding(id, building), {
          loading: "Updating...",
          success: () => {
            get().fetchBuildings();
            return "Building Updated!";
          },
          error: (e) => {
            let userFriendlyMessage = "An unexpected error occurred while updating building.";
            if (e instanceof Error) {
              userFriendlyMessage = e.message;
            }
            set({ isLoading: false });
            return userFriendlyMessage;
          },
        });
        set({ isLoading: false });
      },
      deleteBuilding: async (id) => {
        set({ isLoading: true });
        await toast.promise(repository.deleteBuilding(id), {
          loading: "Deleting...",
          success: () => {
            get().fetchBuildings();
            return "Building Deleted!";
          },
          error: (e) => {
            let userFriendlyMessage = "An unexpected error occurred while deleting building.";
            if (e instanceof Error) {
              userFriendlyMessage = e.message;
            }
            set({ isLoading: false });
            return userFriendlyMessage;
          },
        });
        set({ isLoading: false });
      },
      setActive: (id) =>
        set({
          activeBuilding:
            get().buildings.find((x) => x.buildingId == id) || null,
        }),
    }),
    {
      name: "building",
    }
  )
);
