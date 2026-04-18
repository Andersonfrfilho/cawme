import type MockAdapter from 'axios-mock-adapter';

const ROOMS = [
  {
    id: 'room-1',
    participant: { id: 'u1', name: 'Carlos Silva', avatarUrl: 'https://i.pravatar.cc/150?img=11' },
    lastMessage: { content: 'Estarei aí amanhã às 10h.', createdAt: '2026-04-18T09:15:00Z' },
    unreadCount: 1,
  },
  {
    id: 'room-2',
    participant: { id: 'u2', name: 'Ana Pereira', avatarUrl: 'https://i.pravatar.cc/150?img=20' },
    lastMessage: { content: 'Pode confirmar o endereço?', createdAt: '2026-04-17T16:30:00Z' },
    unreadCount: 0,
  },
  {
    id: 'room-3',
    participant: { id: 'u3', name: 'Roberto Melo', avatarUrl: 'https://i.pravatar.cc/150?img=33' },
    lastMessage: { content: 'Serviço concluído! Obrigado.', createdAt: '2026-04-15T18:00:00Z' },
    unreadCount: 0,
  },
];

const MESSAGES: Record<string, any[]> = {
  'room-1': [
    { id: 'm1', roomId: 'room-1', senderId: 'u1', content: 'Olá! Vi sua solicitação de limpeza.', createdAt: '2026-04-18T08:00:00Z', status: 'read' },
    { id: 'm2', roomId: 'room-1', senderId: 'me', content: 'Oi! Sim, preciso para amanhã.', createdAt: '2026-04-18T08:05:00Z', status: 'read' },
    { id: 'm3', roomId: 'room-1', senderId: 'u1', content: 'Estarei aí amanhã às 10h.', createdAt: '2026-04-18T09:15:00Z', status: 'sent' },
  ],
  'room-2': [
    { id: 'm4', roomId: 'room-2', senderId: 'me', content: 'Olá Ana, tudo bem?', createdAt: '2026-04-17T16:00:00Z', status: 'read' },
    { id: 'm5', roomId: 'room-2', senderId: 'u2', content: 'Pode confirmar o endereço?', createdAt: '2026-04-17T16:30:00Z', status: 'read' },
  ],
};

export function chatHandlers(mock: MockAdapter) {
  mock.onGet('/bff/chat/rooms').reply(200, { rooms: ROOMS });

  mock.onGet(/\/bff\/chat\/rooms\/(.+)\/messages/).reply((config) => {
    const roomId = config.url!.split('/')[4];
    const messages = MESSAGES[roomId] ?? [];
    const page = Number(config.params?.page ?? 1);
    return [200, { messages, meta: { page, hasNextPage: false } }];
  });
}
