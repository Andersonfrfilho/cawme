import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { logger } from "@/shared/utils/logger";
import { isTestEnvironment } from "@/shared/utils/test-environment";
import { useDocumentUpload } from "../../hooks/useDocumentUpload";
import { useAuthStore } from "../../store/auth.store";
import { useRegisterStore } from "../../store/register.store";
import type { DocumentUploadScreenParams } from "./types";
import type { DocumentType } from "../../services/document.service";
import { styles } from "./styles";

type SelectedFile = {
  uri: string;
  name: string;
  type: string;
  isPdf: boolean;
};

const DOCUMENT_TYPES: { key: DocumentType; label: string }[] = [
  { key: "RG", label: "RG" },
  { key: "CNH", label: "CNH" },
  { key: "CPF", label: "CPF" },
  { key: "PASSPORT", label: "Passaporte" },
];

const REGISTRATION_TYPE_MAP: Record<string, DocumentType> = {
  cpf: "CPF",
  rg: "RG",
  cnh: "CNH",
  cnpj: "CPF",
  passport: "PASSPORT",
};

// Minimal valid PNG (1x1 white pixel)
const TEST_IMAGE_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

function resolveInitialDocumentType(raw?: string): DocumentType | null {
  if (!raw) return null;
  return REGISTRATION_TYPE_MAP[raw.toLowerCase()] ?? null;
}

const DOCUMENT_MASKS: Partial<Record<DocumentType, string>> = {
  CPF: "000.000.000-00",
  CNPJ: "00.000.000/0000-00",
  RG: "00.000.000-0",
  CNH: "00000000000",
};

function applyNumericMask(raw: string, mask: string): string {
  const digits = raw.replace(/\D/g, "");
  let result = "";
  let digitIndex = 0;
  for (const char of mask) {
    if (digitIndex >= digits.length) break;
    if (char === "0") {
      result += digits[digitIndex++];
    } else {
      result += char;
    }
  }
  return result;
}

function maskDocumentInput(raw: string, documentType: DocumentType | null): string {
  if (documentType === "PASSPORT") {
    return raw.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 9);
  }
  const mask = documentType ? DOCUMENT_MASKS[documentType] : undefined;
  return mask ? applyNumericMask(raw, mask) : raw;
}

function keyboardTypeForDocument(documentType: DocumentType | null): "numeric" | "default" {
  if (documentType === "PASSPORT" || documentType === null) return "default";
  return "numeric";
}

function maxLengthForDocument(documentType: DocumentType | null): number | undefined {
  switch (documentType) {
    case "CPF": return 14;
    case "CNPJ": return 18;
    case "RG": return 12;
    case "CNH": return 11;
    case "PASSPORT": return 9;
    default: return undefined;
  }
}

function placeholderForDocument(documentType: DocumentType | null): string {
  switch (documentType) {
    case "CPF": return "000.000.000-00";
    case "CNPJ": return "00.000.000/0000-00";
    case "RG": return "00.000.000-0";
    case "CNH": return "00000000000";
    case "PASSPORT": return "AB1234567";
    default: return "Número do documento";
  }
}

