import { io, Socket } from 'socket.io-client';
import { useChatStore } from '@/modules/chat/store/chat.store';
import { ChatMessage } from '@/modules/chat/types/chat.types';

let socket: Socket | null = null;

export const ChatSocketService = {
  connect(userId: string): void {
    if (socket?.connected) return;

    socket = io(`${process.env.EXPO_PUBLIC_WS_URL}/chat`, {
      query: { user_id: userId },
      transports: ['websocket'],
    });

    socket.on('message_received', (data: ChatMessage) => {
      useChatStore.getState().addMessage(data.roomId, data);
    });

    socket.on('messages_read', ({ roomId, readBy }: { roomId: string, readBy: string }) => {
      // Implementar lógica de marcar como lido se necessário
    });
  },

  joinRoom(roomId: string): void {
    socket?.emit('join_room', { room_id: roomId });
  },

  sendMessage(roomId: string, content: string): void {
    socket?.emit('send_message', { room_id: roomId, content });
  },

  markRead(roomId: string): void {
    socket?.emit('mark_read', { room_id: roomId });
  },

  disconnect(): void {
    socket?.disconnect();
    socket = null;
  },
};
