import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";

import { Course, CourseCreating, CourseUpdating } from "../types/course.types";
import { CsvCategory } from "../types";
import {
  AllTasksResponse,
  CsvUpload,
  TaskResponse,
} from "../types/csv-validation.types";

interface StoreState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  error: string;
  setError: (error: string) => void;

  tasks: AllTasksResponse[];
  selectedTask: TaskResponse | null;
  uploadCsv: (
    file: File,
    category: CsvCategory,
    description?: string
  ) => Promise<void>;
  fetchAllTasks: () => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCsvStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      startLoading: () => set({ isLoading: true }),
      stopLoading: () => set({ isLoading: false }),

      error: "",
      setError: (error) => set({ error }),
      clearError: () => set({ error: "" }),

      tasks: [],
      selectedTask: null,

      fetchAllTasks: async () => {
        set({ isLoading: true, error: "" });
        try {
          const allTasks = await repository.getAllTasks();
          if (allTasks.success && allTasks.data) {
            console.log("Raw tasks from backend:", allTasks.data);
            set({ tasks: allTasks.data });
          } else {
            set({ error: allTasks.message || "Failed to fetch tasks" });
          }
        } catch (e) {
          set({
            error:
              e instanceof Error
                ? e.message
                : "An error occurred while fetching tasks",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchTask: async (id: string) => {
        set({ isLoading: true, error: "" });
        try {
          const task = await repository.getTask(id);
          if (task.success && task.data) {
            set({ selectedTask: task.data });
          } else {
            set({ error: task.message || "Failed to fetch task details" });
          }
        } catch (e) {
          set({
            error:
              e instanceof Error
                ? e.message
                : "An error occurred while fetching task details",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      uploadCsv: async (
        csvFile: File,
        category: CsvCategory,
        description?: string
      ) => {
        set({ isLoading: true, error: "" });
        try {
          const uploadPayload: CsvUpload = {
            file: csvFile,
            category: category,
            description: description,
          };
          const uploadedTask = await repository.uploadCsv(uploadPayload);
          if (uploadedTask.success && uploadedTask.data) {
            // Refresh the tasks list after successful upload
            await get().fetchAllTasks();
          } else {
            set({ error: uploadedTask.message || "Failed to upload CSV" });
          }
        } catch (e) {
          set({
            error:
              e instanceof Error
                ? e.message
                : "An error occurred while uploading CSV",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteTask: async (id: string) => {
        set({ isLoading: true, error: "" });
        try {
          const deletedTask = await repository.deleteTask(id);
          if (deletedTask.success) {
            // Update tasks list after successful deletion
            set({
              tasks: get().tasks.filter((task) => task.taskId !== id),
              selectedTask:
                get().selectedTask?.taskId === id ? null : get().selectedTask,
            });
          } else {
            set({ error: deletedTask.message || "Failed to delete task" });
          }
        } catch (e) {
          set({
            error:
              e instanceof Error
                ? e.message
                : "An error occurred while deleting task",
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "csv-validation-store",
    }
  )
);
