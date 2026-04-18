import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/modules/notifications/services/notification.service';
import { useNotificationStore } from '@/modules/notifications/store/notification.store';
import { useEffect } from 'react';

export function useNotifications() {
  const queryClient = useQueryClient();
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: NotificationService.getAll,
  });

  const unreadQuery = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: NotificationService.getUnreadCount,
    refetchInterval: 60000, // Atualiza a cada minuto
  });

  useEffect(() => {
    if (unreadQuery.data) {
      setUnreadCount(unreadQuery.data.count);
    }
  }, [unreadQuery.data, setUnreadCount]);

  const markReadMutation = useMutation({
    mutationFn: NotificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    },
  });

  return {
    notifications: notificationsQuery.data?.notifications ?? [],
    isLoading: notificationsQuery.isLoading,
    refetch: notificationsQuery.refetch,
    markAsRead: markReadMutation.mutate,
  };
}
