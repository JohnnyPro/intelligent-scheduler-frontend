import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";
import toast from "react-hot-toast";

import { User, UserCreating, UserUpdating } from "../types/users.types";
import { PaginationData } from "../types";

interface StoreState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  error: string;
  setError: (error: string) => void;

  users: User[];
  pagination: PaginationData | null;
  activeUser: User | null;
  fetchUsers: (page?: number, size?: number) => void;
  addUser: (user: UserCreating) => void;
  updateUser: (id: string, user: UserUpdating) => void;
  deleteUser: (id: string) => void;
  setActive: (id: string) => void;
}

export const useUserStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      pagination: null,
      startLoading: () => set({ isLoading: true }),
      stopLoading: () => set({ isLoading: false }),
      error: "",
      setError: (error) => set({ error }),

      users: [],
      activeUser: null,
      fetchUsers: async (page = 1, size = 10) => {
        set({ isLoading: true });
        try {
          const users = await repository.getUsers(page, size);
          if (users.success && users.data) {
            set({ users: users.data });
            set({ pagination: users.pagination });
          } else set({ error: `Error: ${users.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      addUser: async (user) => {
        set({ isLoading: true });
        await toast.promise(repository.addUser(user), {
          loading: "Adding...",
          success: () => {
            get().fetchUsers();
            return "User Added!";
          },
          error: (e) => {
            let userFriendlyMessage = "An unexpected error occurred while adding user.";
            if (e instanceof Error) {
              userFriendlyMessage = e.message;
            }
            set({ isLoading: false });
            return userFriendlyMessage;
          },
        });
        set({ isLoading: false });
      },
      updateUser: async (id, user) => {
        set({ isLoading: true });
        await toast.promise(repository.updateUser(id, user), {
          loading: "Updating...",
          success: () => {
            get().fetchUsers();
            return "User Updated!";
          },
          error: (e) => {
            let userFriendlyMessage = "An unexpected error occurred while updating user.";
            if (e instanceof Error) {
              userFriendlyMessage = e.message;
            }
            set({ isLoading: false });
            return userFriendlyMessage;
          },
        });
        set({ isLoading: false });
      },
      deleteUser: async (id) => {
        set({ isLoading: true });
        await toast.promise(repository.deleteUser(id), {
          loading: "Deleting...",
          success: () => {
            get().fetchUsers();
            return "User Deleted!";
          },
          error: (e) => {
            let userFriendlyMessage = "An unexpected error occurred while deleting user.";
            if (e instanceof Error) {
              userFriendlyMessage = e.message;
            }
            set({ isLoading: false });
            return userFriendlyMessage;
          },
        });
        set({ isLoading: false });
      },
      setActive: (id) =>
        set({ activeUser: get().users.find((x) => x.userId == id) || null }),
    }),
    {
      name: "user-store",
    }
  )
);
