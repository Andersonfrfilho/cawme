import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import { router, useFocusEffect } from "expo-router";
import * as Sharing from "expo-sharing";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAccount } from "@/modules/account/hooks/useAccount";
import type { AccountDocumentItem } from "@/modules/account/services/account.service";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

import { styles } from "./styles";

const ACTIVE_STATUSES = new Set(["PENDING", "VERIFIED", "APPROVED"]);

function statusColor(status: string): string {
  if (status === "VERIFIED" || status === "APPROVED") return theme.colors.status.success;
  if (status === "REJECTED") return theme.colors.status.error;
  return theme.colors.status.warning;
}

function statusIcon(status: string): "checkmark-circle" | "close-circle" | "time" {
  if (status === "VERIFIED" || status === "APPROVED") return "checkmark-circle";
  if (status === "REJECTED") return "close-circle";
  return "time";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function maskDocumentNumber(raw: string, documentType: string): string {
  const digits = raw.replace(/\D/g, "");
  switch (documentType.toUpperCase()) {
    case "CPF":
      if (digits.length === 11) return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
      break;
    case "CNPJ":
      if (digits.length === 14)
        return `**.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-**`;
      break;
    case "CNH":
      if (digits.length >= 6) return `${digits.slice(0, 3)}****${digits.slice(-3)}`;
      break;
    case "RG":
    case "PASSPORT":
      if (raw.length >= 4) return `${raw.slice(0, 2)}***${raw.slice(-2)}`;
      break;
  }
  if (raw.length >= 4) return `${raw.slice(0, 2)}***${raw.slice(-2)}`;
  return "***";
}

function handleAdd(): void {
  router.push({ pathname: "/(app)/account/document-change" as any });
}

export default function DocumentListScreen() {
  const insets = useSafeAreaInsets();
  const { account } = useLocale<LocaleKeys>();
  const { listAccountDocuments, getDocumentUrl, deleteDocument } = useAccount();

  const [documents, setDocuments] = useState<AccountDocumentItem[]>([]);
  const [loadingPreviewId, setLoadingPreviewId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confirmDoc, setConfirmDoc] = useState<AccountDocumentItem | null>(null);

  useFocusEffect(
    useCallback(() => {
      listAccountDocuments().then(setDocuments).catch(() => {});
    }, []),
  );

  async function handlePreview(document: AccountDocumentItem): Promise<void> {
    setLoadingPreviewId(document.id);
    try {
      const { url } = await getDocumentUrl(document.id);
      const isImage = /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url);
      if (isImage) {
        setPreviewUrl(url);
        return;
      }
      const localUri = `${FileSystem.cacheDirectory}document_${document.id}.pdf`;
      const info = await FileSystem.getInfoAsync(localUri);
      const fileUri = info.exists ? localUri : (await FileSystem.downloadAsync(url, localUri)).uri;
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, { mimeType: "application/pdf", UTI: "com.adobe.pdf" });
      } else {
        await Linking.openURL(url);
      }
    } catch {
      Alert.alert("", "Não foi possível carregar o documento.");
    } finally {
      setLoadingPreviewId(null);
    }
  }

  async function handleDeleteConfirmed(): Promise<void> {
    if (!confirmDoc) return;
    const target = confirmDoc;
    setConfirmDoc(null);
    setDeletingId(target.id);
    try {
      await deleteDocument(target.id);
      const remaining = await listAccountDocuments();
      setDocuments(remaining);
      const hasActive = remaining.some((doc) => ACTIVE_STATUSES.has(doc.status));
      if (!hasActive) {
        router.replace("/(app)/home" as any);
      }
    } catch {
      Alert.alert("", "Não foi possível remover o documento.");
    } finally {
      setDeletingId(null);
    }
  }

  function statusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: account.documentStatusPending,
      VERIFIED: account.documentStatusVerified,
      APPROVED: account.documentStatusApproved,
      REJECTED: account.documentStatusRejected,
    };
    return map[status] ?? status;
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{account.documentListTitle}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: moderateScale(32, 0.5) }}
      >
        {documents.length === 0 ? (
          <Text style={styles.emptyText}>{account.documentListEmpty}</Text>
        ) : (
          documents.map((doc) => {
            const activeCount = documents.filter((d) => ACTIVE_STATUSES.has(d.status)).length;
            const isOnlyActive = activeCount === 1 && ACTIVE_STATUSES.has(doc.status);
            return (
            <View key={doc.id} style={styles.documentCard}>
              {/* corpo: info + botão visualizar */}
              <View style={styles.documentCardBody}>
                <View style={styles.documentInfo}>
                  <View style={styles.documentTypeRow}>
                    <Ionicons
                      name="document-text-outline"
                      size={moderateScale(18, 0.3)}
                      color={theme.colors.primary.DEFAULT}
                    />
                    <Text style={styles.documentType}>{doc.documentType}</Text>
                  </View>

                  {doc.documentNumber ? (
                    <Text style={styles.documentNumber}>
                      {maskDocumentNumber(doc.documentNumber, doc.documentType)}
                    </Text>
                  ) : null}

                  <View style={styles.statusRow}>
                    <Ionicons
                      name={statusIcon(doc.status)}
                      size={moderateScale(14, 0.3)}
                      color={statusColor(doc.status)}
                    />
                    <Text style={[styles.statusText, { color: statusColor(doc.status) }]}>
                      {statusLabel(doc.status)}
                    </Text>
                  </View>
                  <Text style={styles.uploadDate}>{formatDate(doc.uploadedAt)}</Text>
                </View>

                <TouchableOpacity
                  style={styles.previewButton}
                  onPress={() => handlePreview(doc)}
                  disabled={loadingPreviewId === doc.id || deletingId === doc.id}
                  hitSlop={8}
                >
                  {loadingPreviewId === doc.id ? (
                    <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
                  ) : (
                    <>
                      <Ionicons
                        name="eye-outline"
                        size={moderateScale(16, 0.3)}
                        color={theme.colors.primary.DEFAULT}
                      />
                      <Text style={styles.previewButtonText}>{account.documentViewButton}</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* rodapé separado: botão remover */}
              <View style={styles.cardDivider} />
              <TouchableOpacity
                style={[styles.deleteButton, isOnlyActive && styles.deleteButtonDisabled]}
                onPress={() => setConfirmDoc(doc)}
                disabled={deletingId === doc.id || loadingPreviewId === doc.id || isOnlyActive}
                activeOpacity={0.7}
              >
                {deletingId === doc.id ? (
                  <ActivityIndicator size="small" color={theme.colors.status.error} />
                ) : (
                  <>
                    <Ionicons
                      name="trash-outline"
                      size={moderateScale(14, 0.3)}
                      color={isOnlyActive ? theme.colors.text.tertiary : theme.colors.status.error}
                    />
                    <Text style={[styles.deleteButtonText, isOnlyActive && styles.deleteButtonTextDisabled]}>
                      {account.documentDeleteConfirmButton}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            );
          })
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.85}>
          <Ionicons name="add" size={moderateScale(20, 0.3)} color={theme.palette.neutral[0]} />
          <Text style={styles.addButtonText}>{account.documentListAddButton}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* modal de preview de imagem */}
      <Modal
        visible={previewUrl !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewUrl(null)}
      >
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            style={styles.previewClose}
            onPress={() => setPreviewUrl(null)}
            hitSlop={8}
          >
            <Ionicons
              name="close-circle"
              size={moderateScale(36, 0.3)}
              color={theme.palette.neutral[0]}
            />
          </TouchableOpacity>
          {previewUrl && (
            <Image source={{ uri: previewUrl }} style={styles.previewImage} resizeMode="contain" />
          )}
        </View>
      </Modal>

      <ConfirmModal
        visible={confirmDoc !== null}
        title={account.documentDeleteConfirmTitle}
        message={account.documentDeleteConfirmMessage}
        confirmLabel={account.documentDeleteConfirmButton}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDoc(null)}
      />
    </View>
  );
}
