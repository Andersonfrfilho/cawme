export interface RoomItemProps {
  id: string;
  participant: {
    name: string;
    avatarUrl?: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string | Date;
  };
  unreadCount: number;
  onPress: (id: string) => void;
}
