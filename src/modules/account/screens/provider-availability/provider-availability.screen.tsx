import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useLocale, LocaleKeys } from '@/shared/locales';
import { theme } from '@/shared/constants';
import { moderateScale, verticalScale } from '@/shared/utils/scale';
import { DAY_LABELS } from '@/modules/auth/screens/provider-profile/types';
import { TimeWheelPicker } from '@/shared/components/TimeWheelPicker';
import type { ProviderAvailabilityDto } from '@/modules/auth/services/types';
import { toMinutes, dayHasRoom, nextAvailableStart, nextAvailableEnd, mergeAdjacentSlots } from './utils';
import styles from './styles';

const DAY_NUMBERS = [0, 1, 2, 3, 4, 5, 6] as const;
const TOAST_DURATION_MS = 3000;

function toHHmm(time: string): string {
  return time.length > 5 ? time.substring(0, 5) : time;
}

function extractApiMessage(error: unknown): string | null {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return null;
}

type ToastState = {
  message: string;
  type: 'success' | 'error';
};

const SURCHARGE_PRESETS = [0, 25, 50, 100] as const;

type AddingState = {
  startTime: string;
  endTime: string;
  additionalPercentage: number;
  saving: boolean;
};

type CopyState = {
  sourceDay: number;
  selectedDays: Set<number>;
  saving: boolean;
};

