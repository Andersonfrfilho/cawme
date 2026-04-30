import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { useVerification } from "@/modules/auth/hooks/useVerification";
import { styles } from "./styles";
import type { VerificationScreenParams, VerificationTarget } from "./types";

const CODE_LENGTH = 4;

export default function VerificationScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const params = useLocalSearchParams<VerificationScreenParams>();
  const { sendCode, verifyCode } = useVerification();
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

  const [target, setTarget] = useState<VerificationTarget>("email");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    handleSendCode();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    setCanResend(true);
  }, [countdown]);

  const handleSendCode = async () => {
    setLoading(true);
    setError("");
    try {
      const targetValue = target === "email" ? params.email : params.phone;
      await sendCode({ type: target, target: targetValue });
      setCountdown(60);
      setCanResend(false);
    } catch {
      setError(auth.verificationSendError);
    } finally {
      setLoading(false);
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
      const targetValue = target === "email" ? params.email : params.phone;
      const result = await verifyCode({ type: target, target: targetValue, code: fullCode });

      if (result.verified) {
        router.replace({
          pathname: "/register-success" as any,
          params: { email: params.email },
        });
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

  const isCodeComplete = code.every((digit) => digit !== "");

  const formatMessage = (template: string, value: string) =>
    template.replace("{target}", value);

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <View style={[styles.header, { paddingTop: verticalScale(60) + insets.top }]}>
          <Text style={styles.headerTitle}>{auth.verificationTitle}</Text>
          <Text style={styles.headerSubtitle}>{auth.verificationSubtitle}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, target === "email" && styles.tabActive]}
              onPress={() => {
                setTarget("email");
                setCode(Array(CODE_LENGTH).fill(""));
                handleSendCode();
              }}
            >
              <Text style={[styles.tabText, target === "email" && styles.tabTextActive]}>
                {auth.verificationEmailTab}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, target === "phone" && styles.tabActive]}
              onPress={() => {
                setTarget("phone");
                setCode(Array(CODE_LENGTH).fill(""));
                handleSendCode();
              }}
            >
              <Text style={[styles.tabText, target === "phone" && styles.tabTextActive]}>
                {auth.verificationPhoneTab}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.targetInfo}>
            {target === "email"
              ? formatMessage(auth.verificationEmailSent, params.email)
              : formatMessage(auth.verificationPhoneSent, params.phone)}
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
                  style={[
                    styles.codeInput,
                    code[index] && styles.codeInputFilled,
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={code[index]}
                  onChangeText={(value) => handleCodeChange(index, value)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(index, nativeEvent.key)
                  }
                />
              ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.verifyButton, (!isCodeComplete || loading) && styles.verifyButtonDisabled]}
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
                <Text style={styles.resendLink} onPress={handleSendCode}>
                  {auth.verificationResend}
                </Text>
              ) : (
                auth.verificationResendCountdown.replace("{seconds}", countdown.toString())
              )}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
