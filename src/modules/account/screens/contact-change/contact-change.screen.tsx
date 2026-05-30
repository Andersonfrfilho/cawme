import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

import { useAccount } from "@/modules/account/hooks/useAccount";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import styles from "./styles";
import {
  contactSchema,
  type ContactFormValues,
  type ContactChangeScreenParams,
  type OtpFormValues,
} from "./types";

type Step = "enter-contact" | "enter-otp";

export default function ContactChangeScreen() {
  const insets = useSafeAreaInsets();
  const { account } = useLocale<LocaleKeys>();
  const { type, currentContact } = useLocalSearchParams<ContactChangeScreenParams>();
  const { checkContactAvailability, initiateContactChange, confirmContactChange } = useAccount();

  const [step, setStep] = useState<Step>("enter-contact");
  const [contactId, setContactId] = useState<string>("");
  const [destination, setDestination] = useState<string>("");

  const [contactFocused, setContactFocused] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);

  const isEmail = type === "email";
  const title = isEmail ? account.changeEmailTitle : account.changePhoneTitle;
  const placeholder = isEmail ? account.newEmailPlaceholder : account.newPhonePlaceholder;
  const otpCodeLength = isEmail ? 4 : 6;
  const otpSchema = z.object({
    code: z.string().length(otpCodeLength, `Código deve ter ${otpCodeLength} dígitos`),
  });

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { contact: "" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  async function onContactSubmit(values: ContactFormValues): Promise<void> {
    try {
      const available = await checkContactAvailability({
        contact: values.contact,
        type: type ?? "email",
      });
      if (!available) {
        contactForm.setError("contact", { message: account.alreadyInUse });
        return;
      }
      const result = await initiateContactChange({
        contact: values.contact,
        type: type ?? "email",
      });
      setContactId(result.contactId);
      setDestination(result.destination);
      setStep("enter-otp");
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      Alert.alert("Erro", `Não foi possível enviar o código: ${detail}`);
    }
  }

  async function onOtpSubmit(values: OtpFormValues): Promise<void> {
    try {
      await confirmContactChange({
        contactId,
        code: values.code,
        type: type ?? "email",
      });
      Alert.alert("", account.changeSuccess, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("", "Código inválido ou expirado. Tente novamente.");
    }
  }

  async function handleResend(): Promise<void> {
    try {
      const contactValue = contactForm.getValues("contact");
      const result = await initiateContactChange({
        contact: contactValue,
        type: type ?? "email",
      });
      setContactId(result.contactId);
      setDestination(result.destination);
      Alert.alert("", "Novo código enviado.");
    } catch {
      Alert.alert("", "Não foi possível reenviar o código.");
    }
  }

  const contactValue = contactForm.watch("contact");
  const otpValue = otpForm.watch("code");

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
        contentContainerStyle={{ paddingBottom: moderateScale(32, 0.5) }}
        keyboardShouldPersistTaps="handled"
      >
        {step === "enter-contact" && (
          <>
            <Text style={styles.descriptionText}>
              {isEmail
                ? "Informe o novo e-mail que deseja usar na sua conta."
                : "Informe o novo telefone que deseja usar na sua conta."}
            </Text>

            <TextInput
              style={[styles.input, contactFocused && styles.inputFocused]}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.text.secondary}
              value={contactValue}
              onChangeText={(text) =>
                contactForm.setValue("contact", text, { shouldValidate: true })
              }
              onFocus={() => setContactFocused(true)}
              onBlur={() => setContactFocused(false)}
              keyboardType={isEmail ? "email-address" : "phone-pad"}
              autoCapitalize="none"
              autoCorrect={false}
              testID="contact-input"
            />
            {contactForm.formState.errors.contact && (
              <Text style={styles.errorText}>
                {contactForm.formState.errors.contact.message}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (contactForm.formState.isSubmitting || !contactValue.trim()) &&
                  styles.primaryButtonDisabled,
              ]}
              onPress={contactForm.handleSubmit(onContactSubmit)}
              disabled={contactForm.formState.isSubmitting || !contactValue.trim()}
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
            <Text style={styles.sentToText}>
              {account.otpSentTo}{" "}
              <Text style={styles.sentToValue}>{destination}</Text>
            </Text>

            <TextInput
              style={[styles.otpInput, otpFocused && styles.otpInputFocused]}
              placeholder={account.otpPlaceholder}
              placeholderTextColor={theme.colors.text.secondary}
              value={otpValue}
              onChangeText={(text) =>
                otpForm.setValue("code", text.replace(/\D/g, "").slice(0, otpCodeLength), {
                  shouldValidate: true,
                })
              }
              onFocus={() => setOtpFocused(true)}
              onBlur={() => setOtpFocused(false)}
              keyboardType="number-pad"
              maxLength={otpCodeLength}
              testID="otp-input"
            />
            {otpForm.formState.errors.code && (
              <Text style={styles.errorText}>
                {otpForm.formState.errors.code.message}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (otpForm.formState.isSubmitting || otpValue.length !== otpCodeLength) &&
                  styles.primaryButtonDisabled,
              ]}
              onPress={otpForm.handleSubmit(onOtpSubmit)}
              disabled={otpForm.formState.isSubmitting || otpValue.length !== otpCodeLength}
              testID="confirm-button"
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {otpForm.formState.isSubmitting
                  ? account.confirmingButton
                  : account.confirmButton}
              </Text>
            </TouchableOpacity>

            <View style={styles.resendRow}>
              <TouchableOpacity onPress={handleResend} testID="resend-code-button">
                <Text style={styles.resendText}>{account.resendCode}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
