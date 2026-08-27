"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SESSION_STORAGE_KEY } from "@/lib/constants";
import type { ActiveRole, AuthSession, SessionUser } from "@/types/auth";

interface AuthState {
  session: AuthSession | null;
  isHydrated: boolean;
  setSession: (session: AuthSession | null) => void;
  setRole: (role: ActiveRole) => void;
  setUser: (user: SessionUser) => void;
  setHydrated: (value: boolean) => void;
  logout: () => void;
  user: () => SessionUser | null;
  role: () => ActiveRole | null;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      isHydrated: false,
      setSession: (session) => set({ session }),
      setRole: (role) => {
        const current = get().session;
        if (!current) return;
        set({
          session: {
            ...current,
            user: { ...current.user, role },
          },
        });
      },
      setUser: (user) => {
        const current = get().session;
        if (!current) return;
        set({ session: { ...current, user } });
      },
      setHydrated: (value) => set({ isHydrated: value }),
      logout: () => set({ session: null }),
      user: () => get().session?.user ?? null,
      role: () => get().session?.user.role ?? null,
      isAuthenticated: () => Boolean(get().session?.token),
    }),
    {
      name: SESSION_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
