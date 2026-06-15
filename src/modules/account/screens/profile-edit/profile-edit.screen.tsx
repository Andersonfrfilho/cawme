import { zodResolver } from "@hookform/resolvers/zod";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "@/shared/hooks/useToast";
import { useLoading } from "@/shared/hooks/useLoading";
import { Toast } from "@/shared/components/Toast";

import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useAccount } from "@/modules/account/hooks/useAccount";
import {
  AccountService,
  type UserAddress,
  type ProviderPaymentMethod,
  type ProviderServiceSummaryItem,
  type ProviderAvailabilitySummaryItem,
  type AccountDocumentItem,
} from "@/modules/account/services/account.service";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

import styles from "./styles";
import { profileEditSchema, type ProfileEditFormValues } from "./types";

function formatPhoneForDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const number = digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;
  const d = number.slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d})`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

function maskEmail(email: string): string {
  const atIndex = email.indexOf("@");
  if (atIndex < 0) return "***";
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex);
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"*".repeat(Math.max(3, local.length - 2))}${domain}`;
}

function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const number = digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;
  if (number.length === 0) return "—";
  const area = number.slice(0, 2);
  const last4 = number.slice(-4);
  if (number.length === 11) return `(${area}) ${number[2]} ****-${last4}`;
  return `(${area}) ****-${last4}`;
}

