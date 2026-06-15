import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useToast } from "@/shared/hooks/useToast";
import { Toast } from "@/shared/components/Toast";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { scale, verticalScale, moderateScale } from "@/shared/utils/scale";
import {
  AccountService,
  type CardBrand,
  type PaymentMethodType,
  type PixKeyType,
  type SetProviderPaymentMethodEntry,
} from "@/modules/account/services/account.service";

import { BankLogo, BankInfo, BANKS, getBankByName, getMatchingBanks } from "./bank-logos";
import { CardBrandLogo } from "./card-brand-logos";
import styles from "./styles";

const PIX_NAME = "PIX";
const BANK_TRANSFER_NAME = "BANK_TRANSFER";
const CREDIT_CARD_NAME = "CREDIT_CARD";
const DEBIT_CARD_NAME = "DEBIT_CARD";


const PIX_KEY_TYPE_LABELS: Record<PixKeyType, string> = {
  cpf: "CPF",
  cnpj: "CNPJ",
  email: "E-mail",
  phone: "Telefone",
  random: "Aleatória",
};

const PIX_KEY_PLACEHOLDERS: Record<PixKeyType, string> = {
  cpf: "000.000.000-00",
  cnpj: "00.000.000/0001-00",
  email: "seu@email.com",
  phone: "(00) 00000-0000",
  random: "Cole sua chave aleatória",
};

const CARD_BRANDS: CardBrand[] = ["visa", "mastercard", "elo", "hipercard", "amex"];

// Brand identity colors — necessarily external hex values (border highlight on active pill)
const CARD_BRAND_COLORS: Record<CardBrand, string> = {
  visa: "#1A1F71",
  mastercard: "#EB001B",
  elo: "#00A4E0",
  hipercard: "#B3131B",
  amex: "#2E77BC",
};

function formatPixKey(keyType: PixKeyType, value: string): string {
  switch (keyType) {
    case "cpf": {
      const d = value.replace(/\D/g, "").slice(0, 11);
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
      if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
      return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
    }
    case "cnpj": {
      const d = value.replace(/\D/g, "").slice(0, 14);
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
      if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
      if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
      return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
    }
    case "phone": {
      const d = value.replace(/\D/g, "").slice(0, 11);
      if (d.length === 0) return "";
      if (d.length <= 2) return `(${d}`;
      if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }
    default:
      return value;
  }
}

function getPixKeyboardType(keyType: PixKeyType) {
  if (keyType === "cpf" || keyType === "cnpj") return "numeric" as const;
  if (keyType === "phone") return "phone-pad" as const;
  if (keyType === "email") return "email-address" as const;
  return "default" as const;
}

type MethodState = {
  selected: boolean;
  pixKeyType: PixKeyType;
  pixKey: string;
  bank: string;
  selectedBank: BankInfo | null;
  agency: string;
  account: string;
  accountType: "checking" | "savings";
  acceptedBrands: CardBrand[];
};

function buildDefaultState(
  _type: PaymentMethodType,
  existing?: SetProviderPaymentMethodEntry,
): MethodState {
  const details = existing?.details ?? null;
  const isPixDetails = details && "pixKey" in details;
  const isBankDetails = details && "agency" in details;
  const isCardDetails = details && "acceptedBrands" in details;

  const bankName: string = isBankDetails ? ((details as any).bank ?? "") : "";
  return {
    selected: !!existing,
    pixKeyType: isPixDetails ? ((details as any).pixKeyType ?? "cpf") : "cpf",
    pixKey: isPixDetails ? ((details as any).pixKey ?? "") : "",
    bank: bankName,
    selectedBank: getBankByName(bankName),
    agency: isBankDetails ? ((details as any).agency ?? "") : "",
    account: isBankDetails ? ((details as any).account ?? "") : "",
    accountType: isBankDetails ? ((details as any).accountType ?? "checking") : "checking",
    acceptedBrands: isCardDetails ? ((details as any).acceptedBrands ?? []) : [],
  };
}

