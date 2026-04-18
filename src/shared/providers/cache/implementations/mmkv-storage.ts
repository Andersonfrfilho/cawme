import { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';
import type { CacheProvider } from '../cache.types';

class MmkvStorage implements CacheProvider {
  private static instance: MmkvStorage;
  private readonly storage: MMKV;

  private constructor() {
    this.storage = new MMKV();
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
    this.storage.delete(key);
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
