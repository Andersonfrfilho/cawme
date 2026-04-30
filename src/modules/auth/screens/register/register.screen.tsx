import React, { useState, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";
import { UserTypeToggle, RegisterForm } from "../../components";
import type { UserType } from "../../components/UserTypeToggle/types";
import type { RegisterFormValues } from "./types";
import { registerSchema } from "./types";
import { styles } from "./styles";

export default function RegisterScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const params = useLocalSearchParams<{ userType?: string }>();
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
      headerTitle: "",
      headerShadowVisible: false,
    });
  }, [navigation]);

  const [userType, setUserType] = useState<UserType>(
    (params.userType as UserType) ?? "contractor",
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
      document: "",
      cep: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      serviceTags: [],
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    router.push({
      pathname: "/terms" as any,
      params: {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        document: values.document,
        cep: values.cep,
        street: values.street,
        number: values.number,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
        serviceTags: JSON.stringify(values.serviceTags),
        password: values.password,
        userType,
      },
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={[styles.header, { paddingTop: verticalScale(16) + insets.top }]}>
          <View style={styles.logoMark}>
            <Ionicons
              name="person-add-outline"
              size={moderateScale(22, 0.3)}
              color={theme.colors.primary.DEFAULT}
            />
          </View>
          <Text style={styles.appName}>Cawme</Text>
          <Text style={styles.tagline}>{auth.registerSubtitle}</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <UserTypeToggle selected={userType} onSelect={setUserType} />
              <RegisterForm
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                userType={userType}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
