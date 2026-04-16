import { create } from 'zustand';
import { ChatMessage, ChatRoom } from '@/types/bff/chat.types';

interface ChatStore {
  rooms: ChatRoom[];
  messagesByRoom: Record<string, ChatMessage[]>;
  
  setRooms: (rooms: ChatRoom[]) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  addMessage: (roomId: string, message: ChatMessage) => void;
  updateMessageStatus: (roomId: string, tempId: string, realId: string, status: ChatMessage['status']) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  rooms: [],
  messagesByRoom: {},

  setRooms: (rooms) => set({ rooms }),
  
  setMessages: (roomId, messages) => set((state) => ({
    messagesByRoom: { ...state.messagesByRoom, [roomId]: messages }
  })),

  addMessage: (roomId, message) => set((state) => {
    const currentMessages = state.messagesByRoom[roomId] || [];
    // Evita duplicatas se a mensagem real chegar logo após a otimista
    if (currentMessages.some(m => m.id === message.id)) return state;
    
    return {
      messagesByRoom: {
        ...state.messagesByRoom,
        [roomId]: [message, ...currentMessages]
      }
    };
  }),

  updateMessageStatus: (roomId, tempId, realId, status) => set((state) => {
    const currentMessages = state.messagesByRoom[roomId] || [];
    return {
      messagesByRoom: {
        ...state.messagesByRoom,
        [roomId]: currentMessages.map(m => 
          m.id === tempId ? { ...m, id: realId, status } : m
        )
      }
    };
  }),
}));
