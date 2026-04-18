import { create } from 'zustand';
import type { ErrorVariant } from '@/shared/components/error-screen';

export type ErrorState = {
  variant: ErrorVariant;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  onOther?: () => void;
  otherLabel?: string;
};

type ErrorStore = {
  error: ErrorState | null;
  setError: (state: ErrorState) => void;
  clearError: () => void;
};

export const useErrorStore = create<ErrorStore>((set) => ({
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
