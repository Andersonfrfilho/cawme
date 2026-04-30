import { RequireAuth } from "@/shared/components/require-auth";
import ChatScreen from "@/modules/chat/screens";

export default function ChatRoute() {
  return (
    <RequireAuth>
      <ChatScreen />
    </RequireAuth>
  );
}
