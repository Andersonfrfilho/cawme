import type MockAdapter from 'axios-mock-adapter';

const PROVIDERS: Record<string, any> = {
  p1: {
    id: 'p1', name: 'Carlos Silva',
    bio: 'Profissional de limpeza com mais de 10 anos de experiência. Especializado em limpeza residencial e pós-obra. Materiais inclusos.',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    rating: 4.9, reviewCount: 128,
    categories: ['Limpeza', 'Limpeza pós-obra'],
    location: { city: 'São Paulo', state: 'SP', distance: 1.2 },
    services: [
      { id: 's1', name: 'Limpeza residencial', price: 80, unit: 'por cômodo' },
      { id: 's2', name: 'Limpeza completa', price: 300, unit: 'apartamento' },
      { id: 's3', name: 'Limpeza pós-obra', price: 500, unit: 'por m²' },
    ],
  },
  p2: {
    id: 'p2', name: 'Ana Pereira',
    bio: 'Paisagista e jardineira certificada. Criação e manutenção de jardins residenciais e comerciais.',
    avatarUrl: 'https://i.pravatar.cc/150?img=20',
    rating: 4.8, reviewCount: 95,
    categories: ['Jardinagem', 'Paisagismo'],
    location: { city: 'São Paulo', state: 'SP', distance: 2.4 },
    services: [
      { id: 's4', name: 'Manutenção de jardim', price: 60, unit: 'por visita' },
      { id: 's5', name: 'Projeto de paisagismo', price: 800, unit: 'projeto' },
    ],
  },
  p3: {
    id: 'p3', name: 'Roberto Melo',
    bio: 'Eletricista com CREA ativo. Instalações, manutenção e projetos elétricos residenciais e comerciais.',
    avatarUrl: 'https://i.pravatar.cc/150?img=33',
    rating: 4.7, reviewCount: 203,
    categories: ['Elétrica'],
    location: { city: 'São Paulo', state: 'SP', distance: 3.1 },
    services: [
      { id: 's6', name: 'Instalação de tomadas', price: 80, unit: 'por ponto' },
      { id: 's7', name: 'Projeto elétrico', price: 600, unit: 'projeto' },
    ],
  },
};

export function providerProfileHandlers(mock: MockAdapter) {
  mock.onGet(/\/bff\/providers\/(.+)\/profile/).reply((config) => {
    const id = config.url!.split('/')[3];
    const provider = PROVIDERS[id];
    if (!provider) return [404, { message: 'Prestador não encontrado' }];
    return [200, provider];
  });
}
