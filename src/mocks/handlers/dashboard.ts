import type MockAdapter from 'axios-mock-adapter';

export function dashboardHandlers(mock: MockAdapter) {
  mock.onGet('/bff/dashboard/contractor').reply(200, {
    stats: [
      { label: 'Solicitações', value: 12, icon: 'file-text' },
      { label: 'Em andamento', value: 3, icon: 'clock' },
      { label: 'Concluídos', value: 47, icon: 'check-circle' },
      { label: 'Gasto total', value: 'R$ 2.840', icon: 'dollar-sign' },
    ],
    recentRequests: [
      { id: 'r1', title: 'Limpeza completa - Apto 3 quartos', status: 'accepted', date: '2026-04-18T10:00:00Z', price: 180 },
      { id: 'r2', title: 'Reparo elétrico - Quadro de luz', status: 'pending', date: '2026-04-17T14:30:00Z', price: 250 },
      { id: 'r3', title: 'Pintura sala e quartos', status: 'completed', date: '2026-04-15T09:00:00Z', price: 900 },
      { id: 'r4', title: 'Manutenção jardim', status: 'canceled', date: '2026-04-14T11:00:00Z', price: 120 },
    ],
  });

  mock.onGet('/bff/dashboard/provider').reply(200, {
    stats: [
      { label: 'Avaliação', value: '4.9', icon: 'star' },
      { label: 'Atendimentos', value: 128, icon: 'briefcase' },
      { label: 'Este mês', value: 'R$ 4.200', icon: 'trending-up' },
      { label: 'Pendentes', value: 5, icon: 'inbox' },
    ],
    activeSchedule: [
      { id: 'a1', title: 'Limpeza - Rua das Flores, 120', status: 'accepted', date: '2026-04-18T13:00:00Z', price: 160 },
      { id: 'a2', title: 'Limpeza pós-obra - Av. Central', status: 'accepted', date: '2026-04-19T09:00:00Z', price: 320 },
    ],
    pendingRequests: [
      { id: 'p1', title: 'Limpeza residencial - 2 quartos', status: 'pending', date: '2026-04-20T10:00:00Z', price: 120 },
      { id: 'p2', title: 'Limpeza comercial - escritório', status: 'pending', date: '2026-04-21T08:00:00Z', price: 280 },
      { id: 'p3', title: 'Limpeza completa - casa', status: 'pending', date: '2026-04-22T10:00:00Z', price: 200 },
    ],
  });
}
