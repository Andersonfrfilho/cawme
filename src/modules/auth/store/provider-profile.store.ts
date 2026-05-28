import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/shared/providers/cache';

export interface SelectedCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProviderServiceWithCategory {
  id: string;
  serviceId: string;
  categoryId: string;
  categoryName: string;
  serviceName: string;
  estimatedDurationMinutes: number;
  pricePerHour: number;
  priceBase?: number;
  priceType?: string;
  isActive: boolean;
}

export interface ProviderAvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface ProviderProfileStore {
  selectedCategories: SelectedCategory[];
  services: ProviderServiceWithCategory[];
  availability: ProviderAvailabilitySlot[];
  isSubmitting: boolean;

  addCategory: (category: SelectedCategory) => void;
  removeCategory: (categoryId: string) => void;
  clearCategories: () => void;

  addService: (service: ProviderServiceWithCategory) => void;
  updateService: (serviceId: string, service: Partial<ProviderServiceWithCategory>) => void;
  removeService: (serviceId: string) => void;
  clearServices: () => void;

  addAvailabilitySlot: (slot: ProviderAvailabilitySlot) => void;
  removeAvailabilitySlot: (slotId: string) => void;
  clearAvailability: () => void;

  setIsSubmitting: (isSubmitting: boolean) => void;
  reset: () => void;
}

export const useProviderProfileStore = create<ProviderProfileStore>()(
  persist(
    (set) => ({
      selectedCategories: [],
      services: [],
      availability: [],
      isSubmitting: false,

      addCategory: (category) =>
        set((state) => ({
          selectedCategories: [...state.selectedCategories, category],
        })),

      removeCategory: (categoryId) =>
        set((state) => ({
          selectedCategories: state.selectedCategories.filter((cat) => cat.id !== categoryId),
          services: state.services.filter((svc) => svc.categoryId !== categoryId),
        })),

      clearCategories: () =>
        set({
          selectedCategories: [],
          services: [],
        }),

      addService: (service) =>
        set((state) => ({
          services: [...state.services, service],
        })),

      updateService: (serviceId, updates) =>
        set((state) => ({
          services: state.services.map((svc) =>
            svc.id === serviceId ? { ...svc, ...updates } : svc,
          ),
        })),

      removeService: (serviceId) =>
        set((state) => ({
          services: state.services.filter((svc) => svc.id !== serviceId),
        })),

      clearServices: () =>
        set({
          services: [],
        }),

      addAvailabilitySlot: (slot) =>
        set((state) => {
          const existing = state.availability.findIndex((s) => s.dayOfWeek === slot.dayOfWeek);
          if (existing >= 0) {
            const updated = [...state.availability];
            updated[existing] = slot;
            return { availability: updated };
          }
          return { availability: [...state.availability, slot] };
        }),

      removeAvailabilitySlot: (slotId) =>
        set((state) => ({
          availability: state.availability.filter((slot) => slot.id !== slotId),
        })),

      clearAvailability: () =>
        set({
          availability: [],
        }),

      setIsSubmitting: (isSubmitting) =>
        set({
          isSubmitting,
        }),

      reset: () =>
        set({
          selectedCategories: [],
          services: [],
          availability: [],
          isSubmitting: false,
        }),
    }),
    {
      name: 'provider-profile-store',
      storage: createJSONStorage(() => mmkvStorage.asStateStorage()),
    },
  ),
);
