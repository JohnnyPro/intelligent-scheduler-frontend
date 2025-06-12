import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";

import {
  Schedule,
  ScheduledSessionDto,
  ScheduleResponse,
  SearchSessionsRequest,
} from "../types/schedule.types";

interface StoreState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  error: string;
  setError: (error: string) => void;

  schedules: ScheduleResponse[];
  sessions: ScheduledSessionDto[];

  activeSchedule: ScheduleResponse | null;
  fetchSchedules: () => void;
  addSchedule: () => void;
  filterSessionsInSchedule: (params: SearchSessionsRequest) => void;
  deleteSchedule: (id: string) => void;
  activate: (id: string) => void;
  setActive: (id: string) => void; // THIS IS ONLY FOR FRONTEND NOT ACTUALLY SETTING THE ACTIVE SCHEDULE IN DB
  fetchCurrentSchedule: () => void;
}

export const useScheduleStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      startLoading: () => set({ isLoading: true }),
      stopLoading: () => set({ isLoading: false }),

      error: "",
      setError: (error) => set({ error }),

      schedules: [],
      sessions: [],
      activeSchedule: null,
      fetchSchedules: async () => {
        set({ isLoading: true });
        try {
          const schedules = await repository.getSchedules();
          if (schedules.success && schedules.data) {
            set({ schedules: schedules.data });
          } else set({ error: `Error: ${schedules.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      addSchedule: async () => {
        set({ isLoading: true });
        try {
          const resp = await repository.generateSchedule();
          if (resp.success) get().fetchSchedules();
          else set({ error: `Error${resp.statusCode}: ${resp.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      deleteSchedule: async (id) => {
        set({ isLoading: true });
        try {
          const resp = await repository.deleteSchedule(id);
          if (resp.success) get().fetchSchedules();
          else set({ error: `Error${resp.statusCode}: ${resp.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      // THIS IS FOR BACKEND ACTIVATE
      activate: (id) => {
        //TODO ACTIVATE BACKEND Integration
      },

      // THIS IS ONLY FOR FRONTEND NOT ACTUALLY SETTING THE ACTIVE SCHEDULE IN DB
      setActive: (id) =>
        set({
          activeSchedule:
            get().schedules.find((x) => x.scheduleId == id) || null,
        }),
      filterSessionsInSchedule: async (params) => {
        set({ isLoading: true });
        try {
          const resp = await repository.filterSessionsInSchedule(params);
          if (resp.success && resp.data) {
            set({
              sessions: resp.data?.sessions || [],
            });
          } else set({ error: `Error: ${resp.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      fetchCurrentSchedule: async () => {
        set({ isLoading: true });
        try {
          const resp = await repository.getCurrentSchedule();
          if (resp.success && resp.data) {
            set(() => {
              const existingIndex = get().schedules.findIndex(
                (s) => s.scheduleId == resp.data!.scheduleId
              );
              const newSchedules = [...get().schedules];

              if (existingIndex !== -1) {
                newSchedules[existingIndex] = resp.data!; // update existing
              } else {
                newSchedules.push(resp.data!); // add new
              }

              return {
                schedules: newSchedules,
                activeSchedule: resp.data,
              };
            });
          } else set({ error: `Error: ${resp.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "schedule",
    }
  )
);
