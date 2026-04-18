import type MockAdapter from 'axios-mock-adapter';

export function appConfigHandlers(mock: MockAdapter) {
  mock.onGet('/bff/app-config').reply(200, {
    version: { latest: '1.0.0', minRequired: '1.0.0', forceUpdate: false },
    navigation: {
      tabBar: {
        items: [
          { id: 'home', label: 'Início', icon: 'home', visible: true },
          { id: 'search', label: 'Buscar', icon: 'search', visible: true },
          { id: 'dashboard', label: 'Dashboard', icon: 'grid', visible: true },
          { id: 'chat', label: 'Chat', icon: 'message-circle', visible: true, badge: 2 },
          { id: 'notifications', label: 'Avisos', icon: 'bell', visible: true, badge: 3 },
        ],
      },
    },
    features: { chat: true, notifications: true, providerProfile: true, search: true },
  });
}
