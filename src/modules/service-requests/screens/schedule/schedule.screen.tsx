import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useServiceRequests } from "@/modules/service-requests/hooks/useServiceRequests";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { useToast } from "@/shared/hooks/useToast";
import { Toast } from "@/shared/components/Toast";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import type { ServiceRequest, ServiceRequestStatus } from "../../types/service-requests.types";
import { styles } from "./styles";

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const WEEK_DAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const STATUS_LABEL_COLORS: Record<ServiceRequestStatus, { badge: string; text: string }> = {
  PENDING:   { badge: "#FFF7ED", text: "#C2410C" },
  ACCEPTED:  { badge: "#F0FDF4", text: "#15803D" },
  REJECTED:  { badge: "#FEF2F2", text: "#B91C1C" },
  COMPLETED: { badge: "#EFF6FF", text: "#1D4ED8" },
  CANCELLED: { badge: theme.colors.background.elevated, text: theme.colors.text.secondary },
};

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatSelectedDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

function formatScheduledTime(isoDate: string): string {
  const date = new Date(isoDate);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { serviceRequests: locale } = useLocale<LocaleKeys>();
  const { listMyRequests } = useServiceRequests();
  const { toast, toastOpacity, showToast } = useToast();

  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    try {
      const list = await listMyRequests();
      setRequests(list);
    } catch {
      showToast(locale.loadError, "error");
    } finally {
      setCalendarLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  function prevMonth(): void {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth(): void {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const appointmentDates = useMemo(() => {
    const set = new Set<string>();
    for (const request of requests) {
      if (request.scheduledAt) {
        set.add(request.scheduledAt.slice(0, 10));
      }
    }
    return set;
  }, [requests]);

  const selectedRequests = useMemo(
    () => requests.filter((r) => r.scheduledAt?.startsWith(selectedDate)),
    [requests, selectedDate],
  );

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const calendarRows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) calendarRows.push(cells.slice(i, i + 7));

  const statusLabels: Record<ServiceRequestStatus, string> = {
    PENDING:   locale.statusPending,
    ACCEPTED:  locale.statusAccepted,
    REJECTED:  locale.statusRejected,
    COMPLETED: locale.statusCompleted,
    CANCELLED: locale.statusCancelled,
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons
            name="arrow-back"
            size={moderateScale(24, 0.3)}
            color={theme.palette.neutral[0]}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{locale.scheduleTitle}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.calendarCard}>
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={prevMonth} hitSlop={8} style={styles.navButton}>
              <Ionicons
                name="chevron-back"
                size={moderateScale(22, 0.3)}
                color={theme.colors.primary.DEFAULT}
              />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {MONTHS_PT[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} hitSlop={8} style={styles.navButton}>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(22, 0.3)}
                color={theme.colors.primary.DEFAULT}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDayRow}>
            {WEEK_DAYS_SHORT.map((dayLabel) => (
              <Text key={dayLabel} style={styles.weekDayLabel}>
                {dayLabel}
              </Text>
            ))}
          </View>

          {calendarRows.map((row) => {
            const rowKey = row.find((d) => d !== null) ?? "extra";
            return (
              <View key={`week-${rowKey}`} style={styles.gridRow}>
                {row.map((day, colIndex) => {
                  if (!day) {
                    return <View key={`empty-${colIndex}`} style={styles.dayCell} />;
                  }
                  const dateKey = toDateKey(viewYear, viewMonth, day);
                  const isSelected = dateKey === selectedDate;
                  const isToday = dateKey === todayKey;
                  const hasAppointment = appointmentDates.has(dateKey);
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayCell,
                        isSelected && styles.dayCellSelected,
                        !isSelected && isToday && styles.dayCellToday,
                      ]}
                      onPress={() => setSelectedDate(dateKey)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dayNumber,
                          isSelected && styles.dayNumberSelected,
                          !isSelected && isToday && styles.dayNumberToday,
                        ]}
                      >
                        {day}
                      </Text>
                      {hasAppointment ? (
                        <View style={[styles.dot, isSelected && styles.dotSelected]} />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>

        <View style={styles.appointmentsSection}>
          <Text style={styles.appointmentsTitle}>
            {locale.scheduleSelectedDay} {formatSelectedDate(selectedDate)}
          </Text>

          {calendarLoading ? (
            <ActivityIndicator
              size="large"
              color={theme.colors.primary.DEFAULT}
              style={{ marginTop: verticalScale(24) }}
            />
          ) : selectedRequests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="calendar-outline"
                size={moderateScale(40, 0.3)}
                color={theme.colors.border.DEFAULT}
              />
              <Text style={styles.emptyText}>{locale.scheduleEmpty}</Text>
            </View>
          ) : (
            selectedRequests.map((request) => {
              const labelColors = STATUS_LABEL_COLORS[request.status];
              return (
                <View key={request.id} style={styles.appointmentCard}>
                  <View style={styles.appointmentTop}>
                    {request.scheduledAt ? (
                      <Text style={styles.appointmentTime}>
                        {formatScheduledTime(request.scheduledAt)}
                      </Text>
                    ) : null}
                    <View
                      style={[styles.statusBadge, { backgroundColor: labelColors.badge }]}
                    >
                      <Text style={[styles.statusText, { color: labelColors.text }]}>
                        {statusLabels[request.status]}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.appointmentId}>
                    ID: {request.id.slice(0, 8)}...
                  </Text>
                  {request.description ? (
                    <Text style={styles.appointmentDescription} numberOfLines={2}>
                      {request.description}
                    </Text>
                  ) : null}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <Toast toast={toast} opacity={toastOpacity} />
    </View>
  );
}