function CardPreview({ brands }: { brands: CardBrand[] }) {
  return (
    <View style={styles.cardPreview}>
      <View style={styles.cardChip} />
      <View>
        {brands.length > 0 ? (
          <>
            <Text style={styles.cardAcceptsLabel}>BANDEIRAS ACEITAS</Text>
            <View style={styles.cardBrandRow}>
              {brands.map((brand) => (
                <CardBrandLogo key={brand} brand={brand} size={scale(32)} />
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.cardEmptyLabel}>Selecione as bandeiras aceitas</Text>
        )}
      </View>
    </View>
  );
}

export default function ProviderPaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const { account } = useLocale<LocaleKeys>();
  const { toast, toastOpacity, showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [types, setTypes] = useState<PaymentMethodType[]>([]);
  const [state, setState] = useState<Record<string, MethodState>>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [pixKeyChecking, setPixKeyChecking] = useState<Record<string, boolean>>({});
  const [pixKeyErrors, setPixKeyErrors] = useState<Record<string, string | null>>({});
  const [bankDropdownVisible, setBankDropdownVisible] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        setIsLoading(true);
        try {
          const [allTypes, current] = await Promise.all([
            AccountService.listPaymentMethodTypes(),
            AccountService.listProviderPaymentMethods().catch(() => []),
          ]);

          if (!active) return;

          setTypes(allTypes);

          const currentByTypeId = Object.fromEntries(
            current.map((method) => [
              method.paymentMethodTypeId,
              {
                paymentMethodTypeId: method.paymentMethodTypeId,
                details: method.details,
              } as SetProviderPaymentMethodEntry,
            ]),
          );

          const initialState: Record<string, MethodState> = {};
          for (const type of allTypes) {
            initialState[type.id] = buildDefaultState(type, currentByTypeId[type.id]);
          }
          setState(initialState);
        } catch {
          showToast(account.providerPaymentMethodsLoadError, "error");
        } finally {
          if (active) setIsLoading(false);
        }
      }

      load();
      return () => {
        active = false;
      };
    }, []),
  );

  function toggleMethod(typeId: string) {
    setState((prev) => ({
      ...prev,
      [typeId]: { ...prev[typeId], selected: !prev[typeId].selected },
    }));
  }

  function updateField(typeId: string, field: keyof MethodState, value: string) {
    setState((prev) => ({
      ...prev,
      [typeId]: {
        ...prev[typeId],
        [field]: value,
        ...(field === "bank" ? { selectedBank: null } : {}),
      },
    }));
  }

  function selectBank(typeId: string, bank: BankInfo) {
    setState((prev) => ({
      ...prev,
      [typeId]: { ...prev[typeId], bank: bank.name, selectedBank: bank },
    }));
  }

  function updatePixKeyType(typeId: string, pixKeyType: PixKeyType) {
    setState((prev) => ({
      ...prev,
      [typeId]: { ...prev[typeId], pixKeyType, pixKey: "" },
    }));
    setPixKeyErrors((prev) => ({ ...prev, [typeId]: null }));
  }

  async function checkPixKey(typeId: string, pixKey: string) {
    if (!pixKey.trim()) return;
    setPixKeyChecking((prev) => ({ ...prev, [typeId]: true }));
    setPixKeyErrors((prev) => ({ ...prev, [typeId]: null }));
    try {
      const result = await AccountService.checkPixKeyAvailability(pixKey);
      if (!result.available) {
        setPixKeyErrors((prev) => ({ ...prev, [typeId]: account.providerPaymentMethodsPixKeyTaken }));
      }
    } catch {
      // silent — save-time validation is the fallback
    } finally {
      setPixKeyChecking((prev) => ({ ...prev, [typeId]: false }));
    }
  }

  function toggleBrand(typeId: string, brand: CardBrand) {
    setState((prev) => {
      const current = prev[typeId].acceptedBrands;
      const acceptedBrands = current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand];
      return { ...prev, [typeId]: { ...prev[typeId], acceptedBrands } };
    });
  }

  async function handleSave() {
    const methods: SetProviderPaymentMethodEntry[] = [];

    for (const type of types) {
      const methodState = state[type.id];
      if (!methodState?.selected) continue;

      let details: SetProviderPaymentMethodEntry["details"] = null;

      if (type.name === PIX_NAME) {
        details = { pixKeyType: methodState.pixKeyType, pixKey: methodState.pixKey };
      } else if (type.name === BANK_TRANSFER_NAME) {
        details = {
          bank: methodState.bank,
          agency: methodState.agency,
          account: methodState.account,
          accountType: methodState.accountType,
        };
      } else if (type.name === CREDIT_CARD_NAME || type.name === DEBIT_CARD_NAME) {
        details =
          methodState.acceptedBrands.length > 0
            ? { acceptedBrands: methodState.acceptedBrands }
            : null;
      }

      methods.push({ paymentMethodTypeId: type.id, details });
    }

    setIsSaving(true);
    try {
      await AccountService.setProviderPaymentMethods(methods);
      showToast(account.providerPaymentMethodsSaveSuccess, "success");
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        showToast(account.providerPaymentMethodsPixKeyTaken, "error");
      } else {
        showToast(account.providerPaymentMethodsSaveError, "error");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={scale(24)} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{account.providerPaymentMethodsTitle}</Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={theme.colors.primary.DEFAULT} />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.subtitle}>{account.providerPaymentMethodsSubtitle}</Text>

          {types.map((type) => {
            const methodState = state[type.id];
            const isSelected = methodState?.selected ?? false;
            const isCard =
              type.name === CREDIT_CARD_NAME || type.name === DEBIT_CARD_NAME;

            return (
              <View
                key={type.id}
                style={[styles.methodCard, isSelected && styles.methodCardSelected]}
              >
                <TouchableOpacity
                  style={styles.methodRow}
                  onPress={() => toggleMethod(type.id)}
                  activeOpacity={0.7}
                  testID={`payment-method-${type.name}`}
                >
                  <View
                    style={[
                      styles.methodIconWrapper,
                      isSelected && styles.methodIconWrapperSelected,
                    ]}
                  >
                    <Ionicons
                      name={(type.icon ?? "cash") as any}
                      size={scale(18)}
                      color={
                        isSelected
                          ? theme.palette.neutral[0]
                          : theme.colors.primary.DEFAULT
                      }
                    />
                  </View>

                  <View style={styles.methodInfo}>
                    <Text
                      style={[
                        styles.methodLabel,
                        isSelected && styles.methodLabelSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.checkCircle,
                      isSelected && styles.checkCircleSelected,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={scale(13)}
                        color={theme.palette.neutral[0]}
                      />
                    )}
                  </View>
                </TouchableOpacity>

                {/* PIX details */}
                {isSelected && type.name === PIX_NAME && (
                  <View style={styles.detailsContainer}>
                    <Text style={styles.detailLabel}>TIPO DE CHAVE PIX</Text>
                    <View style={styles.pixKeyTypeRow}>
                      {(["cpf", "cnpj", "email", "phone", "random"] as PixKeyType[]).map(
                        (keyType) => (
                          <TouchableOpacity
                            key={keyType}
                            style={[
                              styles.pixKeyTypePill,
                              methodState.pixKeyType === keyType &&
                                styles.pixKeyTypePillActive,
                            ]}
                            onPress={() => updatePixKeyType(type.id, keyType)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.pixKeyTypePillText,
                                methodState.pixKeyType === keyType &&
                                  styles.pixKeyTypePillTextActive,
                              ]}
                            >
                              {PIX_KEY_TYPE_LABELS[keyType]}
                            </Text>
                          </TouchableOpacity>
                        ),
                      )}
                    </View>

                    <Text style={styles.detailLabel}>CHAVE PIX</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(8, 0.5) }}>
                      <TextInput
                        style={[
                          styles.detailInput,
                          { flex: 1 },
                          focusedInput === `${type.id}-pixKey` && styles.detailInputFocused,
                          pixKeyErrors[type.id] && styles.detailInputError,
                        ]}
                        placeholder={PIX_KEY_PLACEHOLDERS[methodState.pixKeyType]}
                        placeholderTextColor={theme.colors.text.secondary}
                        value={methodState.pixKey}
                        onChangeText={(text) => {
                          updateField(type.id, "pixKey", formatPixKey(methodState.pixKeyType, text));
                          if (pixKeyErrors[type.id]) {
                            setPixKeyErrors((prev) => ({ ...prev, [type.id]: null }));
                          }
                        }}
                        onFocus={() => setFocusedInput(`${type.id}-pixKey`)}
                        onBlur={() => {
                          setFocusedInput(null);
                          checkPixKey(type.id, methodState.pixKey);
                        }}
                        autoCapitalize="none"
                        keyboardType={getPixKeyboardType(methodState.pixKeyType)}
                      />
                      {pixKeyChecking[type.id] && (
                        <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
                      )}
                    </View>
                    {pixKeyErrors[type.id] ? (
                      <Text style={styles.pixKeyErrorText}>{pixKeyErrors[type.id]}</Text>
                    ) : null}
                  </View>
                )}

                {/* Bank transfer details */}
                {isSelected && type.name === BANK_TRANSFER_NAME && (
                  <View style={styles.detailsContainer}>
                    <Text style={styles.detailLabel}>BANCO</Text>
                    <View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(8, 0.5) }}>
                        <TextInput
                          style={[
                            styles.detailInput,
                            { flex: 1 },
                            focusedInput === `${type.id}-bank` && styles.detailInputFocused,
                          ]}
                          placeholder="Ex: Itaú, Bradesco, Nubank..."
                          placeholderTextColor={theme.colors.text.secondary}
                          value={methodState.bank}
                          onChangeText={(text) => {
                            updateField(type.id, "bank", text);
                            setBankDropdownVisible(type.id);
                          }}
                          onFocus={() => {
                            setFocusedInput(`${type.id}-bank`);
                            if (methodState.bank.length >= 2) setBankDropdownVisible(type.id);
                          }}
                          onBlur={() => {
                            setFocusedInput(null);
                            setTimeout(() => setBankDropdownVisible(null), 200);
                          }}
                        />
                        {methodState.selectedBank && (
                          <BankLogo bank={methodState.selectedBank} size={scale(40)} />
                        )}
                      </View>
                      {bankDropdownVisible === type.id &&
                        getMatchingBanks(methodState.bank).length > 0 && (
                          <View style={styles.bankDropdown}>
                            {getMatchingBanks(methodState.bank).map((bank, index) => (
                              <TouchableOpacity
                                key={bank.name}
                                style={[
                                  styles.bankDropdownItem,
                                  index > 0 && styles.bankDropdownItemSeparator,
                                ]}
                                onPress={() => {
                                  selectBank(type.id, bank);
                                  setBankDropdownVisible(null);
                                }}
                                activeOpacity={0.7}
                              >
                                <BankLogo bank={bank} size={scale(36)} />
                                <Text style={styles.bankDropdownName}>{bank.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                    </View>

                    <Text style={styles.detailLabel}>AGÊNCIA</Text>
                    <TextInput
                      style={[
                        styles.detailInput,
                        focusedInput === `${type.id}-agency` && styles.detailInputFocused,
                      ]}
                      placeholder="Ex: 0001"
                      placeholderTextColor={theme.colors.text.secondary}
                      value={methodState.agency}
                      onChangeText={(text) => updateField(type.id, "agency", text)}
                      onFocus={() => setFocusedInput(`${type.id}-agency`)}
                      onBlur={() => setFocusedInput(null)}
                      keyboardType="number-pad"
                    />

                    <Text style={styles.detailLabel}>CONTA</Text>
                    <TextInput
                      style={[
                        styles.detailInput,
                        focusedInput === `${type.id}-account` && styles.detailInputFocused,
                      ]}
                      placeholder="Ex: 12345-6"
                      placeholderTextColor={theme.colors.text.secondary}
                      value={methodState.account}
                      onChangeText={(text) => updateField(type.id, "account", text)}
                      onFocus={() => setFocusedInput(`${type.id}-account`)}
                      onBlur={() => setFocusedInput(null)}
                    />

                    <Text style={styles.detailLabel}>TIPO DE CONTA</Text>
                    <View style={styles.pixKeyTypeRow}>
                      {(["checking", "savings"] as const).map((accountType) => {
                        const isActive = methodState.accountType === accountType;
                        return (
                          <TouchableOpacity
                            key={accountType}
                            style={[styles.pixKeyTypePill, isActive && styles.pixKeyTypePillActive]}
                            onPress={() => updateField(type.id, "accountType", accountType)}
                            activeOpacity={0.7}
                          >
                            <View style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(6, 0.5) }}>
                              <Ionicons
                                name={accountType === "checking" ? "card-outline" : "wallet-outline"}
                                size={scale(14)}
                                color={isActive ? theme.palette.neutral[0] : theme.colors.text.primary}
                              />
                              <Text style={[styles.pixKeyTypePillText, isActive && styles.pixKeyTypePillTextActive]}>
                                {accountType === "checking" ? "Corrente" : "Poupança"}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Credit / Debit card details */}
                {isSelected && isCard && (
                  <View style={styles.detailsContainer}>
                    <CardPreview brands={methodState.acceptedBrands} />

                    <Text style={styles.detailLabel}>BANDEIRAS ACEITAS</Text>
                    <View style={styles.pixKeyTypeRow}>
                      {CARD_BRANDS.map((brand) => {
                        const active = methodState.acceptedBrands.includes(brand);
                        return (
                          <TouchableOpacity
                            key={brand}
                            style={[
                              styles.brandPill,
                              active
                                ? { borderColor: CARD_BRAND_COLORS[brand], opacity: 1 }
                                : { opacity: 0.4 },
                            ]}
                            onPress={() => toggleBrand(type.id, brand)}
                            activeOpacity={0.7}
                          >
                            <CardBrandLogo brand={brand} size={scale(28)} />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            );
          })}

          <TouchableOpacity
            style={[
              styles.saveButton,
              (isSaving ||
                Object.values(pixKeyChecking).some(Boolean) ||
                Object.values(pixKeyErrors).some(Boolean)) &&
                styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={
              isSaving ||
              Object.values(pixKeyChecking).some(Boolean) ||
              Object.values(pixKeyErrors).some(Boolean)
            }
            activeOpacity={0.85}
            testID="save-payment-methods-button"
          >
            <Text style={styles.saveButtonText}>
              {isSaving
                ? account.providerPaymentMethodsSavingButton
                : account.providerPaymentMethodsSaveButton}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Toast toast={toast} opacity={toastOpacity} />
    </View>
  );
}
