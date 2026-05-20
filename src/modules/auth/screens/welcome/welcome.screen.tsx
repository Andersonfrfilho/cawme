import React, { useState, useEffect } from "react";
import { View, Text, StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";
import { WelcomeSlides, WelcomeActions } from "../../components";
import type { SlideData } from "../../components/WelcomeSlides/types";
import { styles } from "./styles";
import { useRegisterStore } from "@/modules/auth/store/register.store";
import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { useRegistrationResume } from "@/modules/auth/hooks/useRegistrationResume";
import { useLoading } from "@/shared/hooks/useLoading";

export default function WelcomeScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const { checkAndResume } = useRegistrationResume();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const pendingRegistration = useRegisterStore.getState().pendingRegistration;
    const tempCredentials = useRegisterStore.getState().tempCredentials;

    if (!pendingRegistration || !tempCredentials) return;

    let cancelled = false;

    async function autoResume() {
      showLoading();
      try {
        await KeycloakService.login({
          username: tempCredentials!.email,
          password: tempCredentials!.password,
        });
        if (cancelled) return;
        await checkAndResume();
      } catch {
        // Credenciais inválidas ou conta bloqueada — não redireciona, deixa o usuário logar manualmente
      } finally {
        if (!cancelled) hideLoading();
      }
    }

    autoResume();
    return () => { cancelled = true; };
  // Só executa na montagem
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slides: SlideData[] = [
    {
      id: "1",
      icon: "people-outline",
      headline: auth.welcomeSlide1Title,
      description: auth.welcomeSlide1Desc,
    },
    {
      id: "2",
      icon: "calendar-outline",
      headline: auth.welcomeSlide2Title,
      description: auth.welcomeSlide2Desc,
    },
    {
      id: "3",
      icon: "shield-checkmark-outline",
      headline: auth.welcomeSlide3Title,
      description: auth.welcomeSlide3Desc,
    },
  ];

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <Animated.View
          entering={FadeIn.delay(0).duration(700)}
          style={[styles.heroSection, { paddingTop: verticalScale(60) + insets.top }]}
        >
          <View style={styles.logoContainer}>
            <Ionicons
              name="home"
              size={moderateScale(28, 0.3)}
              color={theme.colors.primary.DEFAULT}
            />
          </View>
          <Text style={styles.appName}>Cawme</Text>
          <Text style={styles.tagline}>{auth.welcomeSubtitle}</Text>
        </Animated.View>

        <View style={styles.slidesContainer}>
          <WelcomeSlides
            slides={slides}
            activeIndex={activeIndex}
            onIndexChange={setActiveIndex}
          />
        </View>

        <View style={styles.actionsContainer}>
          <WelcomeActions
            onHireService={() =>
              router.push({
                pathname: "/register" as any,
                params: { userType: "contractor" },
              })
            }
            onOfferService={() =>
              router.push({
                pathname: "/register" as any,
                params: { userType: "provider" },
              })
            }
            onAlreadyHaveAccount={() => router.push("/login" as any)}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