export default function ProfileEditScreen() {
  const insets = useSafeAreaInsets();
  const { account } = useLocale<LocaleKeys>();
  const user = useAuthStore((state) => state.user);
  const { updateName } = useAccount();
  const { toast, toastOpacity, showToast } = useToast();
  const { isLoading } = useLoading();

  const [nameFocused, setNameFocused] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [providerServices, setProviderServices] = useState<ProviderServiceSummaryItem[]>([]);
  const [providerAvailability, setProviderAvailability] = useState<ProviderAvailabilitySummaryItem[]>([]);
  const [providerPaymentMethods, setProviderPaymentMethods] = useState<ProviderPaymentMethod[]>([]);
  const [documents, setDocuments] = useState<AccountDocumentItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      AccountService.listAddresses().then(setAddresses).catch(() => {});
      AccountService.listAccountDocuments().then(setDocuments).catch(() => {});
      if (user?.type === "provider") {
        AccountService.listProviderServices().then(setProviderServices).catch(() => {});
        AccountService.listProviderAvailability().then(setProviderAvailability).catch(() => {});
        AccountService.listProviderPaymentMethods().then(setProviderPaymentMethods).catch(() => {});
      }
    }, [user?.type]),
  );

  const showAll = showEmail && showPhone;
  const hasPhone = !!user?.phone;

  function toggleAll(): void {
    const next = !showAll;
    setShowEmail(next);
    setShowPhone(next);
  }

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: { fullName: user?.name ?? "" },
  });

  const fullName = watch("fullName");

  async function onSubmit(values: ProfileEditFormValues): Promise<void> {
    try {
      await updateName({ fullName: values.fullName });
      showToast(account.saveSuccess, "success");
    } catch {
      showToast("Não foi possível atualizar o perfil. Tente novamente.", "error");
    }
  }

  function handleEmailChange(): void {
    router.push({
      pathname: "/(app)/account/contact-change" as any,
      params: { type: "email", currentContact: user?.email ?? "" },
    });
  }

  function handlePhoneChange(): void {
    router.push({
      pathname: "/(app)/account/contact-change" as any,
      params: { type: "phone", currentContact: user?.phone ?? "" },
    });
  }

  function handleAddressChange(): void {
    router.push({ pathname: "/(app)/account/address-list" as any });
  }

  function handleDocumentChange(): void {
    router.push({ pathname: "/(app)/account/document-list" as any });
  }

  function handleProviderServices(): void {
    router.push({ pathname: "/(app)/account/provider-services" as any });
  }

  function handleProviderAvailability(): void {
    router.push({ pathname: "/(app)/account/provider-availability" as any });
  }

  function handleProviderPaymentMethods(): void {
    router.push({ pathname: "/(app)/account/provider-payment-methods" as any });
  }

  const DAY_ABBR = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

  const activeServices = providerServices.filter((s) => s.isActive);
  const servicesSummary = activeServices.length > 0
    ? {
        count: `${activeServices.length} ${activeServices.length === 1 ? "serviço ativo" : "serviços ativos"}`,
        detail: [...new Set(activeServices.map((s) => s.categoryName))].slice(0, 3).join(" • "),
      }
    : null;

  const activeDays = [...new Set(providerAvailability.filter((a) => a.isActive).map((a) => a.dayOfWeek))].sort((a, b) => a - b);
  const availabilitySummary = activeDays.length > 0
    ? {
        count: `${activeDays.length} ${activeDays.length === 1 ? "dia configurado" : "dias configurados"}`,
        detail: activeDays.map((d) => DAY_ABBR[d]).join(", "),
      }
    : null;

  const enabledPaymentMethods = providerPaymentMethods.filter((m) => m.isEnabled);
  const paymentSummary = enabledPaymentMethods.length > 0
    ? {
        count: `${enabledPaymentMethods.length} ${enabledPaymentMethods.length === 1 ? "forma ativa" : "formas ativas"}`,
        detail: enabledPaymentMethods.map((m) => m.label).join(" • "),
      }
    : null;

  const DOC_TYPE_LABEL: Record<string, string> = { RG: "RG", CNH: "CNH", CPF: "CPF", PASSPORT: "Passaporte" };
  const documentSummary = documents.length > 0
    ? {
        count: `${documents.length} ${documents.length === 1 ? "documento" : "documentos"}`,
        detail: documents.map((d) => DOC_TYPE_LABEL[d.documentType] ?? d.documentType).join(" • "),
        hasPending: documents.some((d) => d.status === "PENDING"),
      }
    : null;

  const displayEmail = user?.email
    ? showEmail
      ? user.email
      : maskEmail(user.email)
    : "—";

  const displayPhone = user?.phone
    ? showPhone
      ? formatPhoneForDisplay(user.phone)
      : maskPhone(user.phone)
    : "—";

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{account.editTitle}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{account.nameLabel}</Text>
          <TextInput
            style={[styles.input, nameFocused && styles.inputFocused]}
            placeholder={account.namePlaceholder}
            placeholderTextColor={theme.colors.text.secondary}
            value={fullName}
            onChangeText={(text) => setValue("fullName", text, { shouldValidate: true })}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            autoCorrect={false}
            testID="full-name-input"
          />
          {errors.fullName && (
            <Text style={{ fontSize: moderateScale(12, 0.3), color: theme.colors.status.error }}>
              {errors.fullName.message}
            </Text>
          )}
        </View>

        {fullName.trim() !== (user?.name ?? "").trim() && (
          <TouchableOpacity
            style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting || isLoading}
            testID="save-button"
            activeOpacity={0.85}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? account.savingButton : account.saveButton}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.sectionDivider} />

        <View style={styles.contactSectionHeader}>
          <Text style={styles.label}>Contato</Text>
          <TouchableOpacity onPress={toggleAll} style={styles.showAllButton} hitSlop={8}>
            <Ionicons
              name={showAll ? "eye-off-outline" : "eye-outline"}
              size={moderateScale(14, 0.3)}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.showAllText}>
              {showAll ? "Ocultar" : "Mostrar tudo"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{account.emailLabel}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactValue} numberOfLines={1}>
              {displayEmail}
            </Text>
            <TouchableOpacity
              onPress={() => setShowEmail((v) => !v)}
              style={styles.eyeButton}
              hitSlop={8}
              testID="toggle-email-visibility"
            >
              <Ionicons
                name={showEmail ? "eye-off-outline" : "eye-outline"}
                size={moderateScale(18, 0.3)}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleEmailChange}
              style={styles.chevronButton}
              disabled={isLoading}
              hitSlop={8}
              testID="change-email-button"
            >
              <Ionicons
                name="chevron-forward"
                size={moderateScale(16, 0.3)}
                color={theme.colors.primary.DEFAULT}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{account.phoneLabel}</Text>
          <View style={styles.contactRow}>
            {hasPhone && <Text style={styles.contactFlag}>🇧🇷</Text>}
            <Text style={styles.contactValue} numberOfLines={1}>
              {displayPhone}
            </Text>
            {hasPhone && (
              <TouchableOpacity
                onPress={() => setShowPhone((v) => !v)}
                style={styles.eyeButton}
                hitSlop={8}
                testID="toggle-phone-visibility"
              >
                <Ionicons
                  name={showPhone ? "eye-off-outline" : "eye-outline"}
                  size={moderateScale(18, 0.3)}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handlePhoneChange}
              style={styles.chevronButton}
              disabled={isLoading}
              hitSlop={8}
              testID="change-phone-button"
            >
              <Ionicons
                name="chevron-forward"
                size={moderateScale(16, 0.3)}
                color={theme.colors.primary.DEFAULT}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{account.addressLabel}</Text>
          <TouchableOpacity
            style={[styles.contactRow, styles.contactRowTall]}
            onPress={handleAddressChange}
            disabled={isLoading}
            testID="change-address-button"
            activeOpacity={0.7}
          >
            <View style={styles.contactValueWrapper}>
              {(() => {
                const primary = addresses.find((a) => a.isPrimary);
                if (primary) {
                  return (
                    <>
                      <Text style={styles.contactValue} numberOfLines={1} ellipsizeMode="tail">
                        {primary.label}
                      </Text>
                      <Text style={styles.contactSubValue} numberOfLines={1} ellipsizeMode="tail">
                        {`${primary.street}, ${primary.number} — ${primary.city}/${primary.state}`}
                      </Text>
                    </>
                  );
                }
                return (
                  <Text style={styles.contactValue} numberOfLines={1}>
                    {account.tapToChange}
                  </Text>
                );
              })()}
              {addresses.length > 0 && (
                <Text style={styles.contactAddressCount}>
                  {addresses.length === 1
                    ? "1 endereço cadastrado"
                    : `${addresses.length} endereços cadastrados`}
                </Text>
              )}
            </View>
            <Ionicons
              name="chevron-forward"
              size={moderateScale(16, 0.3)}
              color={theme.colors.primary.DEFAULT}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{account.documentLabel}</Text>
          <TouchableOpacity
            style={[styles.contactRow, documentSummary && styles.contactRowTall]}
            onPress={handleDocumentChange}
            disabled={isLoading}
            testID="change-document-button"
            activeOpacity={0.7}
          >
            <View style={styles.contactValueWrapper}>
              {documentSummary ? (
                <>
                  <Text style={styles.contactValue}>{documentSummary.count}</Text>
                  <Text style={styles.contactSubValue} numberOfLines={1}>{documentSummary.detail}</Text>
                  {documentSummary.hasPending && (
                    <View style={styles.pendingBadge}>
                      <Ionicons name="time-outline" size={moderateScale(11, 0.3)} color={theme.palette.neutral[0]} />
                      <Text style={styles.pendingBadgeText}>Em análise</Text>
                    </View>
                  )}
                </>
              ) : (
                <Text style={styles.contactValue} numberOfLines={1}>{account.tapToChange}</Text>
              )}
            </View>
            <Ionicons
              name="chevron-forward"
              size={moderateScale(16, 0.3)}
              color={theme.colors.primary.DEFAULT}
            />
          </TouchableOpacity>
        </View>

        {user?.type === "provider" && (
          <>
            <View style={styles.sectionDivider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{account.providerServicesLabel}</Text>
              <TouchableOpacity
                style={[styles.contactRow, servicesSummary && styles.contactRowTall]}
                onPress={handleProviderServices}
                disabled={isLoading}
                testID="provider-services-button"
                activeOpacity={0.7}
              >
                <View style={styles.contactValueWrapper}>
                  {servicesSummary ? (
                    <>
                      <Text style={styles.contactValue}>{servicesSummary.count}</Text>
                      <Text style={styles.contactSubValue} numberOfLines={1}>{servicesSummary.detail}</Text>
                    </>
                  ) : (
                    <Text style={styles.contactValue}>{account.tapToChange}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={moderateScale(16, 0.3)} color={theme.colors.primary.DEFAULT} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{account.providerAvailabilityLabel}</Text>
              <TouchableOpacity
                style={[styles.contactRow, availabilitySummary && styles.contactRowTall]}
                onPress={handleProviderAvailability}
                disabled={isLoading}
                testID="provider-availability-button"
                activeOpacity={0.7}
              >
                <View style={styles.contactValueWrapper}>
                  {availabilitySummary ? (
                    <>
                      <Text style={styles.contactValue}>{availabilitySummary.count}</Text>
                      <Text style={styles.contactSubValue}>{availabilitySummary.detail}</Text>
                    </>
                  ) : (
                    <Text style={styles.contactValue}>{account.tapToChange}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={moderateScale(16, 0.3)} color={theme.colors.primary.DEFAULT} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{account.providerPaymentMethodsLabel}</Text>
              <TouchableOpacity
                style={[styles.contactRow, paymentSummary && styles.contactRowTall]}
                onPress={handleProviderPaymentMethods}
                disabled={isLoading}
                testID="provider-payment-methods-button"
                activeOpacity={0.7}
              >
                <View style={styles.contactValueWrapper}>
                  {paymentSummary ? (
                    <>
                      <Text style={styles.contactValue}>{paymentSummary.count}</Text>
                      <Text style={styles.contactSubValue} numberOfLines={1}>{paymentSummary.detail}</Text>
                    </>
                  ) : (
                    <Text style={styles.contactValue}>{account.tapToChange}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={moderateScale(16, 0.3)} color={theme.colors.primary.DEFAULT} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <Toast toast={toast} opacity={toastOpacity} />
    </View>
  );
}
