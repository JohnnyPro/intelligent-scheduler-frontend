import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";

import {
  Classroom,
  ClassroomCreating,
  ClassroomUpdating,
} from "../types/classroom.types";
import { PaginationData } from "../types";

interface StoreState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  error: string;
  setError: (error: string) => void;

  classrooms: Classroom[];
  pagination: PaginationData | null;
  activeClassroom: Classroom | null;
  fetchClassrooms: (page?: number, size?: number) => void;
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
      pagination: null,
      activeClassroom: null,
      fetchClassrooms: async (page = 1, size = 10) => {
        set({ isLoading: true });
        try {
          const classrooms = await repository.getRooms(page, size);
          if (classrooms.success && classrooms.data) {
            set({ classrooms: classrooms.data });
            set({ pagination: classrooms.pagination || null });
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
