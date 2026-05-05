import { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';
import type { CacheProvider } from '../cache.types';

type StorageLike = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete?: (key: string) => void;
  remove?: (key: string) => void;
  clearAll: () => void;
};

function createMemoryFallbackStorage(): StorageLike {
  const memory = new Map<string, string>();

  return {
    getString: (key: string) => memory.get(key),
    set: (key: string, value: string) => {
      memory.set(key, value);
    },
    delete: (key: string) => {
      memory.delete(key);
    },
    clearAll: () => {
      memory.clear();
    },
  };
}

class MmkvStorage implements CacheProvider {
  private static instance: MmkvStorage;
  private readonly storage: StorageLike;

  private constructor() {
    try {
      this.storage = new MMKV();
    } catch {
      this.storage = createMemoryFallbackStorage();
    }
  }

  static getInstance(): MmkvStorage {
    if (!MmkvStorage.instance) {
      MmkvStorage.instance = new MmkvStorage();
    }
    return MmkvStorage.instance;
  }

  get(key: string): string | null {
    return this.storage.getString(key) ?? null;
  }

  set(key: string, value: string): void {
    this.storage.set(key, value);
  }

  remove(key: string): void {
    if (typeof this.storage.delete === 'function') this.storage.delete(key);
    else if (typeof this.storage.remove === 'function') this.storage.remove(key);
  }

  clear(): void {
    this.storage.clearAll();
  }

  // Adapter para Zustand persist middleware
  asStateStorage(): StateStorage {
    return {
      getItem: (name) => this.get(name),
      setItem: (name, value) => this.set(name, value),
      removeItem: (name) => this.remove(name),
    };
  }
}

export const mmkvStorage = MmkvStorage.getInstance();
