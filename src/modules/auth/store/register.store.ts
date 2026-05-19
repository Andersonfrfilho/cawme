import { create } from "zustand";

export type StoredAddress = {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude?: string;
  longitude?: string;
};

interface RegisterStore {
  tempCredentials: { email: string; password: string } | null;
  address: StoredAddress | null;
  keycloakId: string | null;
  setTempCredentials: (credentials: { email: string; password: string }) => void;
  clearTempCredentials: () => void;
  setAddress: (address: StoredAddress) => void;
  clearAddress: () => void;
  setKeycloakId: (keycloakId: string) => void;
  clearKeycloakId: () => void;
}

export const useRegisterStore = create<RegisterStore>((set) => ({
  tempCredentials: null,
  address: null,
  keycloakId: null,
  setTempCredentials: (tempCredentials) => set({ tempCredentials }),
  clearTempCredentials: () => set({ tempCredentials: null }),
  setAddress: (address) => set({ address }),
  clearAddress: () => set({ address: null }),
  setKeycloakId: (keycloakId) => set({ keycloakId }),
  clearKeycloakId: () => set({ keycloakId: null }),
}));
