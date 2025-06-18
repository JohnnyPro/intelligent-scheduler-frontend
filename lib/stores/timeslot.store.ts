import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";
import { TimeSlot } from "../types";

interface StoreState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  error: string;
  setError: (error: string) => void;

  timeslots: TimeSlot[];
  fetchTimeslots: () => void;
  getCalendarHourRange: () => { startHour: number; endHour: number };
  getHoursArray: () => number[];
}

export const useTimeslotStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      startLoading: () => set({ isLoading: true }),
      stopLoading: () => set({ isLoading: false }),

      error: "",
      setError: (error) => set({ error }),

      timeslots: [],
      
      fetchTimeslots: async () => {
        set({ isLoading: true });
        try {
          const response = await repository.getTimeslots();
          if (response.success && response.data) {
            set({ timeslots: response.data });
          } else {
            set({ error: `Error: ${response.message}` });
          }
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },

      getCalendarHourRange: () => {
        const { timeslots } = get();
        if (!timeslots.length) {
          // Fallback to hardcoded values if no timeslots
          return { startHour: 8, endHour: 19 };
        }

        // Parse start and end times from timeslots
        const times = timeslots.flatMap(slot => [
          parseTimeToMinutes(slot.startTime),
          parseTimeToMinutes(slot.endTime)
        ]);

        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        // Convert back to hours and round appropriately
        const startHour = Math.floor(minTime / 60);
        const endHour = Math.ceil(maxTime / 60);

        return { startHour, endHour };
      },

      getHoursArray: () => {
        const { startHour, endHour } = get().getCalendarHourRange();
        return Array.from({ length: endHour - startHour }, (_, i) => i + startHour);
      },
    }),
    {
      name: "timeslot",
    }
  )
);

// Helper function to parse time string (HH:MM) to minutes
const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}; 