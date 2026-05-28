import { useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useHome } from "@/modules/home/hooks/useHome";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useRegisterStore } from "@/modules/auth/store/register.store";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { PendingVerificationBadge } from "@/modules/auth/components/PendingVerificationBadge/PendingVerificationBadge.component";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { SduiRenderer } from "@/modules/sdui/components/SduiRenderer";
import { styles } from "./styles";
import { theme } from "@/shared/constants";
import { moderateScale } from "@/shared/utils/scale";

export default function HomeScreen() {
  const { home } = useLocale<LocaleKeys>();
  const { data, isLoading, error, refetch } = useHome();
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const pendingOnboarding = useRegisterStore((s) => s.pendingOnboarding);
  const { logout } = useAuth();
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () =>
        isSignedIn ? (
          <TouchableOpacity
            onPress={logout}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ marginRight: 16 }}
            accessibilityLabel="Sair"
            testID="logout-button"
          >
            <Ionicons name="log-out-outline" size={22} color={theme.colors.status.error} />
          </TouchableOpacity>
        )         : (
          <TouchableOpacity
            onPress={() => router.push("/(auth)")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ marginRight: 16 }}
            accessibilityLabel="Entrar"
            testID="login-button"
          >
            <Ionicons name="log-in-outline" size={22} color={theme.colors.primary.DEFAULT} />
          </TouchableOpacity>
        ),
    });
  }, [navigation, isSignedIn, logout]);


  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
      </View>
    );
  }

  if (error && isSignedIn) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{home.loadError}</Text>
        <Text onPress={() => refetch()} style={styles.retryText}>
          {home.loadError}
        </Text>
      </View>
    );
  }

  if (error && !isSignedIn) {
    return (
      <View style={styles.guestContainer}>
        <Ionicons name="home-outline" size={64} color={theme.colors.primary.light} />
        <Text style={styles.guestTitle}>{home.guestWelcome}</Text>
        <Text style={styles.guestDescription}>{home.guestDescription}</Text>
        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => router.push("/(auth)")}
          activeOpacity={0.85}
        >
          <Ionicons name="log-in-outline" size={20} color={theme.palette.neutral[0]} style={{ marginRight: moderateScale(8, 0.5) }} />
          <Text style={styles.guestButtonText}>{home.signIn}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isSignedIn && <PendingVerificationBadge variant="banner" />}
      {!isSignedIn && pendingOnboarding && (
        <TouchableOpacity
          testID="pending-onboarding-banner"
          onPress={() => {
            if (pendingOnboarding?.keycloakId && pendingOnboarding?.password) {
              // Restaura keycloakId e tempCredentials para que a tela de verificação
              // possa enviar código (keycloakId) e fazer auto-login após verificar (password).
              useRegisterStore.getState().setKeycloakId(pendingOnboarding.keycloakId);
              useRegisterStore.getState().setTempCredentials({
                email: pendingOnboarding.email,
                password: pendingOnboarding.password,
              });
              router.push({
                pathname: "/(auth)/verification" as any,
                params: {
                  email: pendingOnboarding.email,
                  phone: pendingOnboarding.phone,
                  mode: "post-register",
                },
              });
            } else {
              // Fallback: keycloakId não disponível (sessão expirada) → login manual
              router.push("/(auth)/login" as any);
            }
          }}
          style={styles.pendingOnboardingBanner}
          activeOpacity={0.9}
        >
          <View style={styles.pendingOnboardingIconContainer}>
            <Ionicons name="person-circle-outline" size={moderateScale(20, 0.3)} color={theme.colors.primary.DEFAULT} />
          </View>
          <View style={styles.pendingOnboardingContent}>
            <Text style={styles.pendingOnboardingTitle}>{home.pendingOnboardingTitle}</Text>
            <Text style={styles.pendingOnboardingSubtitle}>{home.pendingOnboardingSubtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={moderateScale(18, 0.3)} color={theme.colors.primary.DEFAULT} />
        </TouchableOpacity>
      )}
      <SduiRenderer
        layout={data?.layout ?? []}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
    </View>
  );
}

