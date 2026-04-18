import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/shared/providers/cache';
import { AppConfigResponse } from '@/modules/app-config/types/app-config.types';

interface AppConfigStore {
  config: AppConfigResponse | null;
  fetchedAt: number | null;
  setConfig: (config: AppConfigResponse) => void;
  isStale: () => boolean;
}

export const useAppConfigStore = create<AppConfigStore>()(
  persist(
    (set, get) => ({
      config: null,
      fetchedAt: null,
      setConfig: (config) => set({ config, fetchedAt: Date.now() }),
      isStale: () => {
        const { fetchedAt } = get();
        if (!fetchedAt) return true;
        return Date.now() - fetchedAt > 5 * 60 * 1000; // 5min = TTL do BFF
      },
    }),
    {
      name: 'app-config',
      storage: createJSONStorage(() => mmkvStorage.asStateStorage()),
    }
  )
);
