import React, { useLayoutEffect, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { PendingVerificationBadge } from "@/modules/auth/components/PendingVerificationBadge/PendingVerificationBadge.component";
import RequestListScreen from "@/modules/service-requests/screens/request-list";

import { styles } from "./styles";
import ProviderDashboard from "@/modules/dashboard/components/ProviderDashboard";
import { useLocale, type LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale } from "@/shared/utils/scale";

type DashboardHeaderRightProps = {
  isProvider: boolean;
  onLogout: () => void;
};

function DashboardHeaderRight({ isProvider, onLogout }: DashboardHeaderRightProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(4, 0.5) }}>
      {isProvider && (
        <TouchableOpacity
          onPress={() => router.push("/(app)/service-requests/schedule" as any)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginRight: moderateScale(8, 0.5) }}
        >
          <Ionicons name="calendar-outline" size={22} color={theme.colors.primary.DEFAULT} />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => router.push("/(app)/account/profile-edit" as any)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ marginRight: moderateScale(8, 0.5) }}>
        <Ionicons name="person-circle-outline" size={22} color={theme.colors.primary.DEFAULT} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogout} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ marginRight: 16 }}>
        <Ionicons name="log-out-outline" size={22} color={theme.colors.status.error} />
      </TouchableOpacity>
    </View>
  );
}

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const navigation = useNavigation();

  const locale = useLocale<LocaleKeys>();
  const isProvider = user?.type === "provider";

  const renderHeaderRight = useCallback(
    () => <DashboardHeaderRight isProvider={isProvider} onLogout={logout} />,
    [isProvider, logout],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: renderHeaderRight,
    });
  }, [navigation, renderHeaderRight]);

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>{locale?.dashboard?.loginRequired ?? "loginRequired"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PendingVerificationBadge variant="banner" />
      {user.type === "provider" ? (
        <ProviderDashboard />
      ) : (
        <RequestListScreen hideHeader />
      )}
    </View>
  );
}
