import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAccount } from "@/modules/account/hooks/useAccount";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { verticalScale } from "@/shared/utils/scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "@/shared/hooks/useToast";
import { useLoading } from "@/shared/hooks/useLoading";
import { Toast } from "@/shared/components/Toast";

import styles from "./styles";
import {
  emailContactSchema,
  phoneContactSchema,
  type ContactFormValues,
  type ContactChangeScreenParams,
} from "./types";

type Step = "enter-contact" | "enter-otp";

const OTP_LENGTH = 4;
const OTP_TTL_SECONDS = 300;

function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 3) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

function formatDestinationDisplay(destination: string, isEmail: boolean): string {
  if (isEmail) return destination;
  const digits = destination.replace(/\D/g, "");
  const number = digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;
  return formatPhoneDisplay(number);
}

function maskDestination(destination: string, isEmail: boolean): string {
  if (isEmail) {
    const atIndex = destination.indexOf("@");
    if (atIndex < 0) return "***";
    const local = destination.slice(0, atIndex);
    const domain = destination.slice(atIndex);
    const visible = local.slice(0, Math.min(2, local.length));
    return `${visible}${"*".repeat(Math.max(3, local.length - 2))}${domain}`;
  }
  const digits = destination.replace(/\D/g, "");
  const number = digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;
  if (number.length === 0) return "—";
  const area = number.slice(0, 2);
  const last4 = number.slice(-4);
  if (number.length === 11) return `(${area}) ${number[2]} ****-${last4}`;
  return `(${area}) ****-${last4}`;
}

