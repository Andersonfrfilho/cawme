import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "@/shared/providers/cache";
import type { AuthStore } from "@/modules/auth/types/auth.store.types";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isSignedIn: false,
      setUser: (user) => set({ user, isSignedIn: !!user }),
      logout: () => set({ user: null, isSignedIn: false }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => mmkvStorage.asStateStorage()),
    },
  ),
);
