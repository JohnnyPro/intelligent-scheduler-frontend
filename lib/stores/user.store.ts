import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as repository from "../repositories/repository";

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
        try {
          const resp = await repository.addUser(user);
          if (resp.success) get().fetchUsers();
          else set({ error: `Error${resp.statusCode}: ${resp.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      updateUser: async (id, user) => {
        set({ isLoading: true });
        try {
          const resp = await repository.updateUser(id, user);
          if (resp.success) get().fetchUsers();
          else set({ error: `Error${resp.statusCode}: ${resp.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      deleteUser: async (id) => {
        set({ isLoading: true });
        try {
          const resp = await repository.deleteUser(id);
          if (resp.success) get().fetchUsers();
          else set({ error: `Error${resp.statusCode}: ${resp.message}` });
        } catch (e) {
          set({ error: `Error: ${e}` });
        } finally {
          set({ isLoading: false });
        }
      },
      setActive: (id) =>
        set({ activeUser: get().users.find((x) => x.userId == id) || null }),
    }),
    {
      name: "user-store",
    }
  )
);
