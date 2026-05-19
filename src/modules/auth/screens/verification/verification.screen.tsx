import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { useVerification } from "@/modules/auth/hooks/useVerification";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useRegisterStore } from "@/modules/auth/store/register.store";
import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { useLoading } from "@/shared/hooks/useLoading";
import { logger } from "@/shared/utils/logger";
import { DocumentUploadSheet } from "@/modules/auth/components/DocumentUploadSheet";
import { styles } from "./styles";
import type { VerificationScreenParams, VerificationTarget } from "./types";

const CODE_LENGTH = 4;

function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function VerificationScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const params = useLocalSearchParams<VerificationScreenParams>();
  const { sendCode, verifyCode } = useVerification();
  const { showLoading, hideLoading } = useLoading();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: theme.colors.primary.DEFAULT },
      headerShadowVisible: false,
      headerTitle: "",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="chevron-back" size={moderateScale(22, 0.3)} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const authUser = useAuthStore((state) => state.user);

  const effectiveEmail = params.email || authUser?.email || "";
  const effectivePhone = params.phone || authUser?.phone || "";

  const [target, setTarget] = useState<VerificationTarget>("email");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [emailVerified, setEmailVerified] = useState(params.emailVerified === "true");
  const [phoneVerified, setPhoneVerified] = useState(params.phoneVerified === "true");
  const [showDocumentSheet, setShowDocumentSheet] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const bothVerified = emailVerified && phoneVerified;
  const verifiedCount = (emailVerified ? 1 : 0) + (phoneVerified ? 1 : 0);
  const isCurrentVerified = target === "email" ? emailVerified : phoneVerified;

  useEffect(() => {
    logger.screenEvent('VerificationScreen', 'screen.open', {
      mode: params.mode,
      email: params.email,
      phone: params.phone,
      hasTempCredentials: !!useRegisterStore.getState().tempCredentials,
    });
    sendInitialCode();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    setCanResend(true);
  }, [countdown]);

  const toApiType = (verificationTarget: VerificationTarget): "email" | "sms" =>
    verificationTarget === "phone" ? "sms" : "email";

  const sendInitialCode = async () => {
    if (!effectiveEmail) return;
    setLoading(true);
    setError("");
    try {
      await sendCode({ type: "email", destination: effectiveEmail });
      setCountdown(60);
      setCanResend(false);
    } catch {
      setError(auth.verificationSendError);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (overrideTarget?: VerificationTarget) => {
    const activeTarget = overrideTarget ?? target;
    const destination = activeTarget === "email" ? effectiveEmail : effectivePhone;
    if (!destination) {
      setError(auth.verificationSendError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendCode({ type: toApiType(activeTarget), destination });
      setCountdown(60);
      setCanResend(false);
    } catch {
      setError(auth.verificationSendError);
    } finally {
      setLoading(false);
    }
  };

  const switchToTab = async (newTarget: VerificationTarget) => {
    setTarget(newTarget);
    setCode(Array(CODE_LENGTH).fill(""));
    setError("");
    const alreadyVerified = newTarget === "email" ? emailVerified : phoneVerified;
    if (!alreadyVerified) {
      await handleSendCode(newTarget);
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== CODE_LENGTH) return;

    setLoading(true);
    setError("");
    try {
      const destination = target === "email" ? effectiveEmail : effectivePhone;
      const result = await verifyCode({ type: toApiType(target), destination, code: fullCode });

      if (result.verified) {
        if (target === "email") {
          setEmailVerified(true);
          useAuthStore.getState().setVerificationStatus({ emailVerified: true });
          if (!phoneVerified) {
            await switchToTab("phone");
          }
        } else {
          setPhoneVerified(true);
          useAuthStore.getState().setVerificationStatus({ phoneVerified: true });
        }
        setCode(Array(CODE_LENGTH).fill(""));
      } else {
        setError(auth.verificationInvalidCode);
        setCode(Array(CODE_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError(auth.verificationError);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvance = async () => {
    const isPostRegister = params.mode === "post-register";
    const tempCreds = useRegisterStore.getState().tempCredentials;

    if (isPostRegister && tempCreds) {
      logger.screenEvent('VerificationScreen', 'verify.auto-login', { email: tempCreds.email });
      showLoading();
      try {
        const { id, name, email } = await KeycloakService.login({
          username: tempCreds.email,
          password: tempCreds.password,
        });
        useAuthStore.getState().setUser({ id, name, email, type: "contractor", phone: effectivePhone || undefined });

        useRegisterStore.getState().clearAddress();
        useRegisterStore.getState().clearKeycloakId();
        useRegisterStore.getState().clearTempCredentials();

        setShowDocumentSheet(true);
        return;
      } catch (error) {
        logger.error('VerificationScreen', 'verify.auto-login.error', 'Auto-login falhou após verificação', error);
        useRegisterStore.getState().clearTempCredentials();
        useRegisterStore.getState().clearAddress();
        useRegisterStore.getState().clearKeycloakId();
        router.replace("/(auth)" as any);
        return;
      } finally {
        hideLoading();
      }
    }

    router.replace("/(app)/home" as any);
  };

  const handleSheetNow = useCallback(() => {
    setShowDocumentSheet(false);
    router.replace({
      pathname: "/(auth)/document-upload" as any,
      params: { documentType: params.documentType, mode: "post-register" },
    });
  }, [params.documentType]);

  const handleSheetLater = useCallback(() => {
    setShowDocumentSheet(false);
    router.replace("/(app)/home" as any);
  }, []);

  const handleSkipVerification = () => {
    useRegisterStore.getState().clearTempCredentials();
    useRegisterStore.getState().clearAddress();
    useRegisterStore.getState().clearKeycloakId();
    router.replace("/(app)/home" as any);
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <View style={styles.root}>
      <DocumentUploadSheet
        visible={showDocumentSheet}
        onNow={handleSheetNow}
        onLater={handleSheetLater}
      />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{auth.verificationTitle}</Text>
          <Text style={styles.headerSubtitle}>{auth.verificationSubtitle}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {auth.verificationProgress.replace("{done}", verifiedCount.toString())}
            </Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                target === "email" && !emailVerified && styles.tabActive,
              ]}
              onPress={() => switchToTab("email")}
              disabled={bothVerified}
            >
              <View style={styles.tabContent}>
                {emailVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={moderateScale(14, 0.3)}
                    color={theme.colors.status.success}
                    style={styles.tabIcon}
                  />
                )}
                <Text
                  style={[
                    styles.tabText,
                    target === "email" && !emailVerified && styles.tabTextActive,
                    emailVerified && styles.tabTextVerified,
                  ]}
                >
                  {auth.verificationEmailTab}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                target === "phone" && !phoneVerified && styles.tabActive,
              ]}
              onPress={() => switchToTab("phone")}
              disabled={bothVerified}
            >
              <View style={styles.tabContent}>
                {phoneVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={moderateScale(14, 0.3)}
                    color={theme.colors.status.success}
                    style={styles.tabIcon}
                  />
                )}
                <Text
                  style={[
                    styles.tabText,
                    target === "phone" && !phoneVerified && styles.tabTextActive,
                    phoneVerified && styles.tabTextVerified,
                  ]}
                >
                  {auth.verificationPhoneTab}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {isCurrentVerified ? (
            <View style={styles.verifiedContainer}>
              <Ionicons
                name="checkmark-circle"
                size={moderateScale(56, 0.3)}
                color={theme.colors.status.success}
              />
              <Text style={styles.verifiedText}>
                {target === "email"
                  ? auth.verificationEmailVerified
                  : auth.verificationPhoneVerified}
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.targetInfo}>
                {(target === "email"
                  ? auth.verificationEmailSent
                  : auth.verificationPhoneSent
                ).replace("{target}", target === "email" ? effectiveEmail : formatPhoneDisplay(effectivePhone))}
              </Text>

              <View style={styles.codeContainer}>
                {Array(CODE_LENGTH)
                  .fill(null)
                  .map((_, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        inputRefs.current[index] = ref;
                      }}
                      style={[styles.codeInput, code[index] && styles.codeInputFilled]}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={code[index]}
                      onChangeText={(value) => handleCodeChange(index, value)}
                      onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                    />
                  ))}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  (!isCodeComplete || loading) && styles.verifyButtonDisabled,
                ]}
                onPress={handleVerify}
                disabled={!isCodeComplete || loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={theme.palette.neutral[0]} size="small" />
                ) : (
                  <Text style={styles.verifyButtonText}>{auth.verificationVerifyButton}</Text>
                )}
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>
                  {canResend ? (
                    <Text style={styles.resendLink} onPress={() => handleSendCode()}>
                      {auth.verificationResend}
                    </Text>
                  ) : (
                    auth.verificationResendCountdown.replace("{seconds}", countdown.toString())
                  )}
                </Text>
              </View>
            </>
          )}

          {bothVerified && (
            <TouchableOpacity
              style={styles.advanceButton}
              onPress={handleAdvance}
              activeOpacity={0.85}
            >
              <Text style={styles.advanceButtonText}>{auth.verificationAdvanceButton}</Text>
            </TouchableOpacity>
          )}

          {!bothVerified && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkipVerification}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>{auth.verificationSkip}</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