export default function ContactChangeScreen() {
  const insets = useSafeAreaInsets();
  const { account } = useLocale<LocaleKeys>();
  const { type } = useLocalSearchParams<ContactChangeScreenParams>();
  const { checkContactAvailability, initiateContactChange, confirmContactChange } = useAccount();
  const { toast, toastOpacity, showToast } = useToast();
  const { isLoading } = useLoading();

  const [step, setStep] = useState<Step>("enter-contact");
  const [contactId, setContactId] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [contactFocused, setContactFocused] = useState(false);
  const [otpCode, setOtpCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(OTP_TTL_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const contactType = type ?? "email";
  const isEmail = contactType === "email";
  const title = isEmail ? account.changeEmailTitle : account.changePhoneTitle;
  const placeholder = isEmail ? account.newEmailPlaceholder : account.newPhonePlaceholder;
  const activeContactSchema = isEmail ? emailContactSchema : phoneContactSchema;

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(activeContactSchema),
    defaultValues: { contact: "" },
  });

  useEffect(() => {
    if (step !== "enter-otp") return;
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, countdown]);

  function handleCodeChange(index: number, value: string): void {
    if (value.length > 1) return;
    const next = [...otpCode];
    next[index] = value;
    setOtpCode(next);
    setOtpError("");
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(index: number, key: string): void {
    if (key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = [...otpCode];
      next[index - 1] = "";
      setOtpCode(next);
    }
  }

  async function onContactSubmit(values: ContactFormValues): Promise<void> {
    try {
      const contact = isEmail ? values.contact : `+55${values.contact}`;
      const available = await checkContactAvailability({ contact, type: contactType });
      if (!available) {
        contactForm.setError("contact", { message: account.alreadyInUse });
        return;
      }
      const result = await initiateContactChange({ contact, type: contactType });
      setContactId(result.contactId);
      setDestination(result.destination);
      setCountdown(OTP_TTL_SECONDS);
      setCanResend(false);
      setOtpCode(Array(OTP_LENGTH).fill(""));
      setStep("enter-otp");
    } catch (error: any) {
      if (error?.response?.status === 409) {
        contactForm.setError("contact", {
          message: isEmail
            ? "E-mail já cadastrado para outro usuário"
            : "Telefone já cadastrado para outro usuário",
        });
        return;
      }
      showToast("Não foi possível enviar o código. Tente novamente.", "error");
    }
  }

  async function handleVerify(): Promise<void> {
    const code = otpCode.join("");
    if (code.length !== OTP_LENGTH) return;

    setVerifying(true);
    setOtpError("");
    try {
      await confirmContactChange({
        contactId,
        code,
        type: contactType,
        newContact: destination,
      });
      showToast(account.changeSuccess, "success");
      setTimeout(() => router.back(), 1500);
    } catch {
      setOtpError("Código inválido ou expirado. Tente novamente.");
      setOtpCode(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend(): Promise<void> {
    try {
      const rawContact = contactForm.getValues("contact");
      const contact = isEmail ? rawContact : `+55${rawContact}`;
      const result = await initiateContactChange({ contact, type: contactType });
      setContactId(result.contactId);
      setDestination(result.destination);
      setCountdown(OTP_TTL_SECONDS);
      setCanResend(false);
      setOtpCode(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      showToast("Novo código enviado.", "success");
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      showToast("Não foi possível reenviar o código. Tente novamente.", "error");
    }
  }

  const contactValue = contactForm.watch("contact");
  const isContactReady = isEmail
    ? contactValue.trim().length > 0
    : contactValue.length >= 10;
  const isCodeComplete = otpCode.every((d) => d !== "");

  const countdownMinutes = Math.floor(countdown / 60);
  const countdownSeconds = countdown % 60;
  const countdownLabel = `${countdownMinutes}:${String(countdownSeconds).padStart(2, "0")}`;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {step === "enter-contact" && (
          <>
            <Text style={styles.descriptionText}>
              {isEmail
                ? "Informe o novo e-mail que deseja usar na sua conta."
                : "Informe o novo telefone que deseja usar na sua conta."}
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {isEmail ? "Novo e-mail" : "Novo telefone"}
              </Text>

              {isEmail ? (
                <TextInput
                  style={[styles.input, contactFocused && styles.inputFocused]}
                  placeholder={placeholder}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={contactValue}
                  onChangeText={(text) =>
                    contactForm.setValue("contact", text, { shouldValidate: true })
                  }
                  onFocus={() => setContactFocused(true)}
                  onBlur={() => setContactFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  testID="contact-input"
                />
              ) : (
                <View style={[styles.phoneInputRow, contactFocused && styles.phoneInputRowFocused]}>
                  <View style={styles.phonePrefix}>
                    <Text>🇧🇷</Text>
                    <Text style={styles.phonePrefixText}>+55</Text>
                  </View>
                  <TextInput
                    style={styles.phoneTextInput}
                    placeholder="(16) 9 1234-5678"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={formatPhoneDisplay(contactValue)}
                    onChangeText={(text) => {
                      const digits = text.replace(/\D/g, "").slice(0, 11);
                      contactForm.setValue("contact", digits, { shouldValidate: true });
                    }}
                    onFocus={() => setContactFocused(true)}
                    onBlur={() => setContactFocused(false)}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                    testID="contact-input"
                  />
                </View>
              )}

              {contactForm.formState.errors.contact && (
                <Text style={styles.errorText}>
                  {contactForm.formState.errors.contact.message}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (contactForm.formState.isSubmitting || !isContactReady) &&
                  styles.primaryButtonDisabled,
              ]}
              onPress={contactForm.handleSubmit(onContactSubmit)}
              disabled={contactForm.formState.isSubmitting || !isContactReady || isLoading}
              testID="send-code-button"
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {contactForm.formState.isSubmitting
                  ? account.sendingCodeButton
                  : account.sendCodeButton}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {step === "enter-otp" && (
          <>
            <View style={styles.destinationCard}>
              <Text style={styles.destinationLabel}>Código enviado para</Text>
              <Text style={styles.destinationValue}>
                {maskDestination(destination, isEmail)}
              </Text>
            </View>

            <View style={styles.otpRow}>
              {Array(OTP_LENGTH)
                .fill(null)
                .map((_, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={[styles.otpBox, otpCode[index] ? styles.otpBoxFilled : undefined]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={otpCode[index]}
                    onChangeText={(value) => handleCodeChange(index, value)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                    testID={`otp-input-${index}`}
                  />
                ))}
            </View>

            {otpError ? (
              <Text style={[styles.errorText, { textAlign: "center" }]}>{otpError}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!isCodeComplete || verifying) && styles.primaryButtonDisabled,
              ]}
              onPress={handleVerify}
              disabled={!isCodeComplete || verifying || isLoading}
              testID="confirm-button"
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {verifying ? account.confirmingButton : account.confirmButton}
              </Text>
            </TouchableOpacity>

            <View style={styles.resendSection}>
              {canResend ? (
                <TouchableOpacity onPress={handleResend} disabled={isLoading} testID="resend-code-button">
                  <Text style={styles.resendLink}>{account.resendCode}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.countdownBadge}>
                  <Text style={styles.resendText}>
                    {`Reenviar em ${countdownLabel}`}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <Toast toast={toast} opacity={toastOpacity} />
    </KeyboardAvoidingView>
  );
}
