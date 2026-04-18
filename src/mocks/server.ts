import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '@/shared/services/api-client';
import { appConfigHandlers } from './handlers/app-config';
import { homeHandlers } from './handlers/home';
import { dashboardHandlers } from './handlers/dashboard';
import { notificationsHandlers } from './handlers/notifications';
import { chatHandlers } from './handlers/chat';
import { searchHandlers } from './handlers/search';
import { providerProfileHandlers } from './handlers/provider-profile';

export function createMockServer() {
  const mock = new MockAdapter(apiClient, { delayResponse: 400, onNoMatch: 'passthrough' });

  appConfigHandlers(mock);
  homeHandlers(mock);
  dashboardHandlers(mock);
  notificationsHandlers(mock);
  chatHandlers(mock);
  searchHandlers(mock);
  providerProfileHandlers(mock);

  return mock;
}
