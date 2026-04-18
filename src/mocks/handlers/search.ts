import type MockAdapter from 'axios-mock-adapter';

export function searchHandlers(mock: MockAdapter) {
  mock.onGet('/bff/search').reply((config) => {
    const q = config.params?.q ?? '';
    const page = Number(config.params?.page ?? 1);

    return [200, {
      layout: [
        {
          id: 'search-filters',
          type: 'search_filters',
          order: 0,
          config: {},
          data: [
            { id: 'f-all', label: 'Todos', active: true },
            { id: 'f-limpeza', label: 'Limpeza', active: false },
            { id: 'f-eletrica', label: 'Elétrica', active: false },
            { id: 'f-pintura', label: 'Pintura', active: false },
            { id: 'f-jardinagem', label: 'Jardinagem', active: false },
          ],
          action: null,
        },
        {
          id: 'search-results',
          type: 'provider_list',
          order: 1,
          config: { title: q ? `Resultados para "${q}"` : 'Todos os prestadores' },
          data: [
            { id: 'p1', name: 'Carlos Silva', category: 'Limpeza', rating: 4.9, reviewCount: 128, avatarUrl: 'https://i.pravatar.cc/150?img=11', priceFrom: 80, distance: 1.2 },
            { id: 'p2', name: 'Ana Pereira', category: 'Jardinagem', rating: 4.8, reviewCount: 95, avatarUrl: 'https://i.pravatar.cc/150?img=20', priceFrom: 60, distance: 2.4 },
            { id: 'p3', name: 'Roberto Melo', category: 'Elétrica', rating: 4.7, reviewCount: 203, avatarUrl: 'https://i.pravatar.cc/150?img=33', priceFrom: 120, distance: 3.1 },
            { id: 'p4', name: 'Fernanda Lima', category: 'Pintura', rating: 4.9, reviewCount: 74, avatarUrl: 'https://i.pravatar.cc/150?img=47', priceFrom: 150, distance: 0.8 },
            { id: 'p5', name: 'João Santos', category: 'Encanamento', rating: 4.6, reviewCount: 312, avatarUrl: 'https://i.pravatar.cc/150?img=60', priceFrom: 100, distance: 4.5 },
          ],
          action: null,
        },
      ],
      meta: { total: 5, page, lastPage: 1, hasNextPage: false },
    }];
  });
}
