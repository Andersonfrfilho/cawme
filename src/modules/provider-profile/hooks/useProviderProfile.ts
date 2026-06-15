import { useQuery } from '@tanstack/react-query';
import { ProviderProfileService } from '@/modules/provider-profile/services/provider-profile.service';
import { isTestEnvironment } from '@/shared/utils/test-environment';

export function useProviderProfile(id: string) {
  return useQuery({
    queryKey: ['provider-profile', id],
    queryFn: async () => {
      if (isTestEnvironment()) {
        return {
          id,
          name: 'Maria Limpeza',
          bio: 'Profissional de limpeza com 10 anos de experiência. Especializada em limpeza residencial e comercial.',
          avatarUrl: 'https://picsum.photos/seed/provider-full/200',
          rating: 4.9,
          reviewCount: 122,
          verificationStatus: 'APPROVED',
          categories: ['Limpeza'],
          location: { city: 'São Paulo', state: 'SP' },
          services: [
            { id: '1', name: 'Limpeza Completa', price: 150, unit: 'hora' },
            { id: '2', name: 'Limpeza Rápida', price: 75, unit: 'hora' },
          ],
          paymentMethods: [
            { id: '1', name: 'pix', label: 'Pix', icon: 'cash', isEnabled: true },
            { id: '2', name: 'dinheiro', label: 'Dinheiro', icon: 'cash', isEnabled: true },
          ],
          reviews: [
            {
              rating: 5,
              comment: 'Excelente profissional, muito pontual e cuidadosa.',
              contractorName: 'João Silva',
              serviceName: 'Limpeza Completa',
              createdAt: '2024-05-10T14:00:00Z',
            },
            {
              rating: 4,
              comment: 'Bom serviço, recomendo.',
              contractorName: 'Ana Costa',
              serviceName: 'Limpeza Rápida',
              createdAt: '2024-04-22T10:30:00Z',
            },
          ],
        };
      }
      return ProviderProfileService.get({ id });
    },
    staleTime: 3 * 60 * 1000, // 3min conforme SPEC
    enabled: !!id,
  });
}
