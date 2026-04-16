import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/utils/mmkv-storage';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  type: 'contractor' | 'provider';
}

interface AuthStore {
  user: UserProfile | null;
  isSignedIn: boolean;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isSignedIn: false,
      setUser: (user) => set({ user, isSignedIn: !!user }),
      logout: () => set({ user: null, isSignedIn: false }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
