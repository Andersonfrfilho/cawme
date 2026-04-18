import type MockAdapter from 'axios-mock-adapter';

export function homeHandlers(mock: MockAdapter) {
  mock.onGet('/bff/home').reply(200, {
    layout: [
      {
        id: 'banner-1',
        type: 'banner_carousel',
        order: 0,
        config: { autoPlay: true, interval: 4000 },
        data: [
          { id: 'b1', imageUrl: 'https://picsum.photos/seed/banner1/800/300', title: 'Limpeza residencial', subtitle: 'A partir de R$ 80', action: { type: 'navigate', route: '/(app)/search', params: { category: 'limpeza' } } },
          { id: 'b2', imageUrl: 'https://picsum.photos/seed/banner2/800/300', title: 'Encanamento e reparos', subtitle: 'Profissionais verificados', action: { type: 'navigate', route: '/(app)/search', params: { category: 'encanamento' } } },
          { id: 'b3', imageUrl: 'https://picsum.photos/seed/banner3/800/300', title: 'Jardinagem', subtitle: 'Seu espaço mais bonito', action: { type: 'navigate', route: '/(app)/search', params: { category: 'jardinagem' } } },
        ],
        action: null,
      },
      {
        id: 'categories-1',
        type: 'category_list',
        order: 1,
        config: { title: 'Categorias', showAll: true },
        data: [
          { id: 'c1', name: 'Limpeza', icon: 'sparkles', color: '#4F7AF7' },
          { id: 'c2', name: 'Encanamento', icon: 'droplets', color: '#22C55E' },
          { id: 'c3', name: 'Elétrica', icon: 'zap', color: '#F5A623' },
          { id: 'c4', name: 'Pintura', icon: 'paintbrush', color: '#8B5CF6' },
          { id: 'c5', name: 'Jardinagem', icon: 'leaf', color: '#16A34A' },
          { id: 'c6', name: 'Reformas', icon: 'hammer', color: '#DC2626' },
        ],
        action: { type: 'navigate', route: '/(app)/search' },
      },
      {
        id: 'providers-1',
        type: 'provider_grid',
        order: 2,
        config: { title: 'Mais bem avaliados', columns: 2 },
        data: [
          { id: 'p1', name: 'Carlos Silva', category: 'Limpeza', rating: 4.9, reviewCount: 128, avatarUrl: 'https://i.pravatar.cc/150?img=11', priceFrom: 80 },
          { id: 'p2', name: 'Ana Pereira', category: 'Jardinagem', rating: 4.8, reviewCount: 95, avatarUrl: 'https://i.pravatar.cc/150?img=20', priceFrom: 60 },
          { id: 'p3', name: 'Roberto Melo', category: 'Elétrica', rating: 4.7, reviewCount: 203, avatarUrl: 'https://i.pravatar.cc/150?img=33', priceFrom: 120 },
          { id: 'p4', name: 'Fernanda Lima', category: 'Pintura', rating: 4.9, reviewCount: 74, avatarUrl: 'https://i.pravatar.cc/150?img=47', priceFrom: 150 },
        ],
        action: null,
      },
    ],
  });
}
