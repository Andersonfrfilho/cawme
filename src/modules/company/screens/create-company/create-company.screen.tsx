import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeInLeft } from "react-native-reanimated";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { logger } from "@/shared/utils/logger";
import { CompanyForm } from "../../components/CompanyForm/CompanyForm.component";
import { useCreateCompany } from "../../hooks/useCreateCompany";
import { companySchema } from "./types";
import type { CompanyFormValues, WizardStep } from "./types";
import { styles } from "./styles";

const STEPS: WizardStep[] = ["basic", "address", "hours", "review"];

export default function CreateCompanyScreen() {
  const { company } = useLocale<LocaleKeys>();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { createCompany, isLoading } = useCreateCompany();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [screenState, setScreenState] = useState<"form" | "success">("form");
  const [animationDirection, setAnimationDirection] = useState<"next" | "prev">("next");

  const currentStep = STEPS[currentStepIndex];

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema) as any,
    defaultValues: {
      document: "",
      companyName: "",
      tradeName: "",
      email: "",
      phone: "",
      stateRegistration: "",
      municipalRegistration: "",
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      businessHours: [
        { dayOfWeek: 1, isOpen: true, openTime: "08:00", closeTime: "18:00" },
        { dayOfWeek: 2, isOpen: true, openTime: "08:00", closeTime: "18:00" },
        { dayOfWeek: 3, isOpen: true, openTime: "08:00", closeTime: "18:00" },
        { dayOfWeek: 4, isOpen: true, openTime: "08:00", closeTime: "18:00" },
        { dayOfWeek: 5, isOpen: true, openTime: "08:00", closeTime: "18:00" },
        { dayOfWeek: 6, isOpen: false },
        { dayOfWeek: 0, isOpen: false },
      ],
    },
  });

  const stepLabels: Record<WizardStep, string> = {
    basic: company.stepBasic,
    address: company.stepAddress,
    hours: company.stepHours,
    review: company.stepReview,
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const fieldsByStep: Record<WizardStep, (keyof CompanyFormValues)[]> = {
      basic: ["document", "companyName", "email", "phone"],
      address: ["zipCode", "street", "number", "neighborhood", "city", "state"],
      hours: ["businessHours"],
      review: [],
    };

    const fields = fieldsByStep[currentStep];
    if (fields.length === 0) return true;

    const result = await trigger(fields as any);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      logger.screenEvent("CreateCompanyScreen", "validation.failed", { step: currentStep });
      return;
    }

    if (currentStepIndex < STEPS.length - 1) {
      setAnimationDirection("next");
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setAnimationDirection("prev");
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const onSubmit = async (values: CompanyFormValues) => {
    logger.screenEvent("CreateCompanyScreen", "submit.start", {
      companyName: values.companyName,
      document: values.document,
    });

    try {
      await createCompany(values);
      logger.screenEvent("CreateCompanyScreen", "submit.success");
      setScreenState("success");
    } catch (error: any) {
      logger.error("CreateCompanyScreen", "submit.error", "Erro ao criar empresa", error);
    }
  };

  if (screenState === "success") {
    return (
      <SafeAreaView style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={moderateScale(80, 0.3)} color={theme.colors.status.success} />
          </View>
          <Text style={styles.successTitle}>{company.successTitle}</Text>
          <Text style={styles.successDescription}>{company.successDescription}</Text>
          <TouchableOpacity
            style={styles.successButton}
            onPress={() => router.replace("/(app)/dashboard" as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.successButtonText}>{company.successButton}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isLastStep = currentStepIndex === STEPS.length - 1;

  return (
    <View style={styles.root}>
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]} edges={["bottom"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ marginBottom: verticalScale(8) }}
          >
            <Ionicons name="chevron-back" size={moderateScale(24, 0.3)} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{company.createTitle}</Text>
          <Text style={styles.headerSubtitle}>{company.createSubtitle}</Text>
        </View>

        <View style={styles.stepIndicator}>
          {STEPS.map((step, index) => (
            <View
              key={step}
              style={[
                styles.stepDot,
                index === currentStepIndex && styles.stepDotActive,
              ]}
            />
          ))}
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>{stepLabels[currentStep]}</Text>
            {currentStep === "hours" && (
              <Text style={styles.sectionSubtitle}>{company.businessHoursSubtitle}</Text>
            )}
            {currentStep === "review" && (
              <Text style={styles.sectionSubtitle}>{company.reviewSubtitle}</Text>
            )}

            <Animated.View
              entering={animationDirection === "next" ? FadeInRight.duration(250) : FadeInLeft.duration(250)}
              key={currentStep}
            >
              <CompanyForm control={control} errors={errors} step={currentStep} />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={[styles.footer, { paddingBottom: insets.bottom || verticalScale(16) }]}>
          {currentStepIndex > 0 && (
            <TouchableOpacity
              style={styles.footerButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Text style={styles.footerButtonText}>{company.backButton}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.footerButton,
              styles.footerButtonPrimary,
              isLoading && styles.footerButtonDisabled,
              currentStepIndex === 0 && { flex: 1 },
            ]}
            onPress={isLastStep ? handleSubmit(onSubmit) : handleNext}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.palette.neutral[0]} size="small" />
            ) : (
              <Text style={[styles.footerButtonText, styles.footerButtonTextPrimary]}>
                {isLastStep ? company.saveButton : company.nextButton}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
