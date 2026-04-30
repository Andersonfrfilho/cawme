import { RequireAuth } from "@/shared/components/require-auth";
import DashboardScreen from "@/modules/dashboard/screens";

export default function DashboardRoute() {
  return (
    <RequireAuth>
      <DashboardScreen />
    </RequireAuth>
  );
}
