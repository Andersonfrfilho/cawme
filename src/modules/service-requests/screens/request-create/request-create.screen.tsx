import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProviderProfile } from "@/modules/provider-profile/hooks/useProviderProfile";
import { ProviderProfileService } from "@/modules/provider-profile/services/provider-profile.service";
import { AccountService, type UserAddress, type PaymentMethodType } from "@/modules/account/services/account.service";
import { ServiceRequestsService } from "@/modules/service-requests/services/service-requests.service";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { useToast } from "@/shared/hooks/useToast";
import { useLoading } from "@/shared/hooks/useLoading";
import { Toast } from "@/shared/components/Toast";
import { theme } from "@/shared/constants";
import { formatBRL } from "@/shared/utils/currency";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

import styles from "./styles";
import {
  requestCreateSchema,
  type RequestCreateFormValues,
  type RequestCreateScreenParams,
} from "./types";
import { generateAvailableSlots, filterSlotsByDurationAndBusy } from "./utils";

const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const PICKER_ITEM_HEIGHT = verticalScale(44);
const PICKER_VISIBLE = 4;

function formatScheduledDate(day: number, month: number, year: number, slot: string): string {
  return `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year} às ${slot}`;
}

function buildISODate(day: number, month: number, year: number, slot: string): string {
  const [hour, minute] = slot.split(':').map(Number);
  const date = new Date(year, month, day, hour, minute, 0);
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

type PickerColumnProps = {
  data: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

function DatePickerColumn({ data, selectedIndex, onSelect }: PickerColumnProps) {
  const listRef = useRef<FlatList>(null);
  const padding = Math.floor(PICKER_VISIBLE / 2);
  const paddedData = [
    ...Array(padding).fill(''),
    ...data,
    ...Array(padding).fill(''),
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      listRef.current?.scrollToOffset({
        offset: selectedIndex * PICKER_ITEM_HEIGHT,
        animated: false,
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [selectedIndex]);

  return (
    <View style={{ flex: 1, height: PICKER_ITEM_HEIGHT * PICKER_VISIBLE, overflow: 'hidden' }}>
      <FlatList
        ref={listRef}
        data={paddedData}
        keyExtractor={(item, i) => `${item}-${i}`}
        getItemLayout={(_, index) => ({
          length: PICKER_ITEM_HEIGHT,
          offset: PICKER_ITEM_HEIGHT * index,
          index,
        })}
        snapToInterval={PICKER_ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const raw = Math.round(e.nativeEvent.contentOffset.y / PICKER_ITEM_HEIGHT);
          const clamped = Math.min(Math.max(0, raw), data.length - 1);
          onSelect(clamped);
        }}
        renderItem={({ item, index }) => {
          const isSelected = index === selectedIndex + padding;
          return (
            <View style={styles.datePickerItem}>
              <Text
                style={isSelected ? styles.datePickerItemTextSelected : styles.datePickerItemText}
              >
                {item}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

type PickerMode = "service" | "address" | "paymentMethod" | "date" | null;

export default function RequestCreateScreen() {
  const insets = useSafeAreaInsets();
  const { serviceRequests } = useLocale<LocaleKeys>();
  const { providerId, providerName } = useLocalSearchParams<RequestCreateScreenParams>();
  const { toast, toastOpacity, showToast } = useToast();
  const { showLoading, hideLoading, isLoading } = useLoading();

  const { data: profile, isLoading: profileLoading } = useProviderProfile(providerId ?? "");

  const today = new Date();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
  const [serviceHours, setServiceHours] = useState<Record<string, number>>({});
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);
  const [pickerDay, setPickerDay] = useState(today.getDate());
  const [pickerMonth, setPickerMonth] = useState(today.getMonth());
  const [pickerYear, setPickerYear] = useState(today.getFullYear());
  const [pickerSlot, setPickerSlot] = useState('09:00');

  const selectedDayOfWeek = useMemo(
    () => new Date(pickerYear, pickerMonth, pickerDay).getDay(),
    [pickerYear, pickerMonth, pickerDay],
  );

  const availabilityForDay = useMemo(() => {
    const slots = profile?.availability ?? [];
    if (!slots.length) return null;
    return slots.find((slot) => slot.dayOfWeek === selectedDayOfWeek) ?? null;
  }, [profile?.availability, selectedDayOfWeek]);

  const availableSlotLabels = useMemo(
    () => generateAvailableSlots(availabilityForDay ?? null, (profile?.availability?.length ?? 0) > 0),
    [availabilityForDay, profile?.availability],
  );

  const isUnavailableDay = availableSlotLabels.length === 0;

  const totalDurationMinutes = useMemo(() => {
    if (selectedServiceIds.size === 0) return 60;
    return [...selectedServiceIds].reduce((sum, id) => {
      const service = profile?.services.find((s) => s.id === id);
      if (!service) return sum;
      if (service.estimatedDurationMinutes) return sum + service.estimatedDurationMinutes;
      if (service.unit === 'hora') return sum + (serviceHours[id] ?? 1) * 60;
      return sum + 60;
    }, 0);
  }, [selectedServiceIds, profile?.services, serviceHours]);

  const [busySlots, setBusySlots] = useState<Array<{ scheduledAt: string; estimatedHours: number }>>([]);

  useEffect(() => {
    if (!providerId || isUnavailableDay) {
      setBusySlots([]);
      return;
    }
    const dateStr = `${pickerYear}-${String(pickerMonth + 1).padStart(2, '0')}-${String(pickerDay).padStart(2, '0')}`;
    void ProviderProfileService.getBusySlots(providerId, dateStr)
      .then(setBusySlots)
      .catch(() => setBusySlots([]));
  }, [providerId, pickerDay, pickerMonth, pickerYear, isUnavailableDay]);

  const filteredSlotLabels = useMemo(
    () => filterSlotsByDurationAndBusy(
      availableSlotLabels,
      totalDurationMinutes,
      availabilityForDay?.endTime ?? '24:00',
      busySlots,
    ),
    [availableSlotLabels, totalDurationMinutes, busySlots, availabilityForDay],
  );

  useEffect(() => {
    if (filteredSlotLabels.length > 0 && !filteredSlotLabels.includes(pickerSlot)) {
      setPickerSlot(filteredSlotLabels[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSlotLabels]);

  const prevDurationRef = useRef(totalDurationMinutes);
  useEffect(() => {
    if (prevDurationRef.current !== totalDurationMinutes) {
      prevDurationRef.current = totalDurationMinutes;
      setScheduledDate(null);
    }
  }, [totalDurationMinutes]);

  const [showServiceError, setShowServiceError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingValues, setPendingValues] = useState<RequestCreateFormValues | null>(null);
  const [allPaymentMethodTypes, setAllPaymentMethodTypes] = useState<PaymentMethodType[]>([]);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RequestCreateFormValues>({
    resolver: zodResolver(requestCreateSchema),
  });

  const selectedAddressId = watch("addressId");
  const description = watch("description");

  const selectedAddress = addresses.find((address) => address.addressId === selectedAddressId);
  const selectedServices = (profile?.services ?? []).filter((s) => selectedServiceIds.has(s.id));

  useEffect(() => {
    AccountService.listAddresses().then(setAddresses).catch(() => setAddresses([]));
  }, []);

  useEffect(() => {
    AccountService.listPaymentMethodTypes()
      .then(setAllPaymentMethodTypes)
      .catch(() => setAllPaymentMethodTypes([]));
  }, []);

  const paymentMethodOptions: Array<{ id: string; name: string; label: string; icon: string | null }> =
    (profile?.paymentMethods ?? []).length > 0
      ? profile!.paymentMethods
      : allPaymentMethodTypes;

  function toggleService(serviceId: string) {
    setSelectedServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) {
        next.delete(serviceId);
        setServiceHours((hours) => {
          const updated = { ...hours };
          delete updated[serviceId];
          return updated;
        });
      } else {
        next.add(serviceId);
        const service = profile?.services.find((s) => s.id === serviceId);
        if (service?.unit === "hora") {
          setServiceHours((hours) => ({ ...hours, [serviceId]: 1 }));
        }
      }
      return next;
    });
    setShowServiceError(false);
  }

  function adjustHours(serviceId: string, delta: number) {
    setServiceHours((prev) => ({
      ...prev,
      [serviceId]: Math.max(1, (prev[serviceId] ?? 1) + delta),
    }));
  }

  let selectorLabel: string;
  if (selectedServiceIds.size === 0) {
    selectorLabel = serviceRequests.servicesPlaceholder;
  } else if (selectedServiceIds.size === 1) {
    selectorLabel = selectedServices[0]?.name ?? '';
  } else {
    selectorLabel = `${selectedServiceIds.size} ${serviceRequests.servicesSelected}`;
  }

  function onValidated(values: RequestCreateFormValues): void {
    if (!providerId) return;

    let hasError = false;
    if (selectedServiceIds.size === 0) { setShowServiceError(true); hasError = true; }
    if (!scheduledDate) { setShowDateError(true); hasError = true; }
    if (paymentMethodOptions.length > 0 && !selectedPaymentMethodId) { setShowPaymentError(true); hasError = true; }
    if (hasError) return;

    setPendingValues(values);
    setShowConfirmModal(true);
  }

  async function executeSubmit(): Promise<void> {
    if (!pendingValues || !providerId) return;
    setShowConfirmModal(false);

    showLoading();
    let didNavigate = false;
    try {
      for (const serviceId of Array.from(selectedServiceIds)) {
        const service = profile?.services.find((s) => s.id === serviceId);
        const hours = serviceHours[serviceId] ?? 1;
        const priceFinal = service?.unit === "hora" ? service.price * hours : undefined;

        await ServiceRequestsService.create({
          providerId,
          serviceId,
          addressId: pendingValues.addressId,
          description: pendingValues.description,
          priceFinal,
          scheduledAt: scheduledDate ?? undefined,
          paymentMethodTypeId: selectedPaymentMethodId ?? undefined,
          estimatedHours: hours,
        });
      }

      didNavigate = true;
      router.replace("/(app)/service-requests" as any);
    } catch {
      showToast(serviceRequests.requestError, "error");
    } finally {
      if (!didNavigate) hideLoading();
    }
  }

  const hasPaymentRequired = paymentMethodOptions.length > 0;
  const canSubmit =
    selectedServiceIds.size > 0 &&
    !!selectedAddressId &&
    !!scheduledDate &&
    (!hasPaymentRequired || !!selectedPaymentMethodId);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={moderateScale(24, 0.3)} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{serviceRequests.createTitle}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.providerCard}>
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.providerAvatar} />
          ) : (
            <View style={styles.providerAvatarPlaceholder}>
              <Ionicons
                name="person"
                size={moderateScale(22, 0.3)}
                color={theme.colors.primary.DEFAULT}
              />
            </View>
          )}
          <View>
            <Text style={styles.providerName}>{providerName}</Text>
            <Text style={styles.providerSubtitle}>Prestador de serviços</Text>
          </View>
        </View>

        {/* Services field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{serviceRequests.servicesLabel}</Text>
          <TouchableOpacity
            style={[
              styles.selectorButton,
              selectedServiceIds.size > 0 && styles.selectorButtonSelected,
            ]}
            onPress={() => setPickerMode("service")}
            disabled={profileLoading || isLoading}
            testID="service-selector"
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.selectorText,
                selectedServiceIds.size > 0 && styles.selectorTextSelected,
              ]}
              numberOfLines={1}
            >
              {selectorLabel}
            </Text>
            <Ionicons
              name="chevron-down"
              size={moderateScale(16, 0.3)}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>

          {/* Selected services detail cards */}
          {selectedServices.length > 0 && (
            <View style={styles.selectedServicesList}>
              {selectedServices.map((service) => {
                const isHourly = service.unit === "hora";
                const hours = serviceHours[service.id] ?? 1;
                const estimated = isHourly ? service.price * hours : service.price;

                return (
                  <View key={service.id} style={styles.selectedServiceItem}>
                    <View style={styles.selectedServiceHeader}>
                      <Text style={styles.selectedServiceName} numberOfLines={1}>
                        {service.name}
                      </Text>
                      <Text style={styles.selectedServiceUnit}>
                        {formatBRL(service.price)}/{service.unit}
                      </Text>
                    </View>

                    {isHourly && (
                      <View style={styles.hoursRow}>
                        <Text style={styles.hoursLabelText}>
                          {serviceRequests.hoursLabel}
                        </Text>
                        <View style={styles.stepperRow}>
                          <TouchableOpacity
                            style={styles.stepperButton}
                            onPress={() => adjustHours(service.id, -1)}
                            testID={`hours-decrease-${service.id}`}
                          >
                            <Text style={styles.stepperButtonText}>−</Text>
                          </TouchableOpacity>
                          <Text style={styles.stepperValue}>{hours}h</Text>
                          <TouchableOpacity
                            style={styles.stepperButton}
                            onPress={() => adjustHours(service.id, 1)}
                            testID={`hours-increase-${service.id}`}
                          >
                            <Text style={styles.stepperButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    <View style={styles.estimatedRow}>
                      <Text style={styles.estimatedText}>
                        {serviceRequests.estimatedLabel}:{" "}
                      </Text>
                      <Text style={styles.estimatedPrice}>{formatBRL(estimated)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {showServiceError && (
            <Text style={styles.errorText}>{serviceRequests.serviceRequired}</Text>
          )}
        </View>

        {/* Address field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{serviceRequests.addressLabel}</Text>
          <TouchableOpacity
            style={[
              styles.selectorButton,
              selectedAddress && styles.selectorButtonSelected,
            ]}
            onPress={() => setPickerMode("address")}
            disabled={isLoading}
            testID="address-selector"
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.selectorText,
                selectedAddress && styles.selectorTextSelected,
              ]}
              numberOfLines={1}
            >
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.number} — ${selectedAddress.city}`
                : serviceRequests.addressPlaceholder}
            </Text>
            <Ionicons
              name="chevron-down"
              size={moderateScale(16, 0.3)}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
          {errors.addressId && (
            <Text style={styles.errorText}>{serviceRequests.addressRequired}</Text>
          )}
        </View>

        {/* Scheduled date field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{serviceRequests.scheduledAtLabel}</Text>
          <TouchableOpacity
            style={[
              styles.selectorButton,
              !!scheduledDate && styles.selectorButtonSelected,
              showDateError && { borderColor: theme.colors.status.error },
            ]}
            onPress={() => setPickerMode("date")}
            disabled={isLoading}
            testID="date-selector"
            activeOpacity={0.7}
          >
            <Text
              style={[styles.selectorText, !!scheduledDate && styles.selectorTextSelected]}
              numberOfLines={1}
            >
              {scheduledDate
                ? formatScheduledDate(pickerDay, pickerMonth, pickerYear, pickerSlot)
                : serviceRequests.scheduledAtPlaceholder}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={moderateScale(16, 0.3)}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
          {showDateError && (
            <Text style={styles.errorText}>{serviceRequests.scheduledAtRequired}</Text>
          )}
        </View>

        {/* Payment method field */}
        {paymentMethodOptions.length > 0 && (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{serviceRequests.paymentMethodLabel}</Text>
            <TouchableOpacity
              style={[
                styles.selectorButton,
                !!selectedPaymentMethodId && styles.selectorButtonSelected,
                showPaymentError && { borderColor: theme.colors.status.error },
              ]}
              onPress={() => setPickerMode("paymentMethod")}
              disabled={isLoading}
              testID="payment-method-selector"
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.selectorText,
                  !!selectedPaymentMethodId && styles.selectorTextSelected,
                ]}
                numberOfLines={1}
              >
                {selectedPaymentMethodId
                  ? (paymentMethodOptions.find(
                      (method) => method.id === selectedPaymentMethodId,
                    )?.label ?? serviceRequests.paymentMethodPlaceholder)
                  : serviceRequests.paymentMethodPlaceholder}
              </Text>
              <Ionicons
                name="chevron-down"
                size={moderateScale(16, 0.3)}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
            {showPaymentError && (
              <Text style={styles.errorText}>{serviceRequests.paymentMethodRequired}</Text>
            )}
          </View>
        )}

        {/* Description field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{serviceRequests.descriptionLabel}</Text>
          <TextInput
            style={[styles.descriptionInput, descriptionFocused && styles.descriptionInputFocused]}
            placeholder={serviceRequests.descriptionPlaceholder}
            placeholderTextColor={theme.colors.text.tertiary}
            value={description}
            onChangeText={(text) => setValue("description", text)}
            onFocus={() => setDescriptionFocused(true)}
            onBlur={() => setDescriptionFocused(false)}
            multiline
            numberOfLines={4}
            autoCorrect={false}
            testID="description-input"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!canSubmit || isSubmitting || isLoading) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit(onValidated)}
          disabled={!canSubmit || isSubmitting || isLoading}
          testID="submit-button"
          activeOpacity={0.85}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? serviceRequests.requestingButton : serviceRequests.requestButton}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Service picker modal — multi-select */}
      <Modal
        visible={pickerMode === "service"}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerMode(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerMode(null)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{serviceRequests.servicesLabel}</Text>
            <ScrollView>
              {(profile?.services ?? []).map((service) => {
                const isSelected = selectedServiceIds.has(service.id);
                return (
                  <TouchableOpacity
                    key={service.id}
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                    onPress={() => toggleService(service.id)}
                    testID={`service-option-${service.id}`}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.optionText}>{service.name}</Text>
                      <Text style={styles.optionSubtext}>{service.unit}</Text>
                    </View>
                    <Text style={styles.optionPrice}>{formatBRL(service.price)}</Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={moderateScale(18, 0.3)}
                        color={theme.colors.primary.DEFAULT}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={() => setPickerMode(null)}
              testID="service-modal-confirm"
            >
              <Text style={styles.modalConfirmButtonText}>
                {serviceRequests.modalConfirmButton}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Address picker modal */}
      <Modal
        visible={pickerMode === "address"}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerMode(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerMode(null)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{serviceRequests.addressLabel}</Text>
            <ScrollView>
              {addresses.length === 0 ? (
                <Text
                  style={[
                    styles.optionText,
                    { paddingHorizontal: moderateScale(24, 0.5), paddingVertical: verticalScale(16) },
                  ]}
                >
                  Nenhum endereço cadastrado
                </Text>
              ) : (
                addresses.map((address) => (
                  <TouchableOpacity
                    key={address.id}
                    style={[
                      styles.optionItem,
                      selectedAddressId === address.addressId && styles.optionItemSelected,
                    ]}
                    onPress={() => {
                      setValue("addressId", address.addressId, { shouldValidate: true });
                      setPickerMode(null);
                    }}
                    testID={`address-option-${address.id}`}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.optionText}>{address.label || address.street}</Text>
                      <Text style={styles.optionSubtext}>
                        {`${address.street}, ${address.number} — ${address.city}/${address.state}`}
                      </Text>
                    </View>
                    {selectedAddressId === address.addressId && (
                      <Ionicons
                        name="checkmark"
                        size={moderateScale(18, 0.3)}
                        color={theme.colors.primary.DEFAULT}
                      />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date picker modal */}
      <Modal
        visible={pickerMode === "date"}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerMode(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={{ flex: 1 }} onPress={() => setPickerMode(null)} />
          <View style={[styles.modalSheet, { paddingBottom: 24 }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{serviceRequests.scheduledAtLabel}</Text>

            <View style={styles.datePickerRow}>
              <View
                pointerEvents="none"
                style={[styles.datePickerHighlight, {
                  top: PICKER_ITEM_HEIGHT * Math.floor(PICKER_VISIBLE / 2),
                }]}
              />
              <DatePickerColumn
                data={Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))}
                selectedIndex={pickerDay - 1}
                onSelect={(index) => setPickerDay(index + 1)}
              />
              <View style={{ height: PICKER_ITEM_HEIGHT * PICKER_VISIBLE, paddingTop: PICKER_ITEM_HEIGHT * Math.floor(PICKER_VISIBLE / 2) }}>
                <View style={{ height: PICKER_ITEM_HEIGHT, justifyContent: "center", alignItems: "center" }}>
                  <Text style={styles.datePickerSeparator}>/</Text>
                </View>
              </View>
              <DatePickerColumn
                data={MONTHS_PT}
                selectedIndex={pickerMonth}
                onSelect={setPickerMonth}
              />
              <View style={{ height: PICKER_ITEM_HEIGHT * PICKER_VISIBLE, paddingTop: PICKER_ITEM_HEIGHT * Math.floor(PICKER_VISIBLE / 2) }}>
                <View style={{ height: PICKER_ITEM_HEIGHT, justifyContent: "center", alignItems: "center" }}>
                  <Text style={styles.datePickerSeparator}>/</Text>
                </View>
              </View>
              <DatePickerColumn
                data={Array.from({ length: 3 }, (_, i) => String(today.getFullYear() + i))}
                selectedIndex={pickerYear - today.getFullYear()}
                onSelect={(index) => setPickerYear(today.getFullYear() + index)}
              />
            </View>

            {isUnavailableDay ? (
              <View style={{ paddingHorizontal: moderateScale(24, 0.5), paddingVertical: verticalScale(16), alignItems: "center" }}>
                <Ionicons name="ban-outline" size={moderateScale(32, 0.3)} color={theme.colors.status.error} />
                <Text style={{ color: theme.colors.status.error, marginTop: verticalScale(8), fontSize: moderateScale(14, 0.3), textAlign: "center" }}>
                  {serviceRequests.scheduledAtUnavailableDay}
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.datePickerSeparator, { textAlign: "center", marginVertical: 8, fontSize: moderateScale(13, 0.3) }]}>
                  às
                </Text>

                {totalDurationMinutes > 0 && (
                  <Text style={{ textAlign: "center", color: theme.colors.text.secondary, fontSize: moderateScale(12, 0.3), marginBottom: verticalScale(4) }}>
                    {serviceRequests.estimatedDurationLabel}: {totalDurationMinutes >= 60 ? `${Math.floor(totalDurationMinutes / 60)}h${totalDurationMinutes % 60 > 0 ? `${totalDurationMinutes % 60}min` : ''}` : `${totalDurationMinutes}min`}
                  </Text>
                )}

                <View style={[styles.datePickerRow, { justifyContent: "center" }]}>
                  <View
                    pointerEvents="none"
                    style={[styles.datePickerHighlight, {
                      top: PICKER_ITEM_HEIGHT * Math.floor(PICKER_VISIBLE / 2),
                    }]}
                  />
                  <DatePickerColumn
                    data={filteredSlotLabels.length > 0 ? filteredSlotLabels : [serviceRequests.noAvailableSlots]}
                    selectedIndex={Math.max(0, filteredSlotLabels.indexOf(pickerSlot))}
                    onSelect={(index) => {
                      const slot = filteredSlotLabels[index];
                      if (slot) setPickerSlot(slot);
                    }}
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.modalConfirmButton, (isUnavailableDay || filteredSlotLabels.length === 0) && { opacity: 0.4 }]}
              onPress={() => {
                if (isUnavailableDay || filteredSlotLabels.length === 0) return;
                setScheduledDate(buildISODate(pickerDay, pickerMonth, pickerYear, pickerSlot));
                setShowDateError(false);
                setPickerMode(null);
              }}
              disabled={isUnavailableDay || filteredSlotLabels.length === 0}
              testID="date-confirm-button"
            >
              <Text style={styles.modalConfirmButtonText}>
                {serviceRequests.modalConfirmButton}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment method picker modal */}
      <Modal
        visible={pickerMode === "paymentMethod"}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerMode(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerMode(null)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{serviceRequests.paymentMethodLabel}</Text>
            <ScrollView>
              {paymentMethodOptions.map((method) => {
                const isSelected = selectedPaymentMethodId === method.id;
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                    onPress={() => {
                      setSelectedPaymentMethodId(method.id);
                      setShowPaymentError(false);
                      setPickerMode(null);
                    }}
                    testID={`payment-method-option-${method.id}`}
                  >
                    <Ionicons
                      name={(method.icon ?? "cash") as any}
                      size={moderateScale(18, 0.3)}
                      color={theme.colors.primary.DEFAULT}
                      style={{ marginRight: moderateScale(8, 0.5) }}
                    />
                    <Text style={styles.optionText}>{method.label}</Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={moderateScale(18, 0.3)}
                        color={theme.colors.primary.DEFAULT}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowConfirmModal(false)}
        >
          <TouchableOpacity style={styles.modalSheet} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{serviceRequests.confirmTitle}</Text>
            <ScrollView>
              <View style={{ paddingHorizontal: moderateScale(24, 0.5), paddingBottom: verticalScale(16) }}>

                <Text style={[styles.label, { marginTop: verticalScale(8) }]}>
                  {serviceRequests.confirmServicesLabel}
                </Text>
                {selectedServices.map((service) => {
                  const hours = serviceHours[service.id] ?? 1;
                  const estimated = service.unit === "hora" ? service.price * hours : service.price;
                  return (
                    <View key={service.id} style={{ flexDirection: "row", justifyContent: "space-between", marginTop: verticalScale(4) }}>
                      <Text style={styles.optionText} numberOfLines={1}>
                        {service.name}{service.unit === "hora" ? ` (${hours}h)` : ""}
                      </Text>
                      <Text style={styles.optionPrice}>{formatBRL(estimated)}</Text>
                    </View>
                  );
                })}

                {selectedAddress && (
                  <>
                    <Text style={[styles.label, { marginTop: verticalScale(12) }]}>
                      {serviceRequests.confirmAddressLabel}
                    </Text>
                    <Text style={styles.optionSubtext}>
                      {`${selectedAddress.street}, ${selectedAddress.number} — ${selectedAddress.city}`}
                    </Text>
                  </>
                )}

                {scheduledDate && (
                  <>
                    <Text style={[styles.label, { marginTop: verticalScale(12) }]}>
                      {serviceRequests.confirmDateLabel}
                    </Text>
                    <Text style={styles.optionSubtext}>
                      {formatScheduledDate(pickerDay, pickerMonth, pickerYear, pickerSlot)}
                    </Text>
                  </>
                )}

                {selectedPaymentMethodId && (
                  <>
                    <Text style={[styles.label, { marginTop: verticalScale(12) }]}>
                      {serviceRequests.confirmPaymentLabel}
                    </Text>
                    <Text style={styles.optionSubtext}>
                      {paymentMethodOptions.find((m) => m.id === selectedPaymentMethodId)?.label ?? "—"}
                    </Text>
                  </>
                )}

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: verticalScale(16), paddingTop: verticalScale(12), borderTopWidth: 1, borderTopColor: "#E2E8F0" }}>
                  <Text style={[styles.label, { marginTop: 0 }]}>{serviceRequests.confirmTotalLabel}</Text>
                  <Text style={[styles.optionPrice, { fontSize: moderateScale(15, 0.3) }]}>
                    {formatBRL(selectedServices.reduce((sum, service) => {
                      const hours = serviceHours[service.id] ?? 1;
                      return sum + (service.unit === "hora" ? service.price * hours : service.price);
                    }, 0))}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={{ paddingHorizontal: moderateScale(24, 0.5), gap: verticalScale(8) }}>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={executeSubmit}
                testID="confirm-submit-button"
              >
                <Text style={styles.modalConfirmButtonText}>{serviceRequests.confirmButton}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmButton, { backgroundColor: "transparent", borderWidth: 1, borderColor: "#CBD5E1" }]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={[styles.modalConfirmButtonText, { color: "#0F172A" }]}>
                  {serviceRequests.confirmCancelButton}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Toast toast={toast} opacity={toastOpacity} />
    </View>
  );
}
