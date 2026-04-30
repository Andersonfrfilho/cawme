import React, { useState, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";
import { useRegister } from "@/modules/auth/hooks/useRegister";
import { RegisterSuccess } from "../../components";
import { styles } from "./styles";
import type { TermsScreenParams } from "./types";

type ScreenState = "terms" | "success" | "error";

export default function TermsScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const params = useLocalSearchParams<TermsScreenParams>();
  const { register } = useRegister();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="chevron-back" size={moderateScale(22, 0.3)} color={theme.colors.text.primary} />
        </TouchableOpacity>
      ),
      headerTitle: auth.termsTitle,
      headerShadowVisible: false,
    });
  }, [navigation]);

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenState, setScreenState] = useState<ScreenState>("terms");

  const allFieldsValid =
    params.fullName &&
    params.email &&
    params.phone &&
    params.password &&
    params.userType;

  const handleSubmit = async () => {
    if (!accepted || !allFieldsValid) return;
    setLoading(true);
    try {
      await register({
        fullName: params.fullName,
        email: params.email,
        phone: params.phone,
        password: params.password,
        userType: params.userType,
      });
      router.push({
        pathname: "/verification" as any,
        params: {
          email: params.email,
          phone: params.phone,
          userType: params.userType,
        },
      });
    } catch {
      setScreenState("error");
    } finally {
      setLoading(false);
    }
  };

  if (screenState === "success") {
    return (
      <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
        <StatusBar barStyle="dark-content" />
        <RegisterSuccess
          email={params.email}
          onGoToLogin={() => router.replace("/login" as any)}
        />
      </SafeAreaView>
    );
  }

  if (screenState === "error") {
    return (
      <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={scale(64)}
            color={theme.colors.status.error}
          />
          <Text style={styles.errorTitle}>
            {auth.registerError}
          </Text>
          <Text style={styles.errorDescription}>
            {auth.registerEmailExists}
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => setScreenState("terms")}
            activeOpacity={0.85}
          >
            <Text style={styles.errorButtonText}>{auth.backToLogin}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{auth.registerTitle}</Text>
            <View style={styles.summaryRow}>
              <Ionicons name="person-outline" size={moderateScale(16, 0.3)} color={theme.colors.text.secondary} />
              <Text style={styles.summaryText}>{params.fullName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="mail-outline" size={moderateScale(16, 0.3)} color={theme.colors.text.secondary} />
              <Text style={styles.summaryText}>{params.email}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="call-outline" size={moderateScale(16, 0.3)} color={theme.colors.text.secondary} />
              <Text style={styles.summaryText}>{params.phone}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="briefcase-outline" size={moderateScale(16, 0.3)} color={theme.colors.text.secondary} />
              <Text style={styles.summaryText}>
                {params.userType === "contractor" ? auth.registerToggleClient : auth.registerToggleProvider}
              </Text>
            </View>
          </View>

          <View style={styles.termsCard}>
            <Text style={styles.termsCardTitle}>{auth.termsTitle}</Text>
            <Text style={styles.termsText}>{auth.termsContent}</Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAccepted((prev) => !prev)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, accepted && styles.checkboxActive]}>
              {accepted && (
                <Ionicons
                  name="checkmark"
                  size={moderateScale(14, 0.3)}
                  color={theme.palette.neutral[0]}
                />
              )}
            </View>
            <Text style={styles.checkboxText}>
              {auth.termsAcceptCheckbox}{" "}
              <Text style={styles.linkText}>{auth.termsLinkText}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!accepted || loading) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!accepted || loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={theme.palette.neutral[0]} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {auth.termsFinalizeButton}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
