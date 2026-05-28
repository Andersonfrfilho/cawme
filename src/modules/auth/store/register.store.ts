import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "@/shared/providers/cache";

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

export type PendingRegistration = {
  keycloakId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  document: string;
  documentType: string;
  password: string;
  userType: "contractor" | "provider";
};

export type PendingOnboarding = {
  email: string;
  phone: string;
  userType: "contractor" | "provider";
  keycloakId?: string;
  password?: string;
};

interface RegisterStore {
  tempCredentials: { email: string; password: string } | null;
  address: StoredAddress | null;
  keycloakId: string | null;
  pendingRegistration: PendingRegistration | null;
  pendingOnboarding: PendingOnboarding | null;
  setTempCredentials: (credentials: { email: string; password: string }) => void;
  clearTempCredentials: () => void;
  setAddress: (address: StoredAddress) => void;
  clearAddress: () => void;
  setKeycloakId: (keycloakId: string) => void;
  clearKeycloakId: () => void;
  setPendingRegistration: (registration: PendingRegistration) => void;
  clearPendingRegistration: () => void;
  setPendingOnboarding: (data: PendingOnboarding) => void;
  clearPendingOnboarding: () => void;
}

export const useRegisterStore = create<RegisterStore>()(
  persist(
    (set) => ({
      tempCredentials: null,
      address: null,
      keycloakId: null,
      pendingRegistration: null,
      pendingOnboarding: null,
      setTempCredentials: (tempCredentials) => set({ tempCredentials }),
      clearTempCredentials: () => set({ tempCredentials: null }),
      setAddress: (address) => set({ address }),
      clearAddress: () => set({ address: null }),
      setKeycloakId: (keycloakId) => set({ keycloakId }),
      clearKeycloakId: () => set({ keycloakId: null }),
      setPendingRegistration: (pendingRegistration) => set({ pendingRegistration }),
      clearPendingRegistration: () => set({ pendingRegistration: null }),
      setPendingOnboarding: (pendingOnboarding) => set({ pendingOnboarding }),
      clearPendingOnboarding: () => set({ pendingOnboarding: null }),
    }),
    {
      name: "register-store",
      storage: createJSONStorage(() => mmkvStorage.asStateStorage()),
    },
  ),
);
