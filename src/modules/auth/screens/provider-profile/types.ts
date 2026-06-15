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

const CATEGORY_ICON_MAP: Record<string, string> = {
  cleaning: 'sparkles-outline',
  limpeza: 'sparkles-outline',
  plumbing: 'water-outline',
  encanamento: 'water-outline',
  hydraulic: 'water-outline',
  electrical: 'flash-outline',
  eletricidade: 'flash-outline',
  electric: 'flash-outline',
  gardening: 'leaf-outline',
  jardinagem: 'leaf-outline',
  painting: 'color-palette-outline',
  pintura: 'color-palette-outline',
  carpentry: 'hammer-outline',
  marcenaria: 'hammer-outline',
  masonry: 'construct-outline',
  alvenaria: 'construct-outline',
  locksmith: 'key-outline',
  serralheria: 'key-outline',
  'air-conditioning': 'thermometer-outline',
  'ar-condicionado': 'thermometer-outline',
  moving: 'cube-outline',
  mudanca: 'cube-outline',
  security: 'shield-checkmark-outline',
  seguranca: 'shield-checkmark-outline',
  technology: 'laptop-outline',
  tecnologia: 'laptop-outline',
  general: 'build-outline',
};

export function getCategoryIcon(slug: string): string {
  return CATEGORY_ICON_MAP[slug.toLowerCase()] ?? 'construct-outline';
}
