import { ChatMessage, ChatRoom } from './chat.types';

export interface ChatStore {
  rooms: ChatRoom[];
  messagesByRoom: Record<string, ChatMessage[]>;

  setRooms: (rooms: ChatRoom[]) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  addMessage: (roomId: string, message: ChatMessage) => void;
  updateMessageStatus: (
    roomId: string,
    tempId: string,
    realId: string,
    status: ChatMessage['status']
  ) => void;
}
