import { useEffect } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { ChatService } from '@/modules/chat/services/chat.service';
import { useChatStore } from '@/modules/chat/store/chat.store';
import { ChatSocketService } from '@/modules/chat/services/chat-socket.service';
import { useAuthStore } from '@/modules/auth/store/auth.store';

export function useChatRooms() {
  const setRooms = useChatStore((s) => s.setRooms);
  const user = useAuthStore((s) => s.user);

  const query = useQuery({
    queryKey: ['chat', 'rooms'],
    queryFn: ChatService.getRooms,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (query.data?.rooms) {
      setRooms(query.data.rooms);
    }
  }, [query.data, setRooms]);

  useEffect(() => {
    if (user?.id) {
      ChatSocketService.connect(user.id);
    }
    return () => ChatSocketService.disconnect();
  }, [user?.id]);

  return query;
}

export function useChatMessages(roomId: string) {
  const addMessage = useChatStore((s) => s.addMessage);
  const messages = useChatStore((s) => s.messagesByRoom[roomId] || []);
  const setMessages = useChatStore((s) => s.setMessages);

  const query = useInfiniteQuery({
    queryKey: ['chat', 'messages', roomId],
    queryFn: ({ pageParam = 1 }) => ChatService.getMessages({ roomId, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    enabled: !!roomId,
  });

  // Sincroniza dados do servidor com a store local
  useEffect(() => {
    if (query.data) {
      const allMessages = query.data.pages.flatMap((page) => page.messages);
      setMessages(roomId, allMessages);
    }
  }, [query.data, roomId, setMessages]);

  useEffect(() => {
    if (roomId) {
      ChatSocketService.joinRoom(roomId);
      ChatSocketService.markRead(roomId);
    }
  }, [roomId]);

  const send = (content: string) => {
    ChatSocketService.sendMessage(roomId, content);
  };

  return {
    ...query,
    messages,
    sendMessage: send,
  };
}
