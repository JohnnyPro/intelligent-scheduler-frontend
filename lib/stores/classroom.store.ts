import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";

import {
  Classroom,
  ClassroomCreating,
  ClassroomUpdating,
} from "../types/classroom.types";

interface StoreState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  error: string;
  setError: (error: string) => void;

  classrooms: Classroom[];
  activeClassroom: Classroom | null;
  fetchClassrooms: () => void;
  addClassroom: (classroom: ClassroomCreating) => void;
  updateClassroom: (id: string, classroom: ClassroomUpdating) => void;
  deleteClassroom: (id: string) => void;
  setActive: (id: string) => void;
}

export const useClassroomStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      startLoading: () => set({ isLoading: true }),
      stopLoading: () => set({ isLoading: false }),

      error: "",
      setError: (error) => set({ error }),

      classrooms: [],
      activeClassroom: null,
      fetchClassrooms: async () => {
        set({ isLoading: true });
        try {
          const classrooms = await repository.getRooms();
          if (classrooms.success && classrooms.data) {
            set({ classrooms: classrooms.data });
          } else set({ error: `Error: ${classrooms.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      addClassroom: async (classroom) => {
        set({ isLoading: true });
        try {
          const resp = await repository.addRoom(classroom);
          if (resp.success) get().fetchClassrooms();
          else set({ error: `Error${resp.statusCode}: ${resp.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      updateClassroom: async (id, classroom) => {
        set({ isLoading: true });
        try {
          const resp = await repository.updateRoom(id, classroom);
          if (resp.success) get().fetchClassrooms();
          else set({ error: `Error${resp.statusCode}: ${resp.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      deleteClassroom: async (id) => {
        set({ isLoading: true });
        try {
          const resp = await repository.deleteRoom(id);
          if (resp.success) get().fetchClassrooms();
          else set({ error: `Error${resp.statusCode}: ${resp.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      setActive: (id) =>
        set({
          activeClassroom:
            get().classrooms.find((x) => x.classroomId == id) || null,
        }),
    }),
    {
      name: "classroom",
    }
  )
);
