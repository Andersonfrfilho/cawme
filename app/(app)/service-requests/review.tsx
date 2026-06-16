import { RequireAuth } from "@/shared/components/require-auth";
import ReviewScreen from "@/modules/service-requests/screens/review";

export default function ReviewRoute() {
  return (
    <RequireAuth>
      <ReviewScreen />
    </RequireAuth>
  );
}
