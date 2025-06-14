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

  // boolean to check if there are unsaved changes
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;

  timeslots: TimeSlot[];
  fetchTimeslots: () => void;

  // current state: what the user is seeing / has changed
  timePreferences: TimePreference[];
  roomPreferences: RoomPreference[];
  scheduleDistributionPreferences: ScheduleDistributionType;

  // setters: what the user is seeing / has changed
  setTimePreferences: (timePreferences: TimePreference[]) => void;
  setRoomPreferences: (roomPreferences: RoomPreference[]) => void;
  setScheduleDistributionPreferences: (
    scheduleDistributionPreferences: ScheduleDistributionType
  ) => void;

  // to get the preferences from the backend
  fetchTeacherPreferences: () => void;

  // save preferences to the backend
  saveTeacherPreferences: () => void;

  // reset all preferences to defaults
  resetToDefaults: () => void;

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
              // Transform backend unified TimeslotConstraintValue to frontend TimePreference[]
              if (value.preferences && typeof value.preferences === 'object') {
                const preferences = value.preferences as {
                  PREFER?: { days: string[]; timeslotCodes: string[][] };
                  AVOID?: { days: string[]; timeslotCodes: string[][] };
                  NEUTRAL?: { days: string[]; timeslotCodes: string[][] };
                };

                // Process each preference type
                ['PREFER', 'AVOID', 'NEUTRAL'].forEach((prefType) => {
                  const pref = preferences[prefType as keyof typeof preferences];
                  if (pref && pref.days && pref.timeslotCodes) {
                    pref.days.forEach((day, dayIndex) => {
                      const timeslots = pref.timeslotCodes[dayIndex] || [];
                      timeslots.forEach((timeslotCode) => {
                        // Convert backend day format (MONDAY) to frontend format (Monday)
                        const formattedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
                        
                        // Find the corresponding timeslot by code to get the timeslotId
                        const currentTimeslots = get().timeslots;
                        const matchingTimeslot = currentTimeslots.find(ts => ts.code === timeslotCode);
                        const timeslotId = matchingTimeslot ? matchingTimeslot.timeslotId : timeslotCode;
                        
                        timePrefs.push({
                          day: formattedDay,
                          timeslotId: timeslotId,
                          preference: prefType.toLowerCase() as "prefer" | "avoid" | "neutral",
                        });
                      });
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

  saveTeacherPreferences: async () => {
    set({ isLoading: true });
    
    try {
      const state = get();
      const promises: Promise<any>[] = [];

      // Prepare unified time preferences constraint
      const timePreferencesData = {
        PREFER: {
          days: [] as string[],
          timeslotCodes: [] as string[][],
        },
        AVOID: {
          days: [] as string[],
          timeslotCodes: [] as string[][],
        },
        NEUTRAL: {
          days: [] as string[],
          timeslotCodes: [] as string[][],
        },
      };

      // Group time preferences by day and preference type
      const preferencesByDayAndType = state.timePreferences.reduce((acc, pref) => {
        const key = `${pref.day}-${pref.preference}`;
        if (!acc[key]) {
          acc[key] = {
            day: pref.day,
            preference: pref.preference,
            timeslots: [],
          };
        }
        
        // Convert timeslotId to timeslot code if needed
        const timeslot = state.timeslots.find(ts => ts.timeslotId === pref.timeslotId);
        const timeslotCode = timeslot ? timeslot.code : pref.timeslotId;
        acc[key].timeslots.push(timeslotCode);
        
        return acc;
      }, {} as Record<string, { day: string; preference: string; timeslots: string[] }>);

      // Build the unified constraint format
      Object.values(preferencesByDayAndType).forEach(({ day, preference, timeslots }) => {
        const prefType = preference.toUpperCase() as 'PREFER' | 'AVOID' | 'NEUTRAL';
        const backendDay = day.toUpperCase();
        
        if (timePreferencesData[prefType]) {
          timePreferencesData[prefType].days.push(backendDay);
          timePreferencesData[prefType].timeslotCodes.push(timeslots);
        }
      });

      // Always send time constraint to ensure proper clearing of backend constraints
      // Remove empty preference types to keep the payload clean
      const cleanTimePreferences: any = {};
      if (timePreferencesData.PREFER.days.length > 0) {
        cleanTimePreferences.PREFER = timePreferencesData.PREFER;
      }
      if (timePreferencesData.AVOID.days.length > 0) {
        cleanTimePreferences.AVOID = timePreferencesData.AVOID;
      }
      if (timePreferencesData.NEUTRAL.days.length > 0) {
        cleanTimePreferences.NEUTRAL = timePreferencesData.NEUTRAL;
      }

      // Always send the constraint, even if empty, to clear backend constraints
      promises.push(
        repository.createConstraint({
          constraintTypeKey: 'TEACHER_TIME_PREFERENCE',
          value: {
            preferences: cleanTimePreferences,
          },
          priority: 5,
        })
      );

      // Group room preferences by preference type
      const roomPreferencesByType = state.roomPreferences.reduce((acc, pref) => {
        if (!acc[pref.preference]) {
          acc[pref.preference] = new Set();
        }
        acc[pref.preference].add(pref.classroomId);
        return acc;
      }, {} as Record<string, Set<string>>);

      // Create room preference constraints - always send to ensure clearing
      // Send both PREFER and AVOID constraints, even if empty
      ['prefer', 'avoid'].forEach((preference) => {
        const roomIds = roomPreferencesByType[preference] || new Set();
        promises.push(
          repository.createConstraint({
            constraintTypeKey: 'TEACHER_ROOM_PREFERENCE',
            value: {
              roomIds: Array.from(roomIds),
              preference: preference.toUpperCase(),
            },
            priority: 5,
          })
        );
      });

      // Create schedule compactness constraint - always send to ensure clearing
      const { scheduleDistributionPreferences } = state;
      promises.push(
        repository.createConstraint({
          constraintTypeKey: 'TEACHER_SCHEDULE_COMPACTNESS',
          value: {
            enabled: scheduleDistributionPreferences.preferCompactSchedule,
            maxGapsPerDay: scheduleDistributionPreferences.preferCompactSchedule ? 0 : 5,
            maxActiveDays: scheduleDistributionPreferences.maxDaysPerWeek,
            maxConsecutiveSessions: scheduleDistributionPreferences.maxConsecutiveSessions,
          },
          priority: 5,
        })
      );

      // Create workload distribution constraint
      promises.push(
        repository.createConstraint({
          constraintTypeKey: 'TEACHER_WORKLOAD_DISTRIBUTION',
          value: {
            preferredMaxSessionsPerDay: scheduleDistributionPreferences.maxConsecutiveSessions,
            avoidBackToBackSessions: false,
          },
          priority: 5,
        })
      );

      // Execute all constraint creation requests
      await Promise.all(promises);
      
      // Mark as no unsaved changes
      set({ hasUnsavedChanges: false });
      
      // Refresh preferences from backend to ensure consistency
      await get().fetchTeacherPreferences();
      
    } catch (error) {
      set({ error: `Error saving preferences: ${error}` });
    } finally {
      set({ isLoading: false });
    }
  },

  // reset all preferences to defaults
  resetToDefaults: () => {
    set({
      timePreferences: [],
      roomPreferences: [],
      scheduleDistributionPreferences: {
        maxDaysPerWeek: 5, // Default values
        maxConsecutiveSessions: 3,
        preferCompactSchedule: false,
      },
      hasUnsavedChanges: true, // Mark as unsaved so user can save the reset
    });
  }
}));
