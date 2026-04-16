export interface ChatRoom {
  id: string;
  participant: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: string;
  status: 'sending' | 'sent' | 'read';
}

export interface GetChatRoomsResult {
  rooms: ChatRoom[];
}

export interface GetChatMessagesParams {
  roomId: string;
  page?: number;
  limit?: number;
}

export interface GetChatMessagesResult {
  messages: ChatMessage[];
  meta: {
    page: number;
    hasNextPage: boolean;
  };
}
