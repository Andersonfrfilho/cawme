import { apiClient } from '@/shared/services/api-client';
import { GetNotificationsResult, UnreadCountResult } from '@/modules/notifications/types/notification.types';

export const NotificationService = {
  async getAll(): Promise<GetNotificationsResult> {
    const response = await apiClient.get('/bff/notifications');
    return response.data;
  },

  async getUnreadCount(): Promise<UnreadCountResult> {
    const response = await apiClient.get('/bff/notifications/unread-count');
    return response.data;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.put(`/bff/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.put('/bff/notifications/read-all');
  },
};
