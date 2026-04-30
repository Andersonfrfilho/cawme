import { RequireAuth } from "@/shared/components/require-auth";
import NotificationsScreen from "@/modules/notifications/screens";

export default function NotificationsRoute() {
  return (
    <RequireAuth>
      <NotificationsScreen />
    </RequireAuth>
  );
}
