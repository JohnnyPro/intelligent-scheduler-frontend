import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";
import toast from "react-hot-toast";

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
  addSchedule: (name: string, timeLimit?: number) => void;
  filterSessionsInSchedule: (params: SearchSessionsRequest) => void;
  exportScheduleToPdf: (params: SearchSessionsRequest) => void;
  deleteSchedule: (id: string) => void;
  activate: (id: string) => void;
  setActive: (id: string) => void; // THIS IS ONLY FOR FRONTEND NOT ACTUALLY SETTING THE ACTIVE SCHEDULE IN DB
  fetchCurrentSchedule: () => void;
  fetchActiveScheduleIdOnly: () => Promise<string | null>;
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
      addSchedule: async (name, timeLimit) => {
        set({ isLoading: true, error: "" });
        await toast.promise(repository.generateSchedule(name, timeLimit), {
          loading: "Generating schedule...",
          success: () => {
            get().fetchSchedules();
            set({ error: "" });
            return "Schedule Generated!";
          },
          error: (e) => {
            let userFriendlyMessage =
              "An unexpected error occurred while generating schedule.";
            if (e instanceof Error) {
              userFriendlyMessage = e.message;
            }
            set({ error: userFriendlyMessage, isLoading: false });
            return userFriendlyMessage;
          },
        });
        set({ isLoading: false });
      },
      deleteSchedule: async (id) => {
        set({ isLoading: true });
        await toast.promise(repository.deleteSchedule(id), {
          loading: "Deleting schedule...",
          success: () => {
            get().fetchSchedules();
            get().fetchCurrentSchedule();
            return "Schedule Deleted!";
          },
          error: (e) => {
            let userFriendlyMessage =
              "An unexpected error occurred while deleting schedule.";
            if (e instanceof Error) {
              userFriendlyMessage = e.message;
            }
            return userFriendlyMessage;
          },
        });
        set({ isLoading: false });
      },
      // THIS IS FOR BACKEND ACTIVATE
      activate: async (id) => {
        set({ isLoading: true });
        await toast.promise(repository.activateSchedule(id), {
          loading: "Activating schedule...",
          success: () => {
            set({
              activeSchedule: {
                ...get().schedules.find((x) => x.scheduleId == id)!,
                isActive: true,
              },
            });
            get().fetchSchedules();
            return "Schedule Activated!";
          },
          error: (e) => {
            let userFriendlyMessage =
              "An unexpected error occurred while activating schedule.";
            if (e instanceof Error) {
              userFriendlyMessage = e.message;
            }
            return userFriendlyMessage;
          },
        });
        set({ isLoading: false });
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
          } else {
            set({ sessions: [] });
            set({ error: `Error: ${resp.message}` });
          }
        } catch (e) {
          set({ sessions: [] });
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      exportScheduleToPdf: async (params) => {
        set({ isLoading: true });
        try {
          const blob = await repository.exportScheduleToPdf(params);

          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `schedule-${params.scheduleId}-${
            new Date().toISOString().split("T")[0]
          }.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast.success("Schedule exported successfully!");
        } catch (e) {
          toast.error("Failed to export schedule. Please try again.");
          console.error("Export error:", e);
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
          } else {
            set({ activeSchedule: null });
            set({ error: `Error: ${resp.message}` });
          }
        } catch (e) {
          set({ activeSchedule: null });
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      fetchActiveScheduleIdOnly: async () => {
        try {
          const resp = await repository.getCurrentSchedule();
          if (resp.success && resp.data) {
            return resp.data.scheduleId;
          }
          return null;
        } catch (e) {
          console.error("Error fetching active schedule ID:", e);
          return null;
        }
      },
    }),
    {
      name: "schedule",
    }
  )
);