export default function ProviderAvailabilityScreen() {
  const insets = useSafeAreaInsets();
  const { account } = useLocale<LocaleKeys>();
  const { getProviderAvailability, setProviderAvailability, deleteProviderAvailability } = useAuth();

  const [slots, setSlots] = useState<ProviderAvailabilityDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [addingDay, setAddingDay] = useState<number | null>(null);
  const [addingState, setAddingState] = useState<AddingState>({
    startTime: '09:00',
    endTime: '17:00',
    saving: false,
  });
  const [copyState, setCopyState] = useState<CopyState | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastState['type']) => {
      if (toastDismissTimer.current) clearTimeout(toastDismissTimer.current);
      setToast({ message, type });
      toastOpacity.setValue(0);
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
      toastDismissTimer.current = setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setToast(null));
      }, TOAST_DURATION_MS);
    },
    [toastOpacity],
  );

  const loadAvailability = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getProviderAvailability();
      setSlots(
        (result.data ?? []).map((slot) => ({
          ...slot,
          startTime: toHHmm(slot.startTime),
          endTime: toHHmm(slot.endTime),
        })),
      );
    } catch {
      showToast(account.providerAvailabilitySaveError, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const slotsForDay = (day: number) =>
    slots
      .filter((slot) => slot.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleDelete = async (ids: string[]) => {
    setDeletingIds(new Set(ids));
    try {
      await Promise.all(ids.map((id) => deleteProviderAvailability(id)));
      setSlots((previous) => previous.filter((slot) => !ids.includes(slot.id)));
      showToast('Faixa removida', 'success');
    } catch (error) {
      const apiMessage = extractApiMessage(error);
      showToast(apiMessage ?? account.providerAvailabilitySaveError, 'error');
    } finally {
      setDeletingIds(new Set());
    }
  };

  const handleOpenAdd = (day: number) => {
    const daySlots = slotsForDay(day);
    const startTime = nextAvailableStart(daySlots);
    const endTime = nextAvailableEnd(daySlots, startTime);
    setAddingDay(day);
    setAddingState({ startTime, endTime, additionalPercentage: 0, saving: false });
  };

  const handleConfirmAdd = async () => {
    if (addingDay === null) return;
    setAddingState((previous) => ({ ...previous, saving: true }));
    try {
      await setProviderAvailability({
        dayOfWeek: addingDay,
        startTime: addingState.startTime,
        endTime: addingState.endTime,
        additionalPercentage: addingState.additionalPercentage,
      });
      setAddingDay(null);
      await loadAvailability();
      showToast('Faixa adicionada', 'success');
    } catch (error) {
      const apiMessage = extractApiMessage(error);
      showToast(apiMessage ?? account.providerAvailabilitySaveError, 'error');
      setAddingState((previous) => ({ ...previous, saving: false }));
    }
  };

  const handleOpenCopy = (sourceDay: number) => {
    setCopyState({ sourceDay, selectedDays: new Set(), saving: false });
  };

  const handleToggleCopyDay = (day: number) => {
    setCopyState((previous) => {
      if (!previous) return previous;
      const next = new Set(previous.selectedDays);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return { ...previous, selectedDays: next };
    });
  };

  const handleConfirmCopy = async () => {
    if (!copyState || copyState.selectedDays.size === 0) return;
    const mergedSourceSlots = mergeAdjacentSlots(slotsForDay(copyState.sourceDay));
    setCopyState((previous) => previous && { ...previous, saving: true });

    let successCount = 0;
    let errorCount = 0;

    for (const targetDay of copyState.selectedDays) {
      for (const group of mergedSourceSlots) {
        try {
          await setProviderAvailability({
            dayOfWeek: targetDay,
            startTime: group.startTime,
            endTime: group.endTime,
            additionalPercentage: group.additionalPercentage,
          });
          successCount += 1;
        } catch {
          errorCount += 1;
        }
      }
    }

    setCopyState(null);
    await loadAvailability();

    if (errorCount > 0 && successCount === 0) {
      showToast('Nenhum horário foi copiado — verifique conflitos', 'error');
    } else if (errorCount > 0) {
      showToast(`${successCount} faixas copiadas, ${errorCount} com conflito`, 'error');
    } else {
      showToast(
        `${successCount} ${successCount === 1 ? 'faixa copiada' : 'faixas copiadas'}`,
        'success',
      );
    }
  };

  const totalSlots = slots.length;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={moderateScale(24, 0.3)} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{account.providerAvailabilityTitle}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary.DEFAULT} />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>{account.providerAvailabilitySubtitle}</Text>

          {DAY_NUMBERS.map((day) => {
            const daySlots = slotsForDay(day);
            const isAddingThisDay = addingDay === day;
            const hasRoom = dayHasRoom(daySlots);

            return (
              <View key={day} style={[styles.dayRow, day === 6 && styles.dayRowLast]}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayLabel}>{DAY_LABELS[day]}</Text>
                  {daySlots.length === 0 && !isAddingThisDay && (
                    <Text style={styles.unavailableText}>Indisponível</Text>
                  )}
                  {daySlots.length > 0 && (
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={() => handleOpenCopy(day)}
                      hitSlop={8}
                      disabled={isAddingThisDay || copyState !== null}
                    >
                      <Ionicons
                        name="copy-outline"
                        size={moderateScale(18, 0.3)}
                        color={theme.colors.text.secondary}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleOpenAdd(day)}
                    hitSlop={8}
                    disabled={isAddingThisDay || !hasRoom}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={moderateScale(22, 0.3)}
                      color={
                        isAddingThisDay || !hasRoom
                          ? theme.colors.text.tertiary
                          : theme.colors.primary.DEFAULT
                      }
                    />
                  </TouchableOpacity>
                </View>

                {!hasRoom && daySlots.length > 0 && (
                  <Text style={styles.fullDayText}>Dia totalmente preenchido</Text>
                )}

                {mergeAdjacentSlots(daySlots).map((group) => (
                  <View key={group.ids[0]} style={styles.slotRow}>
                    <Ionicons
                      name="time-outline"
                      size={moderateScale(14, 0.3)}
                      color={theme.colors.text.secondary}
                    />
                    <Text style={styles.slotText}>
                      {group.startTime} — {group.endTime}
                    </Text>
                    {group.additionalPercentage > 0 && (
                      <View style={styles.surchargeBadge}>
                        <Text style={styles.surchargeBadgeText}>+{group.additionalPercentage}%</Text>
                      </View>
                    )}
                    {group.ids.some((id) => deletingIds.has(id)) ? (
                      <ActivityIndicator size="small" color={theme.colors.text.tertiary} />
                    ) : (
                      <TouchableOpacity onPress={() => handleDelete(group.ids)} hitSlop={8}>
                        <Ionicons
                          name="trash-outline"
                          size={moderateScale(16, 0.3)}
                          color={theme.palette.error[500]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                {isAddingThisDay && (
                  <View style={styles.addForm}>
                    <View style={styles.timeRow}>
                      <View style={styles.timePickerBlock}>
                        <Text style={styles.timePickerLabel}>Início</Text>
                        <TimeWheelPicker
                          value={addingState.startTime}
                          onChange={(value) =>
                            setAddingState((previous) => {
                              const minEnd = toMinutes(value) + 15;
                              const currentEnd = toMinutes(previous.endTime);
                              if (currentEnd <= toMinutes(value)) {
                                const endHour = Math.floor(minEnd / 60);
                                const endMin = minEnd % 60;
                                const newEnd =
                                  endHour < 24
                                    ? `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`
                                    : '23:45';
                                return { ...previous, startTime: value, endTime: newEnd };
                              }
                              return { ...previous, startTime: value };
                            })
                          }
                        />
                      </View>
                      <View style={styles.timeArrow}>
                        <Ionicons
                          name="arrow-forward"
                          size={moderateScale(18, 0.3)}
                          color={theme.colors.text.tertiary}
                        />
                      </View>
                      <View style={styles.timePickerBlock}>
                        <Text style={styles.timePickerLabel}>Fim</Text>
                        <TimeWheelPicker
                          value={addingState.endTime}
                          minValue={addingState.startTime}
                          onChange={(value) =>
                            setAddingState((previous) => ({ ...previous, endTime: value }))
                          }
                        />
                      </View>
                    </View>
                    <View style={styles.surchargeRow}>
                      <Text style={styles.surchargeLabel}>Adicional</Text>
                      <View style={styles.surchargePresets}>
                        {SURCHARGE_PRESETS.map((preset) => (
                          <TouchableOpacity
                            key={preset}
                            style={[
                              styles.surchargePreset,
                              addingState.additionalPercentage === preset &&
                                styles.surchargePresetActive,
                            ]}
                            onPress={() =>
                              setAddingState((previous) => ({
                                ...previous,
                                additionalPercentage: preset,
                              }))
                            }
                            disabled={addingState.saving}
                          >
                            <Text
                              style={[
                                styles.surchargePresetText,
                                addingState.additionalPercentage === preset &&
                                  styles.surchargePresetTextActive,
                              ]}
                            >
                              {preset === 0 ? 'Sem adicional' : `+${preset}%`}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.addFormActions}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setAddingDay(null)}
                        disabled={addingState.saving}
                      >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.confirmButton, addingState.saving && styles.confirmButtonDisabled]}
                        onPress={handleConfirmAdd}
                        disabled={addingState.saving}
                      >
                        {addingState.saving ? (
                          <ActivityIndicator size="small" color={theme.palette.neutral[0]} />
                        ) : (
                          <Text style={styles.confirmButtonText}>Adicionar</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              {totalSlots} {totalSlots === 1 ? 'faixa cadastrada' : 'faixas cadastradas'}
            </Text>
          </View>
        </ScrollView>
      )}

      {toast !== null && (
        <Animated.View
          style={[
            styles.toast,
            toast.type === 'success' ? styles.toastSuccess : styles.toastError,
            { opacity: toastOpacity, bottom: insets.bottom + verticalScale(24) },
          ]}
          pointerEvents="none"
        >
          <Ionicons
            name={toast.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
            size={moderateScale(18, 0.3)}
            color={theme.palette.neutral[0]}
          />
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}

      <Modal
        visible={copyState !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setCopyState(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Copiar horários para</Text>
            <Text style={styles.modalSubtitle}>
              {copyState === null ? '' : `Faixas de ${DAY_LABELS[copyState.sourceDay]}`}
            </Text>

            {DAY_NUMBERS.filter((day) => day !== copyState?.sourceDay).map((day) => {
              const isSelected = copyState?.selectedDays.has(day) ?? false;
              return (
                <TouchableOpacity
                  key={day}
                  style={styles.modalDayRow}
                  onPress={() => handleToggleCopyDay(day)}
                  disabled={copyState?.saving}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={moderateScale(14, 0.3)}
                        color={theme.palette.neutral[0]}
                      />
                    )}
                  </View>
                  <Text style={styles.modalDayLabel}>{DAY_LABELS[day]}</Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setCopyState(null)}
                disabled={copyState?.saving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  (copyState?.selectedDays.size === 0 || copyState?.saving) &&
                    styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirmCopy}
                disabled={copyState?.selectedDays.size === 0 || copyState?.saving}
              >
                {copyState?.saving ? (
                  <ActivityIndicator size="small" color={theme.palette.neutral[0]} />
                ) : (
                  <Text style={styles.confirmButtonText}>Aplicar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
