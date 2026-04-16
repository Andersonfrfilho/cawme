import { apiClient } from './api-client';
import { 
  GetChatRoomsResult, 
  GetChatMessagesParams, 
  GetChatMessagesResult 
} from '@/types/bff/chat.types';

export const ChatService = {
  async getRooms(): Promise<GetChatRoomsResult> {
    const response = await apiClient.get('/bff/chat/rooms');
    return response.data;
  },

  async getMessages({ roomId, page = 1 }: GetChatMessagesParams): Promise<GetChatMessagesResult> {
    const response = await apiClient.get(`/bff/chat/rooms/${roomId}/messages`, {
      params: { page },
    });
    return response.data;
  },
};
