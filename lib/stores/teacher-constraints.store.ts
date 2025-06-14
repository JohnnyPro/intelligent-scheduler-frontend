import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";
import { TimeSlot } from "../types";
import {
  Constraint,
  RoomPreference,
  ScheduleDistributionType,
  TimePreference,
} from "../types/constraints.types";

interface StoreState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  error: string;
  setError: (error: string) => void;

  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;

  timeslots: TimeSlot[];
  fetchTimeslots: () => void;

  timePreferences: TimePreference[];
  roomPreferences: RoomPreference[];
  scheduleDistributionPreferences: ScheduleDistributionType;

  setTimePreferences: (timePreferences: TimePreference[]) => void;
  setRoomPreferences: (roomPreferences: RoomPreference[]) => void;
  setScheduleDistributionPreferences: (
    scheduleDistributionPreferences: ScheduleDistributionType
  ) => void;

  fetchTeacherPreferences: () => void;

  // constraintIds: {
  //   timePrefer?: string,
  //   timeAvoid?: string,
  //   roomPrefer?: string,
  //   roomAvoid?: string,
  //   scheduleCompactness?: string,
  //   workloadDistribution?: string,
  // }

  // resetPreferences: () => void;
}

export const useTeacherConstraintsStore = create<StoreState>()((set, get) => ({
  isLoading: false,
  startLoading: () => set({ isLoading: true }),
  stopLoading: () => set({ isLoading: false }),
  error: "",
  setError: (error: string) => set({ error }),

  timeslots: [],
  fetchTimeslots: async () => {
    set({ isLoading: true });
    try {
      const timeslots = await repository.getTimeslots();
      set({ timeslots: timeslots.data ?? [] });
    } catch (error) {
      set({ error: `Error: ${error}` });
    } finally {
      set({ isLoading: false });
    }
  },

  timePreferences: [],
  roomPreferences: [],
  scheduleDistributionPreferences: {
    maxDaysPerWeek: 0,
    maxConsecutiveSessions: 0,
    preferCompactSchedule: false,
  },

  fetchTeacherPreferences: async () => {
    set({ isLoading: true });
    try {
      const teacherPreferences = await repository.getTeacherPreferences();
      if (teacherPreferences.success && teacherPreferences.data) {
        const timePrefs: TimePreference[] = [];
        const roomPrefs: RoomPreference[] = [];
        const scheduleDistribution: ScheduleDistributionType = {
          maxDaysPerWeek: 5,
          maxConsecutiveSessions: 3,
          preferCompactSchedule: false,
        };

        teacherPreferences.data.forEach((constraint: Constraint) => {
          const constraintType = constraint.constraintType.name;
          const value = constraint.value as Record<string, unknown>;

          switch (constraintType) {
            case "Teacher Time Preference":
              // Transform backend TimeslotConstraintValue to frontend TimePreference[]
              if (value.days && Array.isArray(value.days) && 
                  value.timeslotCodes && Array.isArray(value.timeslotCodes) && 
                  value.preference && typeof value.preference === 'string') {
                const currentTimeslots = get().timeslots;
                value.days.forEach((day) => {
                  if (typeof day === 'string') {
                    (value.timeslotCodes as unknown[]).forEach((timeslotCode) => {
                      if (typeof timeslotCode === 'string') {
                        // Convert backend day format (MONDAY) to frontend format (Monday)
                        const formattedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
                        
                        // Find the corresponding timeslot by code to get the timeslotId
                        const matchingTimeslot = currentTimeslots.find(ts => ts.code === timeslotCode);
                        const timeslotId = matchingTimeslot ? matchingTimeslot.timeslotId : timeslotCode;
                        
                        timePrefs.push({
                          day: formattedDay,
                          timeslotId: timeslotId,
                          preference: (value.preference as string).toLowerCase() as "prefer" | "avoid" | "neutral",
                        });
                      }
                    });
                  }
                });
              }
              break;

            case "Teacher Room Preference":
              // Transform backend RoomConstraintValue to frontend RoomPreference[]
              if (value.roomIds && Array.isArray(value.roomIds) && 
                  value.preference && typeof value.preference === 'string') {
                value.roomIds.forEach((roomId) => {
                  if (typeof roomId === 'string') {
                    roomPrefs.push({
                      classroomId: roomId,
                      preference: (value.preference as string).toLowerCase() as "prefer" | "avoid",
                    });
                  }
                });
              }
              break;

            case "Teacher Schedule Compactness":
              // Transform backend TeacherCompactnessConstraintValue to frontend ScheduleDistributionType
              if (typeof value.maxActiveDays === 'number') {
                scheduleDistribution.maxDaysPerWeek = value.maxActiveDays;
              }
              if (typeof value.maxConsecutiveSessions === 'number') {
                scheduleDistribution.maxConsecutiveSessions = value.maxConsecutiveSessions;
              }
              if (typeof value.enabled === 'boolean') {
                scheduleDistribution.preferCompactSchedule = value.enabled;
              }
              break;

            case "Teacher Workload Distribution":
              // Additional workload distribution preferences could be added here
              // For now, we use it to set maxConsecutiveSessions if available
              if (typeof value.preferredMaxSessionsPerDay === 'number') {
                scheduleDistribution.maxConsecutiveSessions = value.preferredMaxSessionsPerDay;
              }
              break;

            default:
              console.log(`Unknown constraint type: ${constraintType}`);
          }
        });

        set({ 
          timePreferences: timePrefs,
          roomPreferences: roomPrefs,
          scheduleDistributionPreferences: scheduleDistribution,
        });
      } else {
        set({ error: `Error: ${teacherPreferences.message}` });
      }
    } catch (error) {
      set({ error: `Error: ${error}` });
    } finally {
      set({ isLoading: false });
    }
  },
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (hasUnsavedChanges: boolean) =>
    set({ hasUnsavedChanges: hasUnsavedChanges }),

  setTimePreferences: (timePreferences: TimePreference[]) => {
    set({ timePreferences: timePreferences });
    set({ hasUnsavedChanges: true });
  },
  setRoomPreferences: (roomPreference: RoomPreference[]) => {
    set({ roomPreferences: roomPreference });
    set({ hasUnsavedChanges: true });
  },
  setScheduleDistributionPreferences: (
    scheduleDistributionPreferences: ScheduleDistributionType
  ) => {
    set({ scheduleDistributionPreferences: scheduleDistributionPreferences });
    set({ hasUnsavedChanges: true });
  },
}));
