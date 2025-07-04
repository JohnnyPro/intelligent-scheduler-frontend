import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";
import toast from "react-hot-toast";

import { Course, CourseCreating, CourseUpdating } from "../types/course.types";
import { CsvCategory, PaginationData } from "../types";
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
  pendingTasks: string[];
  tasks: AllTasksResponse[];
  pagination: PaginationData | null;
  selectedTask: TaskResponse | null;
  uploadCsv: (
    file: File,
    category: CsvCategory,
    description?: string
  ) => Promise<void>;
  fetchAllTasks: (page?: number, size?: number) => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  downloadTemplate: (category: CsvCategory) => Promise<Blob>;
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
      pendingTasks: [],
      tasks: [],
      selectedTask: null,
      pagination: null,
      fetchAllTasks: async (page = 1, size = 10) => {
        set({ isLoading: true, error: "" });
        try {
          const allTasks = await repository.getAllTasks(page, size);
          if (allTasks.success && allTasks.data) {
            set({ tasks: allTasks.data });
            set({ pagination: allTasks.pagination || null });
            const tsk = get().tasks.find((elem) =>
              get().pendingTasks.includes(elem.taskId)
            );
            if (tsk) {
              // Remove from pendingTasks
              const newPending = get().pendingTasks.filter(
                (id) => id !== tsk.taskId
              );
              set({ pendingTasks: newPending });
              // Show improved notification
              let message = `"${tsk.fileName}"${
                tsk.description ? ` - ${tsk.description}` : ""
              }\nValidation complete and ready for review.`;
              message += `\n\nTask ID: ${tsk.taskId}`;
              toast.success(message, {
                style: {
                  fontWeight: "bold",
                  color: "#111",
                  fontSize: "1rem",
                  lineHeight: 1.4,
                  whiteSpace: "pre-line",
                },
                icon: "✅",
                duration: 8000,
              });
            }
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
            // console.log("data ", uploadedTask.data);

            set({ pendingTasks: [...get().pendingTasks, uploadedTask.data] });

            await get().fetchAllTasks();
          } else {
            set({
              error:
                uploadedTask.message ||
                "Failamqps://rhxnlnca:vIqEdEsANI-dvaIukgRdiwO2cIcy-Quf@duck.lmq.cloudamqp.com/rhxnlncaed to upload CSV",
            });
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
            toast.success("Task deleted successfully!");
          } else {
            set({ error: deletedTask.message || "Failed to delete task" });
            toast.error(deletedTask.message || "Failed to delete task");
          }
        } catch (e) {
          const errMsg =
            e instanceof Error
              ? e.message
              : "An error occurred while deleting task";
          set({ error: errMsg });
          toast.error(errMsg);
        } finally {
          set({ isLoading: false });
        }
      },

      downloadTemplate: async (category: CsvCategory) => {
        set({ isLoading: true, error: "" });
        try {
          const response = await repository.downloadTemplate(category);
          return response;
        } catch (e) {
          set({
            error:
              e instanceof Error
                ? e.message
                : "An error occurred while downloading template",
          });
          throw e;
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
