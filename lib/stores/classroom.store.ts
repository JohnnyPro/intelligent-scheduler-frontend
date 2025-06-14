import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";
import toast from "react-hot-toast";

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
        await toast.promise(repository.addRoom(classroom), {
          loading: "Adding...",
          success: () => {
            get().fetchClassrooms();
            return "Classroom Added!";
          },
          error: (e) => {
            let userFriendlyMessage = "An unexpected error occurred while adding classroom.";
            if (e instanceof Error) {
              userFriendlyMessage = e.message;
            }
            return userFriendlyMessage;
          },
        });
        set({ isLoading: false });
      },
      updateClassroom: async (id, classroom) => {
        set({ isLoading: true });
        await toast.promise(repository.updateRoom(id, classroom), {
          loading: "Updating...",
          success: () => {
            get().fetchClassrooms();
            return "Classroom Updated!";
          },
          error: (e) => {
            let userFriendlyMessage = "An unexpected error occurred while updating classroom.";
            if (e instanceof Error) {
              userFriendlyMessage = e.message;
            }
            return userFriendlyMessage;
          },
        });
        set({ isLoading: false });
      },
      deleteClassroom: async (id) => {
        set({ isLoading: true });
        await toast.promise(repository.deleteRoom(id), {
          loading: "Deleting...",
          success: () => {
            get().fetchClassrooms();
            return "Classroom Deleted!";
          },
          error: (e) => {
            let userFriendlyMessage = "An unexpected error occurred while deleting classroom.";
            if (e instanceof Error) {
              userFriendlyMessage = e.message;
            }
            return userFriendlyMessage;
          },
        });
        set({ isLoading: false });
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
