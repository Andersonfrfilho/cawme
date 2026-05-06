import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { styles } from "./styles";
import type { CompanyFormProps } from "./types";
import type { BusinessHour, CompanyFormValues } from "../../screens/create-company/types";

function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatZipCode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

const DAYS = [
  { key: 1, label: "dayMonday" },
  { key: 2, label: "dayTuesday" },
  { key: 3, label: "dayWednesday" },
  { key: 4, label: "dayThursday" },
  { key: 5, label: "dayFriday" },
  { key: 6, label: "daySaturday" },
  { key: 0, label: "daySunday" },
] as const;

export const CompanyForm: React.FC<CompanyFormProps> = ({ control, errors, step }) => {
  const { company } = useLocale<LocaleKeys>();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const renderField = (
    name: keyof CompanyFormValues,
    placeholder: string,
    iconName: string,
    config?: {
      keyboardType?: "email-address" | "phone-pad" | "numeric" | "default";
      autoCapitalize?: "none" | "sentences" | "words" | "characters";
      maxLength?: number;
      formatter?: (value: string) => string;
      onChangeFormatter?: (value: string) => string;
      secureTextEntry?: boolean;
    },
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => {
        const displayValue = config?.formatter && typeof value === "string" ? config.formatter(value) : (value as string) ?? "";
        return (
          <>
            <View
              style={[
                styles.inputRow,
                focusedField === name && styles.inputRowFocused,
                errors[name] && styles.inputRowError,
              ]}
            >
              <Ionicons
                name={iconName as any}
                size={moderateScale(18, 0.3)}
                color={errors[name] ? theme.colors.status.error : focusedField === name ? theme.colors.primary.DEFAULT : theme.palette.neutral[400]}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.inputText}
                placeholder={placeholder}
                placeholderTextColor={theme.palette.neutral[400]}
                value={displayValue}
                onChangeText={(text) => {
                  const processed = config?.onChangeFormatter ? config.onChangeFormatter(text) : text;
                  onChange(processed);
                }}
                onFocus={() => setFocusedField(name)}
                onBlur={() => {
                  setFocusedField(null);
                  onBlur();
                }}
                keyboardType={config?.keyboardType ?? "default"}
                autoCapitalize={config?.autoCapitalize ?? "sentences"}
                maxLength={config?.maxLength}
                secureTextEntry={config?.secureTextEntry}
              />
            </View>
            {errors[name] && (
              <Text style={styles.fieldError}>{errors[name]?.message as string}</Text>
            )}
          </>
        );
      }}
    />
  );

  if (step === "basic") {
    return (
      <View>
        {renderField("document", company.documentPlaceholder, "business-outline", {
          keyboardType: "numeric",
          maxLength: 18,
          formatter: formatCNPJ,
          onChangeFormatter: (text) => text.replace(/\D/g, "").slice(0, 14),
        })}
        {renderField("companyName", company.companyNamePlaceholder, "briefcase-outline", {
          autoCapitalize: "words",
        })}
        {renderField("tradeName", company.tradeNamePlaceholder, "storefront-outline", {
          autoCapitalize: "words",
        })}
        {renderField("email", company.emailPlaceholder, "mail-outline", {
          keyboardType: "email-address",
          autoCapitalize: "none",
        })}
        {renderField("phone", company.phonePlaceholder, "call-outline", {
          keyboardType: "phone-pad",
          maxLength: 15,
          formatter: formatPhone,
          onChangeFormatter: (text) => text.replace(/\D/g, "").slice(0, 11),
        })}
        <View style={styles.row}>
          <View style={styles.rowHalf}>
            {renderField("stateRegistration", company.stateRegistrationPlaceholder, "document-text-outline")}
          </View>
          <View style={styles.rowHalf}>
            {renderField("municipalRegistration", company.municipalRegistrationPlaceholder, "document-text-outline")}
          </View>
        </View>
      </View>
    );
  }

  if (step === "address") {
    return (
      <View>
        {renderField("zipCode", company.zipCodePlaceholder, "location-outline", {
          keyboardType: "numeric",
          maxLength: 9,
          formatter: formatZipCode,
          onChangeFormatter: (text) => text.replace(/\D/g, "").slice(0, 8),
        })}
        {renderField("street", company.streetPlaceholder, "home-outline")}
        <View style={styles.row}>
          <View style={[styles.rowHalf, { flex: 0.35 }]}>
            {renderField("number", company.numberPlaceholder, "cube-outline", {
              keyboardType: "numeric",
            })}
          </View>
          <View style={[styles.rowHalf, { flex: 0.65 }]}>
            {renderField("complement", company.complementPlaceholder, "add-circle-outline")}
          </View>
        </View>
        {renderField("neighborhood", company.neighborhoodPlaceholder, "map-outline")}
        <View style={styles.row}>
          <View style={[styles.rowHalf, { flex: 0.7 }]}>
            {renderField("city", company.cityPlaceholder, "business-outline")}
          </View>
          <View style={[styles.rowHalf, { flex: 0.3 }]}>
            {renderField("state", company.statePlaceholder, "flag-outline", {
              autoCapitalize: "characters",
              maxLength: 2,
            })}
          </View>
        </View>
      </View>
    );
  }

  if (step === "hours") {
    return (
      <Controller
        control={control}
        name="businessHours"
        render={({ field: { value, onChange } }) => {
          const hours: BusinessHour[] = value ?? DAYS.map((d) => ({ dayOfWeek: d.key, isOpen: d.key >= 1 && d.key <= 5, openTime: "08:00", closeTime: "18:00" }));

          const toggleDay = (dayOfWeek: number) => {
            const updated = hours.map((h) =>
              h.dayOfWeek === dayOfWeek ? { ...h, isOpen: !h.isOpen } : h,
            );
            onChange(updated);
          };

          const updateTime = (dayOfWeek: number, field: "openTime" | "closeTime", time: string) => {
            const updated = hours.map((h) =>
              h.dayOfWeek === dayOfWeek ? { ...h, [field]: time } : h,
            );
            onChange(updated);
          };

          return (
            <View>
              {DAYS.map((day) => {
                const hour = hours.find((h) => h.dayOfWeek === day.key)!;
                return (
                  <View key={day.key} style={styles.businessHourRow}>
                    <Text style={styles.businessHourDay}>{(company as any)[day.label]}</Text>
                    <View style={styles.businessHourToggle}>
                      <TouchableOpacity
                        onPress={() => toggleDay(day.key)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.businessHourToggleTrack,
                            hour.isOpen && styles.businessHourToggleTrackActive,
                          ]}
                        >
                          <View
                            style={[
                              styles.businessHourToggleThumb,
                              {
                                transform: [{ translateX: hour.isOpen ? moderateScale(20, 0.5) : 0 }],
                              },
                            ]}
                          />
                        </View>
                      </TouchableOpacity>
                      <Text style={{ fontSize: moderateScale(13, 0.3), color: theme.colors.text.secondary }}>
                        {hour.isOpen ? company.openLabel : company.closedLabel}
                      </Text>
                    </View>
                    {hour.isOpen && (
                      <View style={styles.businessHourTimes}>
                        <TextInput
                          style={styles.businessHourTimeInput}
                          value={hour.openTime}
                          onChangeText={(t) => updateTime(day.key, "openTime", t)}
                          placeholder={company.openTimeLabel}
                          placeholderTextColor={theme.palette.neutral[400]}
                          maxLength={5}
                        />
                        <Text style={{ color: theme.colors.text.secondary }}>—</Text>
                        <TextInput
                          style={styles.businessHourTimeInput}
                          value={hour.closeTime}
                          onChangeText={(t) => updateTime(day.key, "closeTime", t)}
                          placeholder={company.closeTimeLabel}
                          placeholderTextColor={theme.palette.neutral[400]}
                          maxLength={5}
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          );
        }}
      />
    );
  }

  if (step === "review") {
    return (
      <Controller
        control={control}
        name="document"
        render={({ field: { value: document } }) => (
          <View>
            <ReviewSection title={company.sectionBasic}>
              <ReviewRow icon="business-outline" label="CNPJ" value={formatCNPJ(document ?? "")} />
              <ReviewRow icon="briefcase-outline" label="Razão" value={control._formValues.companyName} />
              <ReviewRow icon="storefront-outline" label="Fantasia" value={control._formValues.tradeName || "—"} />
              <ReviewRow icon="mail-outline" label="E-mail" value={control._formValues.email} />
              <ReviewRow icon="call-outline" label="Telefone" value={formatPhone(control._formValues.phone ?? "")} />
            </ReviewSection>
            <ReviewSection title={company.sectionAddress}>
              <ReviewRow icon="location-outline" label="CEP" value={formatZipCode(control._formValues.zipCode ?? "")} />
              <ReviewRow icon="home-outline" label="Endereço" value={`${control._formValues.street}, ${control._formValues.number}`} />
              <ReviewRow icon="map-outline" label="Bairro" value={control._formValues.neighborhood} />
              <ReviewRow icon="business-outline" label="Cidade" value={`${control._formValues.city} - ${control._formValues.state}`} />
            </ReviewSection>
          </View>
        )}
      />
    );
  }

  return null;
};

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewSectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ReviewRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.reviewRow}>
      <Ionicons name={icon as any} size={moderateScale(16, 0.3)} color={theme.colors.text.secondary} style={styles.reviewIcon} />
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}
