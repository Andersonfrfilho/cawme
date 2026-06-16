import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useServiceRequests } from "@/modules/service-requests/hooks/useServiceRequests";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { useToast } from "@/shared/hooks/useToast";
import { useLoading } from "@/shared/hooks/useLoading";
import { Toast } from "@/shared/components/Toast";
import { theme } from "@/shared/constants";
import { formatBRL } from "@/shared/utils/currency";
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

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

export default function RequestListScreen({ hideHeader }: { hideHeader?: boolean }) {
  const insets = useSafeAreaInsets();
  const { serviceRequests } = useLocale<LocaleKeys>();
  const user = useAuthStore((state) => state.user);
  const { listMyRequests, cancelRequest, acceptRequest, rejectRequest, completeRequest } =
    useServiceRequests();
  const { toast, toastOpacity, showToast } = useToast();
  const { isLoading } = useLoading();

  const isProvider = user?.type === "provider";
  const { logout } = useAuth();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [detailRequest, setDetailRequest] = useState<ServiceRequest | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      const list = await listMyRequests();
      setRequests(list);
    } catch {
      showToast(serviceRequests.loadError, "error");
    }
  }, [listMyRequests, showToast, serviceRequests.loadError]);

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
    <View style={hideHeader ? { flex: 1 } : styles.root}>
      {!hideHeader && (
        <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
          {router.canGoBack() && (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
              <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{serviceRequests.myRequestsTitle}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {isProvider ? (
              <TouchableOpacity
                onPress={() => router.push("/service-requests/schedule" as any)}
                hitSlop={8}
              >
                <Ionicons name="calendar-outline" size={24} color={theme.palette.neutral[0]} />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={() => router.push("/(app)/account/profile-edit" as any)} hitSlop={8}>
              <Ionicons name="person-circle-outline" size={24} color={theme.palette.neutral[0]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} hitSlop={8}>
              <Ionicons name="log-out-outline" size={24} color={theme.palette.neutral[0]} />
            </TouchableOpacity>
          </View>
        </View>
      )}

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
            <TouchableOpacity
              key={request.id}
              style={styles.card}
              testID={`request-card-${request.id}`}
              activeOpacity={0.7}
              onPress={() => setDetailRequest(request)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  {!isProvider && request.provider && (
                    <View style={styles.cardAvatar}>
                      <Ionicons name="person" size={moderateScale(16, 0.3)} color={theme.colors.primary.DEFAULT} />
                    </View>
                  )}
                  <View>
                    <Text style={styles.cardDate}>
                      {request.scheduledAt
                        ? formatDateTime(request.scheduledAt)
                        : formatDate(request.createdAt)}
                    </Text>
                    <Text style={styles.cardCode}>
                      Cód. {request.id.slice(0, 8).toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, styles[getStatusBadgeStyle(request.status)]]}>
                  <Text
                    style={[styles.statusText, styles[getStatusTextStyle(request.status)]]}
                  >
                    {statusLabels[request.status]}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                {request.service?.name && (
                  <Text style={styles.cardServiceName} numberOfLines={1}>
                    {request.service.name}
                  </Text>
                )}
                {isProvider && request.provider?.businessName ? null : (
                  request.provider?.businessName && (
                    <Text style={styles.cardProviderName} numberOfLines={1}>
                      {request.provider.businessName}
                    </Text>
                  )
                )}
                {request.address && (
                  <Text style={styles.cardAddress} numberOfLines={1}>
                    {[request.address.street, request.address.number].filter(Boolean).join(", ")}
                    {request.address.neighborhood ? ` — ${request.address.neighborhood}` : ""}
                    {" — "}{request.address.city}/{request.address.state}
                  </Text>
                )}
                {request.description ? (
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {request.description}
                  </Text>
                ) : null}
              </View>

              <View style={styles.cardMeta}>
                <View style={styles.cardMetaLeft}>
                  {request.priceFinal != null && (
                    <Text style={styles.cardMetaText}>{formatBRL(request.priceFinal)}</Text>
                  )}
                  {request.paymentMethodType?.label && (
                    <Text style={styles.cardPaymentMethod}>{request.paymentMethodType.label}</Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={moderateScale(14, 0.3)}
                  color={theme.colors.text.tertiary}
                />
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
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Detail modal */}
      <Modal
        visible={detailRequest !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailRequest(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDetailRequest(null)}
        >
          <TouchableOpacity
            style={styles.modalSheet}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.modalHandle} />
            <ScrollView>
              {detailRequest && (
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Detalhes da solicitação</Text>
                    <View style={[styles.statusBadge, styles[getStatusBadgeStyle(detailRequest.status)]]}>
                      <Text style={[styles.statusText, styles[getStatusTextStyle(detailRequest.status)]]}>
                        {statusLabels[detailRequest.status]}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Data de criação</Text>
                    <Text style={styles.detailValue}>{formatDateTime(detailRequest.createdAt)}</Text>
                  </View>

                  {detailRequest.scheduledAt && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Agendado para</Text>
                      <Text style={styles.detailValue}>{formatDateTime(detailRequest.scheduledAt)}</Text>
                    </View>
                  )}

                  {detailRequest.priceFinal != null && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Preço</Text>
                      <Text style={styles.detailValue}>{formatBRL(detailRequest.priceFinal)}</Text>
                    </View>
                  )}

                  {detailRequest.service?.name && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Serviço</Text>
                      <Text style={styles.detailValue}>{detailRequest.service.name}</Text>
                    </View>
                  )}

                  {detailRequest.address && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Endereço</Text>
                      <Text style={styles.detailValue}>
                        {[detailRequest.address.street, detailRequest.address.number].filter(Boolean).join(", ")}
                        {"\n"}{detailRequest.address.city}/{detailRequest.address.state}
                      </Text>
                    </View>
                  )}

                  {detailRequest.address?.latitude && detailRequest.address?.longitude && (
                    <View style={styles.detailMapContainer}>
                      <MapView
                        style={styles.detailMap}
                        initialRegion={{
                          latitude: Number(detailRequest.address.latitude),
                          longitude: Number(detailRequest.address.longitude),
                          latitudeDelta: 0.005,
                          longitudeDelta: 0.005,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                      >
                        <Marker
                          coordinate={{
                            latitude: Number(detailRequest.address.latitude),
                            longitude: Number(detailRequest.address.longitude),
                          }}
                        />
                      </MapView>
                    </View>
                  )}

                  {!isProvider && detailRequest.provider?.businessName && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Prestador</Text>
                      <Text style={styles.detailValue}>{detailRequest.provider.businessName}</Text>
                    </View>
                  )}

                  {detailRequest.paymentMethodType?.label && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Pagamento</Text>
                      <Text style={styles.detailValue}>{detailRequest.paymentMethodType.label}</Text>
                    </View>
                  )}

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Descrição</Text>
                    <Text style={styles.detailDescription}>
                      {detailRequest.description || "Nenhuma descrição fornecida."}
                    </Text>
                  </View>

                  {!isProvider && detailRequest.status === "PENDING" && (
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => { handleCancel(detailRequest.id); setDetailRequest(null); }}
                        disabled={isLoading}
                      >
                        <Text style={styles.cancelButtonText}>{serviceRequests.cancelButton}</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {!isProvider && detailRequest.status === "ACCEPTED" && (
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.completeButton]}
                        onPress={() => { handleComplete(detailRequest.id); setDetailRequest(null); }}
                        disabled={isLoading}
                      >
                        <Text style={styles.completeButtonText}>{serviceRequests.completeButton}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => { handleCancel(detailRequest.id); setDetailRequest(null); }}
                        disabled={isLoading}
                      >
                        <Text style={styles.cancelButtonText}>{serviceRequests.cancelButton}</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {isProvider && detailRequest.status === "PENDING" && (
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => { handleAccept(detailRequest.id); setDetailRequest(null); }}
                        disabled={isLoading}
                      >
                        <Text style={styles.acceptButtonText}>{serviceRequests.acceptButton}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => { handleReject(detailRequest.id); setDetailRequest(null); }}
                        disabled={isLoading}
                      >
                        <Text style={styles.rejectButtonText}>{serviceRequests.rejectButton}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Toast toast={toast} opacity={toastOpacity} />
    </View>
  );
}
