import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, Linking, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { RequestItemProps } from "./types";
import { styles } from "./styles";
import { theme } from "@/shared/constants";
import { formatBRL } from "@/shared/utils/currency";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

const STATUS_PT: Record<string, string> = {
  PENDING: "Pendente",
  ACCEPTED: "Aceito",
  REJECTED: "Recusado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#F5A623",
  ACCEPTED: "#22C55E",
  REJECTED: "#EF4444",
  COMPLETED: "#1A45E8",
  CANCELLED: "#9CA3AF",
};

function openMaps(address: { street: string; number: string; city: string; state: string; latitude?: string; longitude?: string }) {
  const query = encodeURIComponent(`${address.street}, ${address.number}, ${address.city}, ${address.state}`);
  if (address.latitude && address.longitude) {
    const url = Platform.select({
      ios: `maps://app?daddr=${address.latitude},${address.longitude}&q=${query}`,
      android: `geo:${address.latitude},${address.longitude}?q=${query}`,
    });
    if (url) Linking.openURL(url);
  } else {
    Linking.openURL(`https://maps.google.com/?q=${query}`);
  }
}

function fmtDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type PendingAction = {
  title: string;
  message: string;
  action: () => void;
  color: string;
};

export function RequestItemComponent({ item, onAccept, onReject, onComplete, onCancel }: RequestItemProps) {
  const [showModal, setShowModal] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const status = item.status?.toUpperCase() ?? "PENDING";

  // Formata minutos em horas:minutos se > 60min
  function fmtDuration(minutes: number): string {
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h}h${m}min` : `${h}h`;
    }
    return `${minutes}min`;
  }

  // Calcula tempo estimado de viagem (~5 min/km em área urbana)
  const travelMinutes = distance ? Math.max(5, Math.round(distance * 5)) : null;
  const readyTime = travelMinutes && item.scheduledAt
    ? new Date(new Date(item.scheduledAt).getTime() - travelMinutes * 60000)
    : null;

  // Calcula duração baseada no priceType
  let durationMin: number | null = null;
  if (item.priceType === 'HOUR' && item.priceBase && item.priceFinal) {
    durationMin = Math.round((item.priceFinal / item.priceBase) * 60);
  } else if (item.priceType === 'DAY') {
    durationMin = 480; // 8h
  }

  const endTime = item.scheduledAt && durationMin
    ? new Date(new Date(item.scheduledAt).getTime() + durationMin * 60000)
    : null;

  useEffect(() => {
    if (item.address?.latitude && item.address?.longitude) {
      Location.getCurrentPositionAsync({}).then((pos) => {
        const d = haversine(
          pos.coords.latitude, pos.coords.longitude,
          Number(item.address!.latitude), Number(item.address!.longitude)
        );
        setDistance(Math.round(d * 10) / 10);
      }).catch(() => {});
    }
  }, [item.address?.latitude, item.address?.longitude]);

  function requestConfirm(action: () => void, title: string, message: string, color: string) {
    setPendingAction({ action, title, message, color });
  }

  function dismissModal() {
    setShowModal(false);
    setPendingAction(null);
  }

  return (
    <>
      <TouchableOpacity
        style={styles.requestCard}
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
        testID="request-item"
      >
        <View style={styles.cardTop}>
          <View style={styles.avatarContainer}>
            {item.providerAvatar ? (
              <Image source={{ uri: item.providerAvatar }} style={styles.avatar} />
            ) : (
              <Ionicons name="person" size={18} color={theme.colors.primary.DEFAULT} />
            )}
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.serviceName} numberOfLines={1}>{item.serviceName || item.title}</Text>
            {(item.contractorName || item.providerName) && (
              <Text style={styles.personName} numberOfLines={1}>
                {item.contractorName || item.providerName}
              </Text>
            )}
          </View>
          <View style={[styles.statusChip, { backgroundColor: (STATUS_COLOR[status] || "#9CA3AF") + "20" }]}>
            <Text style={[styles.statusChipText, { color: STATUS_COLOR[status] || "#9CA3AF" }]}>
              {STATUS_PT[status] || status}
            </Text>
          </View>
        </View>

        {item.address && (
          <Text style={styles.addressLine} numberOfLines={1}>
            <Ionicons name="location-outline" size={12} color={theme.colors.text.secondary} />{" "}
            {item.address.street}, {item.address.number} — {item.address.city}/{item.address.state}
          </Text>
        )}

        <View style={styles.cardBottom}>
          <View style={styles.pillsRow}>
            {item.priceFinal != null && (
              <View style={styles.pricePill}>
                <Text style={styles.pricePillText}>{formatBRL(item.priceFinal)}</Text>
              </View>
            )}
            {item.paymentMethod && (
              <View style={styles.paymentPill}>
                <Text style={styles.paymentPillText}>{item.paymentMethod}</Text>
              </View>
            )}
          </View>
          {item.scheduledAt && (
            <Text style={styles.scheduleDate}>
              <Ionicons name="calendar-outline" size={12} color={theme.colors.text.tertiary} />{" "}
              {fmtDate(item.scheduledAt)}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={dismissModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={dismissModal}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              {item && (
                <View style={styles.modalContent}>

                  <View style={styles.modalHero}>
                    <View style={styles.heroLeft}>
                      {item.providerAvatar ? (
                        <Image source={{ uri: item.providerAvatar }} style={styles.heroAvatar} />
                      ) : (
                        <View style={styles.heroIcon}>
                          <Ionicons name="person" size={22} color={theme.colors.primary.DEFAULT} />
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={styles.heroTitle}>{item.serviceName || item.title}</Text>
                        <Text style={styles.heroSubtitle}>
                          {item.contractorName ? `Solicitado por ${item.contractorName}` : item.providerName ? `Prestador: ${item.providerName}` : ""}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: STATUS_COLOR[status] + "20" }]}>
                      <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[status] }]} />
                      <Text style={[styles.statusPillText, { color: STATUS_COLOR[status] }]}>
                        {STATUS_PT[status] || status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoGrid}>
                    <View style={styles.infoCard}>
                      <Ionicons name="cash-outline" size={16} color={theme.colors.accent.green} />
                      <Text style={styles.infoCardLabel}>Valor</Text>
                      <Text style={styles.infoCardValue}>
                        {item.priceFinal != null ? formatBRL(item.priceFinal) : "A combinar"}
                      </Text>
                      {item.paymentMethod && (
                        <Text style={styles.infoCardSub}>{item.paymentMethod}</Text>
                      )}
                    </View>

                    {item.scheduledAt && (
                      <View style={styles.infoCard}>
                        <Ionicons name="calendar-outline" size={16} color={theme.colors.accent.yellow} />
                        <Text style={styles.infoCardLabel}>Agendado</Text>
                        <Text style={styles.infoCardValue}>{fmtDate(item.scheduledAt)}</Text>
                      </View>
                    )}

                    <View style={styles.infoCard}>
                      <Ionicons name="time-outline" size={16} color="#8B5CF6" />
                      <Text style={styles.infoCardLabel}>Duração</Text>
                      <Text style={styles.infoCardValue}>
                        {durationMin ? fmtDuration(durationMin) : "A combinar"}
                      </Text>
                      {endTime && (
                        <Text style={styles.infoCardSub}>
                          Término ~{endTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </Text>
                      )}
                    </View>

                    {(distance != null || travelMinutes != null || readyTime) && (
                      <View style={styles.infoCard}>
                        <Ionicons name="navigate-outline" size={16} color="#6366F1" />
                        <Text style={styles.infoCardLabel}>Deslocamento</Text>
                        <Text style={styles.infoCardValue}>
                          {distance != null ? `${distance} km` : ""}
                          {travelMinutes != null ? ` · ${fmtDuration(travelMinutes)}` : ""}
                        </Text>
                        {readyTime && (
                          <Text style={styles.infoCardSub}>
                            Sair às {readyTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>

                  {item.description && (
                    <View style={styles.detailBlock}>
                      <Text style={styles.blockTitle}>Descrição do serviço</Text>
                      <Text style={styles.detailDesc}>{item.description}</Text>
                    </View>
                  )}

                  {item.address && (
                    <View style={styles.detailBlock}>
                      <Text style={styles.blockTitle}>Local</Text>
                      <TouchableOpacity onPress={() => openMaps(item.address!)} style={styles.addressCard}>
                        <Ionicons name="location" size={18} color={theme.colors.primary.DEFAULT} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.addressName}>
                            {item.address.street}, {item.address.number}
                          </Text>
                          <Text style={styles.addressDetail}>
                            {item.address.neighborhood} — {item.address.city}/{item.address.state}
                          </Text>
                        </View>
                        <Ionicons name="open-outline" size={16} color={theme.colors.primary.DEFAULT} />
                      </TouchableOpacity>
                      {item.address.latitude && item.address.longitude && (
                        <View style={styles.mapContainer}>
                          <MapView
                            style={styles.detailMap}
                            initialRegion={{
                              latitude: Number(item.address.latitude),
                              longitude: Number(item.address.longitude),
                              latitudeDelta: 0.005,
                              longitudeDelta: 0.005,
                            }}
                            scrollEnabled={false}
                            zoomEnabled={false}
                          >
                            <Marker coordinate={{
                              latitude: Number(item.address.latitude),
                              longitude: Number(item.address.longitude),
                            }} />
                          </MapView>
                        </View>
                      )}
                    </View>
                  )}

                  {(onAccept || onReject || onComplete || onCancel) && (
                    pendingAction ? (
                      <View style={styles.confirmBox}>
                        <Text style={styles.confirmTitle}>{pendingAction.title}</Text>
                        <Text style={styles.confirmMessage}>{pendingAction.message}</Text>
                        <View style={styles.confirmButtons}>
                          <TouchableOpacity
                            style={styles.confirmCancelBtn}
                            onPress={() => setPendingAction(null)}
                          >
                            <Text style={styles.confirmCancelBtnText}>Voltar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.confirmActionBtn, { backgroundColor: pendingAction.color }]}
                            onPress={() => { pendingAction.action(); setPendingAction(null); setShowModal(false); }}
                          >
                            <Text style={styles.confirmActionBtnText}>Confirmar</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.modalActions}>
                        {onAccept && status === "PENDING" && (
                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: theme.colors.accent.green }]}
                            onPress={() => requestConfirm(() => { onAccept(item.id); }, "Aceitar solicitação", "Confirma que deseja aceitar esta solicitação de serviço?", theme.colors.accent.green)}
                          >
                            <Ionicons name="checkmark-circle" size={18} color="#fff" />
                            <Text style={styles.actionBtnText}>Aceitar</Text>
                          </TouchableOpacity>
                        )}
                        {onReject && status === "PENDING" && (
                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: theme.colors.status.error + "15", borderWidth: 1.5, borderColor: theme.colors.status.error }]}
                            onPress={() => requestConfirm(() => { onReject(item.id); }, "Recusar solicitação", "Confirma que deseja recusar esta solicitação de serviço?", theme.colors.status.error)}
                          >
                            <Ionicons name="close-circle" size={18} color={theme.colors.status.error} />
                            <Text style={[styles.actionBtnText, { color: theme.colors.status.error }]}>Recusar</Text>
                          </TouchableOpacity>
                        )}
                        {onComplete && status === "ACCEPTED" && (
                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: theme.colors.primary.DEFAULT }]}
                            onPress={() => requestConfirm(() => { onComplete(item.id); }, "Confirmar conclusão", "Confirma que o serviço foi concluído?", theme.colors.primary.DEFAULT)}
                          >
                            <Ionicons name="checkmark-done" size={18} color="#fff" />
                            <Text style={styles.actionBtnText}>Concluir</Text>
                          </TouchableOpacity>
                        )}
                        {onCancel && (status === "PENDING" || status === "ACCEPTED") && (
                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: theme.colors.status.error + "10", borderWidth: 1.5, borderColor: theme.colors.status.error }]}
                            onPress={() => requestConfirm(() => { onCancel(item.id); }, "Cancelar solicitação", "Confirma que deseja cancelar esta solicitação?", theme.colors.status.error)}
                          >
                            <Ionicons name="trash-outline" size={18} color={theme.colors.status.error} />
                            <Text style={[styles.actionBtnText, { color: theme.colors.status.error }]}>Cancelar</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default RequestItemComponent;
