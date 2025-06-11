import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";
import { Alert, Metric, TimeSlot } from "../types";
// Store interface
interface StoreState {
  //Loading
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;

  // Data
  alerts: Alert[];
  metrics: Metric[];
  timeslots: TimeSlot[];

  fetchTimeslots: () => void;
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
      alerts: [],
      metrics: [],
      timeslots: [],
      // CRUD operations

      fetchTimeslots: async () => {
        set({ isLoading: true });
        try {
          const { success, data } = await repository.getTimeslots();
          if (success && (data?.length ?? 0) > 0) set({ timeslots: data! });
          else set({ timeslots: [] });
        } catch (e) {
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "intelligent-scheduling-system",
    }
  )
);
