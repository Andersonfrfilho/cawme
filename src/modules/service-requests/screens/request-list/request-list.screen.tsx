import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useServiceRequests } from "@/modules/service-requests/hooks/useServiceRequests";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { useToast } from "@/shared/hooks/useToast";
import { useLoading } from "@/shared/hooks/useLoading";
import { Toast } from "@/shared/components/Toast";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

import type { ServiceRequest, ServiceRequestStatus } from "../../types/service-requests.types";
import styles from "./styles";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type StatusStyleKey =
  | "statusBadgePending"
  | "statusBadgeAccepted"
  | "statusBadgeRejected"
  | "statusBadgeCompleted"
  | "statusBadgeCancelled";

type StatusTextKey =
  | "statusTextPending"
  | "statusTextAccepted"
  | "statusTextRejected"
  | "statusTextCompleted"
  | "statusTextCancelled";

function getStatusBadgeStyle(status: ServiceRequestStatus): StatusStyleKey {
  const map: Record<ServiceRequestStatus, StatusStyleKey> = {
    PENDING: "statusBadgePending",
    ACCEPTED: "statusBadgeAccepted",
    REJECTED: "statusBadgeRejected",
    COMPLETED: "statusBadgeCompleted",
    CANCELLED: "statusBadgeCancelled",
  };
  return map[status];
}

function getStatusTextStyle(status: ServiceRequestStatus): StatusTextKey {
  const map: Record<ServiceRequestStatus, StatusTextKey> = {
    PENDING: "statusTextPending",
    ACCEPTED: "statusTextAccepted",
    REJECTED: "statusTextRejected",
    COMPLETED: "statusTextCompleted",
    CANCELLED: "statusTextCancelled",
  };
  return map[status];
}

export default function RequestListScreen() {
  const insets = useSafeAreaInsets();
  const { serviceRequests } = useLocale<LocaleKeys>();
  const user = useAuthStore((state) => state.user);
  const { listMyRequests, cancelRequest, acceptRequest, rejectRequest, completeRequest } =
    useServiceRequests();
  const { toast, toastOpacity, showToast } = useToast();
  const { isLoading } = useLoading();

  const isProvider = user?.type === "provider";

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = useCallback(async () => {
    try {
      const list = await listMyRequests();
      setRequests(list);
    } catch {
      showToast(serviceRequests.loadError, "error");
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  async function handleRefresh(): Promise<void> {
    setRefreshing(true);
    await loadRequests().catch(() => null);
    setRefreshing(false);
  }

  async function handleCancel(id: string): Promise<void> {
    try {
      const updated = await cancelRequest(id);
      setRequests((prev) => prev.map((request) => (request.id === id ? updated : request)));
      showToast(serviceRequests.cancelSuccess, "success");
    } catch {
      showToast(serviceRequests.cancelError, "error");
    }
  }

  async function handleAccept(id: string): Promise<void> {
    try {
      const updated = await acceptRequest(id);
      setRequests((prev) => prev.map((request) => (request.id === id ? updated : request)));
      showToast(serviceRequests.acceptSuccess, "success");
    } catch {
      showToast(serviceRequests.actionError, "error");
    }
  }

  async function handleReject(id: string): Promise<void> {
    try {
      const updated = await rejectRequest(id);
      setRequests((prev) => prev.map((request) => (request.id === id ? updated : request)));
      showToast(serviceRequests.rejectSuccess, "success");
    } catch {
      showToast(serviceRequests.actionError, "error");
    }
  }

  async function handleComplete(id: string): Promise<void> {
    try {
      const updated = await completeRequest(id);
      setRequests((prev) => prev.map((request) => (request.id === id ? updated : request)));
      showToast(serviceRequests.completeSuccess, "success");
    } catch {
      showToast(serviceRequests.actionError, "error");
    }
  }

  const statusLabels: Record<ServiceRequestStatus, string> = {
    PENDING: serviceRequests.statusPending,
    ACCEPTED: serviceRequests.statusAccepted,
    REJECTED: serviceRequests.statusRejected,
    COMPLETED: serviceRequests.statusCompleted,
    CANCELLED: serviceRequests.statusCancelled,
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{serviceRequests.myRequestsTitle}</Text>
        {isProvider ? (
          <TouchableOpacity
            onPress={() => router.push("/service-requests/schedule" as any)}
            hitSlop={8}
          >
            <Ionicons name="calendar-outline" size={24} color={theme.palette.neutral[0]} />
          </TouchableOpacity>
        ) : null}
      </View>

      {requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="document-text-outline"
            size={moderateScale(56, 0.3)}
            color={theme.colors.border.DEFAULT}
          />
          <Text style={styles.emptyTitle}>{serviceRequests.emptyList}</Text>
          <Text style={styles.emptySubtitle}>{serviceRequests.emptyListSubtitle}</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary.DEFAULT]}
              tintColor={theme.colors.primary.DEFAULT}
            />
          }
        >
          {requests.map((request) => (
            <View key={request.id} style={styles.card} testID={`request-card-${request.id}`}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardDate}>{formatDate(request.createdAt)}</Text>
                <View style={[styles.statusBadge, styles[getStatusBadgeStyle(request.status)]]}>
                  <Text
                    style={[styles.statusText, styles[getStatusTextStyle(request.status)]]}
                  >
                    {statusLabels[request.status]}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardServiceId} numberOfLines={1}>
                  ID: {request.id.slice(0, 8)}...
                </Text>
                {request.description ? (
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {request.description}
                  </Text>
                ) : null}
              </View>

              {!isProvider && request.status === "PENDING" && (
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleCancel(request.id)}
                    disabled={isLoading}
                    testID={`cancel-button-${request.id}`}
                  >
                    <Text style={styles.cancelButtonText}>{serviceRequests.cancelButton}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!isProvider && request.status === "ACCEPTED" && (
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.completeButton]}
                    onPress={() => handleComplete(request.id)}
                    disabled={isLoading}
                    testID={`complete-button-${request.id}`}
                  >
                    <Text style={styles.completeButtonText}>{serviceRequests.completeButton}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleCancel(request.id)}
                    disabled={isLoading}
                    testID={`cancel-accepted-button-${request.id}`}
                  >
                    <Text style={styles.cancelButtonText}>{serviceRequests.cancelButton}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {isProvider && request.status === "PENDING" && (
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAccept(request.id)}
                    disabled={isLoading}
                    testID={`accept-button-${request.id}`}
                  >
                    <Text style={styles.acceptButtonText}>{serviceRequests.acceptButton}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReject(request.id)}
                    disabled={isLoading}
                    testID={`reject-button-${request.id}`}
                  >
                    <Text style={styles.rejectButtonText}>{serviceRequests.rejectButton}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <Toast toast={toast} opacity={toastOpacity} />
    </View>
  );
}
