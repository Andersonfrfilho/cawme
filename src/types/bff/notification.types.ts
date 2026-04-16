export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
  data?: Record<string, any>;
}

export interface GetNotificationsResult {
  notifications: NotificationItem[];
}

export interface UnreadCountResult {
  count: number;
}
