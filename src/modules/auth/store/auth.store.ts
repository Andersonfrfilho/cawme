import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "@/shared/providers/cache";
import type { AuthStore } from "@/modules/auth/types/auth.store.types";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isSignedIn: false,
      verificationStatus: { emailVerified: false, phoneVerified: false },
      setUser: (user) => set({ user, isSignedIn: !!user }),
      setVerificationStatus: (status) =>
        set((state) => ({
          verificationStatus: { ...state.verificationStatus, ...status },
        })),
      logout: () =>
        set({ user: null, isSignedIn: false, verificationStatus: { emailVerified: false, phoneVerified: false } }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => mmkvStorage.asStateStorage()),
    },
  ),
);
