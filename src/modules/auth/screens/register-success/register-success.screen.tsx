import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";
import { styles } from "./styles";
import type { RegisterSuccessScreenParams } from "./types";

export default function RegisterSuccessScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const params = useLocalSearchParams<RegisterSuccessScreenParams>();

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <Animated.View entering={FadeIn.delay(200).duration(600)} style={styles.iconContainer}>
        <Ionicons
          name="mail-outline"
          size={scale(64)}
          color={theme.colors.primary.DEFAULT}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).duration(600)}>
        <Text style={styles.title}>{auth.successTitle}</Text>
        <Text style={styles.description}>{auth.successDescription}</Text>
        {params.email && (
          <Text style={styles.email}>{params.email}</Text>
        )}
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).duration(600)} style={{ width: "100%", marginTop: verticalScale(16) }}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.replace("/login" as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.loginButtonText}>{auth.successGoToLogin}</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
