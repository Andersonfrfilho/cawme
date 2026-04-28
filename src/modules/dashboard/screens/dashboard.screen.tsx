import React from "react";
import { View, Text } from "react-native";
import { useAuthStore } from "@/modules/auth/store/auth.store";

import { styles } from "./styles";
import ContractorDashboard from "@/modules/dashboard/components/ContractorDashboard";
import ProviderDashboard from "@/modules/dashboard/components/ProviderDashboard";
import { useLocale, type LocaleKeys } from "@/shared/locales";

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);

  const locale = useLocale<LocaleKeys>();

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>{locale?.dashboard?.loginRequired ?? "loginRequired"}</Text>
      </View>
    );
  }

  return user.type === "provider" ? (
    <ProviderDashboard />
  ) : (
    <ContractorDashboard />
  );
}