export default function DocumentUploadScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const params = useLocalSearchParams<DocumentUploadScreenParams>();
  const { uploadDocument, isUploading, error, uploadedDocument } =
    useDocumentUpload();
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const authUser = useAuthStore((s) => s.user);

  // Provider: envio de documento obrigatório — lê do param de navegação (mais confiável),
  // com fallback para pendingRegistration ou user logado
  const isProvider =
    params.userType === "provider" ||
    useRegisterStore.getState().pendingRegistration?.userType === "provider" ||
    authUser?.type === "provider";

  const [selectedType, setSelectedType] = useState<DocumentType | null>(
    resolveInitialDocumentType(params.documentType),
  );
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [documentNumber, setDocumentNumber] = useState("");
  const [numberFocused, setNumberFocused] = useState(false);

  const pickImage = async () => {
    // E2E test mode: use test image directly without picker
    if (isTestEnvironment()) {
      setSelectedFile({
        uri: TEST_IMAGE_DATA_URI,
        name: "test-document.jpg",
        type: "image/jpeg",
        isPdf: false,
      });
      logger.screenEvent("DocumentUploadScreen", "image.selected", {
        source: "test",
      });
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à galeria para enviar o documento.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setSelectedFile({
        uri: asset.uri,
        name: asset.fileName ?? `document_${Date.now()}.jpg`,
        type: asset.mimeType ?? "image/jpeg",
        isPdf: false,
      });
      logger.screenEvent("DocumentUploadScreen", "image.selected", {
        source: "gallery",
      });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à câmera para tirar a foto.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setSelectedFile({
        uri: asset.uri,
        name: asset.fileName ?? `document_${Date.now()}.jpg`,
        type: asset.mimeType ?? "image/jpeg",
        isPdf: false,
      });
      logger.screenEvent("DocumentUploadScreen", "image.selected", {
        source: "camera",
      });
    }
  };

  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setSelectedFile({
        uri: asset.uri,
        name: asset.name,
        type: "application/pdf",
        isPdf: true,
      });
      logger.screenEvent("DocumentUploadScreen", "pdf.selected", {
        name: asset.name,
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedType || !selectedFile) return;

    try {
      if (isTestEnvironment()) {
        // Em teste E2E, pula o upload real para evitar dependência de API
        logger.screenEvent("DocumentUploadScreen", "upload.mock", {
          documentType: selectedType,
          testMode: true,
        });
      } else {
        await uploadDocument(
          selectedFile.uri,
          selectedFile.name,
          selectedFile.type,
          selectedType,
          documentNumber,
        );
      }

      logger.screenEvent("DocumentUploadScreen", "upload.success", {
        documentType: selectedType,
        isProvider,
        mode: params.mode,
      });

      // Provider em fluxo post-register → provider profile setup (categorias)
      // Nota: handleAdvance já faz login automático antes de abrir o DocumentUploadSheet,
      // por isso isSignedIn pode ser true aqui — checamos apenas isProvider + mode.
      if (isProvider && params.mode === "post-register") {
        router.replace({
          pathname: "/(auth)/provider-profile" as any,
          params: { mode: "post-register" },
        });
      } else {
        router.replace("/(app)/home" as any);
      }
    } catch (err: any) {
      logger.error(
        "DocumentUploadScreen",
        "upload.error",
        "Erro no upload",
        err,
      );
    }
  };

  const handleSkip = () => {
    if (isSignedIn) {
      router.replace("/(app)/home" as any);
      return;
    }
    if (params.mode === "post-register") {
      router.replace({
        pathname: "/verification" as any,
        params: {
          email: params.email || "",
          phone: params.phone || "",
          mode: "post-register",
        },
      });
    } else {
      router.back();
    }
  };

  const showImagePicker = () => {
    Alert.alert(auth.documentUploadPickerTitle, undefined, [
      { text: auth.documentUploadPickerCamera, onPress: takePhoto },
      { text: auth.documentUploadPickerGallery, onPress: pickImage },
      { text: auth.documentUploadPickerPdf, onPress: pickPdf },
      { text: auth.documentUploadPickerCancel, style: "cancel" },
    ]);
  };

  const getStatusColor = (status?: string) => {
    if (status === "VERIFIED") return theme.colors.status.success;
    if (status === "REJECTED") return theme.colors.status.error;
    return theme.colors.status.warning;
  };

  const getStatusIcon = (status?: string) => {
    if (status === "VERIFIED") return "checkmark-circle";
    if (status === "REJECTED") return "close-circle";
    return "time-outline";
  };

  const getStatusLabel = (status?: string) => {
    if (status === "VERIFIED") return auth.documentStatusVerified;
    if (status === "REJECTED") return auth.documentStatusRejected;
    return auth.documentStatusPending;
  };

  const canSubmit = selectedType && selectedFile && documentNumber.trim().length > 0 && !isUploading;

  return (
    <SafeAreaView
      style={styles.root}
      edges={["top", "bottom"]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: verticalScale(32),
          alignItems: "stretch",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="document-attach-outline"
              size={moderateScale(32, 0.3)}
              color={theme.colors.primary.DEFAULT}
            />
          </View>
          <Text style={styles.title}>{auth.documentUploadTitle}</Text>
          <Text style={styles.subtitle}>{auth.documentUploadSubtitle}</Text>
        </View>

        {/* Tipo de documento */}
        <View style={styles.documentTypeSection}>
          <Text style={styles.sectionLabel}>
            {auth.documentUploadTypeLabel}
          </Text>
          <View style={styles.documentTypesRow}>
            {DOCUMENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.key}
                testID={`document-type-chip-${type.key.toLowerCase()}`}
                style={[
                  styles.documentTypeChip,
                  selectedType === type.key && styles.documentTypeChipSelected,
                ]}
                onPress={() => { setSelectedType(type.key); setDocumentNumber(""); }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.documentTypeChipText,
                    selectedType === type.key &&
                      styles.documentTypeChipTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Número do documento */}
        <View style={styles.numberSection}>
          <Text style={styles.numberLabel}>{auth.documentUploadNumberLabel}</Text>
          <TextInput
            style={[styles.numberInput, numberFocused && styles.numberInputFocused]}
            placeholder={placeholderForDocument(selectedType)}
            placeholderTextColor={theme.colors.text.secondary}
            value={documentNumber}
            onChangeText={(text) => setDocumentNumber(maskDocumentInput(text, selectedType))}
            onFocus={() => setNumberFocused(true)}
            onBlur={() => setNumberFocused(false)}
            autoCorrect={false}
            autoCapitalize="characters"
            keyboardType={keyboardTypeForDocument(selectedType)}
            maxLength={maxLengthForDocument(selectedType)}
            editable={!isUploading}
          />
        </View>

        {/* Área de upload */}
        <TouchableOpacity
          testID="document-upload-area"
          style={[
            styles.uploadArea,
            !!selectedFile && styles.uploadAreaHasImage,
          ]}
          onPress={showImagePicker}
          activeOpacity={0.8}
          disabled={isUploading}
        >
          {selectedFile && !selectedFile.isPdf ? (
            <>
              <Image
                source={{ uri: selectedFile.uri }}
                style={styles.previewImage}
              />
              <View style={styles.previewOverlay}>
                <Text style={styles.previewOverlayText}>
                  {auth.documentUploadChangePhoto}
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={moderateScale(18, 0.3)}
                    color={theme.palette.neutral[0]}
                  />
                </TouchableOpacity>
              </View>
            </>
          ) : selectedFile?.isPdf ? (
            <View style={styles.uploadPlaceholder}>
              <Ionicons
                name="document-text"
                size={moderateScale(48, 0.3)}
                color={theme.colors.primary.DEFAULT}
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadTitle}>
                {auth.documentUploadPdfSelected}
              </Text>
              <Text style={styles.uploadSubtitle} numberOfLines={2}>
                {selectedFile.name}
              </Text>
              <TouchableOpacity
                style={{ marginTop: verticalScale(8) }}
                onPress={() => setSelectedFile(null)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="trash-outline"
                  size={moderateScale(20, 0.3)}
                  color={theme.colors.status.error}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons
                name="cloud-upload-outline"
                size={moderateScale(40, 0.3)}
                color={theme.palette.neutral[400]}
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadTitle}>
                {auth.documentUploadPlaceholderTitle}
              </Text>
              <Text style={styles.uploadSubtitle}>
                {auth.documentUploadPlaceholderSubtitle}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Diretrizes */}
        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>
            {auth.documentUploadGuidelinesTitle}
          </Text>
          <View style={styles.guidelineItem}>
            <Ionicons
              name="sunny-outline"
              size={moderateScale(16, 0.3)}
              color={theme.colors.text.secondary}
              style={styles.guidelineIcon}
            />
            <Text style={styles.guidelineText}>
              {auth.documentUploadGuidelineLight}
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons
              name="scan-outline"
              size={moderateScale(16, 0.3)}
              color={theme.colors.text.secondary}
              style={styles.guidelineIcon}
            />
            <Text style={styles.guidelineText}>
              {auth.documentUploadGuidelineClear}
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons
              name="crop-outline"
              size={moderateScale(16, 0.3)}
              color={theme.colors.text.secondary}
              style={styles.guidelineIcon}
            />
            <Text style={styles.guidelineText}>
              {auth.documentUploadGuidelineFull}
            </Text>
          </View>
        </View>

        {/* Status do upload */}
        {uploadedDocument && (
          <View style={styles.statusSection}>
            <View style={styles.statusCard}>
              <View
                style={[
                  styles.statusIconContainer,
                  {
                    backgroundColor:
                      getStatusColor(uploadedDocument.status) + "15",
                  },
                ]}
              >
                <Ionicons
                  name={getStatusIcon(uploadedDocument.status) as any}
                  size={moderateScale(22, 0.3)}
                  color={getStatusColor(uploadedDocument.status)}
                />
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>
                  {auth.documentUploadStatusLabel}
                </Text>
                <Text
                  style={[
                    styles.statusValue,
                    { color: getStatusColor(uploadedDocument.status) },
                  ]}
                >
                  {getStatusLabel(uploadedDocument.status)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Erro */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            testID="document-upload-submit-button"
            style={[
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled,
            ]}
            onPress={handleUpload}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            {isUploading ? (
              <Text style={styles.submitButtonText}>
                {auth.documentUploadSending}
              </Text>
            ) : (
              <Text style={styles.submitButtonText}>
                {auth.documentUploadSubmit}
              </Text>
            )}
          </TouchableOpacity>

          {!isProvider && (
            <TouchableOpacity
              testID="document-upload-skip-button"
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>{auth.documentUploadSkip}</Text>
            </TouchableOpacity>
          )}

          {isProvider && !uploadedDocument && (
            <View testID="document-upload-provider-mandatory" style={styles.providerMandatoryContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={moderateScale(16, 0.3)}
                color={theme.colors.status.warning}
                style={{ marginRight: moderateScale(6, 0.5) }}
              />
              <Text style={styles.providerMandatoryText}>
                {auth.documentUploadProviderMandatory}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
