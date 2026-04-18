import type MockAdapter from 'axios-mock-adapter';

const NOTIFICATIONS = [
  { id: 'n1', title: 'Solicitação aceita', body: 'Carlos Silva aceitou seu pedido de limpeza.', type: 'success', createdAt: '2026-04-18T10:30:00Z', read: false },
  { id: 'n2', title: 'Serviço concluído', body: 'Sua pintura foi concluída. Avalie o prestador!', type: 'info', createdAt: '2026-04-17T18:00:00Z', read: false },
  { id: 'n3', title: 'Nova mensagem', body: 'Fernanda Lima enviou uma mensagem.', type: 'info', createdAt: '2026-04-17T14:00:00Z', read: true },
  { id: 'n4', title: 'Lembrete', body: 'Seu serviço de encanamento é amanhã às 09h.', type: 'warning', createdAt: '2026-04-16T20:00:00Z', read: true },
  { id: 'n5', title: 'Cancelamento', body: 'O prestador cancelou a visita de amanhã.', type: 'error', createdAt: '2026-04-15T11:00:00Z', read: true },
];

export function notificationsHandlers(mock: MockAdapter) {
  mock.onGet('/bff/notifications').reply(() => [200, { notifications: NOTIFICATIONS }]);

  mock.onGet('/bff/notifications/unread-count').reply(() => [
    200,
    { count: NOTIFICATIONS.filter((n) => !n.read).length },
  ]);

  mock.onPut(/\/bff\/notifications\/(.+)\/read/).reply((config) => {
    const id = config.url!.split('/')[3];
    const n = NOTIFICATIONS.find((n) => n.id === id);
    if (n) n.read = true;
    return [204];
  });

  mock.onPut('/bff/notifications/read-all').reply(() => {
    NOTIFICATIONS.forEach((n) => { n.read = true; });
    return [204];
  });
}
