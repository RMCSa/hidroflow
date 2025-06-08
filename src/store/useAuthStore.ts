// src/store/useAuthStore.ts
import { create } from "zustand";
import { User } from "../types";
import { userService } from "../services/userService";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string) => {
    const user = await userService.login(email);
    if (user) {
      set({ isAuthenticated: true, user });
    } else {
      throw new Error("Usuário não encontrado.");
    }
  },
  register: async (name: string, email: string) => {
    const newUser = await userService.register(name, email);
    set({ isAuthenticated: true, user: newUser });
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));
