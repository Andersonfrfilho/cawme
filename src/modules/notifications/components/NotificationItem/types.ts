import { NotificationItem as NotificationType } from "../../types/notification.types";

export interface NotificationItemProps {
  item: NotificationType;
  onPress: (id: string) => void;
}
