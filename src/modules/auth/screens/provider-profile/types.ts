import type { CategoryDto, ProviderServiceDto, ProviderAvailabilityDto } from '@/modules/auth/services/types';

export interface ProviderProfileSetupScreenParams {
  // Navigation params (none for this flow entry point)
}

export interface CreateServiceFormValues {
  serviceName: string;
  estimatedDurationMinutes: number;
  pricePerHour: number;
}

export interface AvailabilitySlotFormValues {
  startTime: string;
  endTime: string;
}

export const DAY_LABELS: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
};
