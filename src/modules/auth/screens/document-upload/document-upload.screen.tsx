import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { logger } from "@/shared/utils/logger";
import { useDocumentUpload } from "../../hooks/useDocumentUpload";
import type { DocumentUploadScreenParams } from "./types";
import type { DocumentType } from "../../services/document.service";
import { styles } from "./styles";

const DOCUMENT_TYPES: { key: DocumentType; label: string }[] = [
  { key: "RG", label: "RG" },
  { key: "CNH", label: "CNH" },
  { key: "CPF", label: "CPF" },
  { key: "PASSPORT", label: "Passaporte" },
];

export default function DocumentUploadScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<DocumentUploadScreenParams>();
  const { uploadDocument, isUploading, error, uploadedDocument } = useDocumentUpload();

  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria para enviar o documento.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      logger.screenEvent("DocumentUploadScreen", "image.selected", { source: "gallery" });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à câmera para tirar a foto.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      logger.screenEvent("DocumentUploadScreen", "image.selected", { source: "camera" });
    }
  };

  const handleUpload = async () => {
    if (!selectedType || !imageUri) return;

    try {
      await uploadDocument(
        imageUri,
        `document_${selectedType.toLowerCase()}.jpg`,
        "image/jpeg",
        selectedType
      );

      logger.screenEvent("DocumentUploadScreen", "upload.success", { documentType: selectedType });

      // Redireciona para verificação ou home
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
        router.replace("/(app)/home" as any);
      }
    } catch (err: any) {
      logger.error("DocumentUploadScreen", "upload.error", "Erro no upload", err);
    }
  };

  const handleSkip = () => {
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
    Alert.alert(
      "Enviar Documento",
      "Escolha como deseja enviar o documento:",
      [
        { text: "Câmera", onPress: takePhoto },
        { text: "Galeria", onPress: pickImage },
        { text: "Cancelar", style: "cancel" },
      ]
    );
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

  const canSubmit = selectedType && imageUri && !isUploading;

  return (
    <SafeAreaView style={[styles.root, { paddingTop: insets.top }]} edges={["bottom"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: verticalScale(32) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="document-attach-outline" size={moderateScale(32, 0.3)} color={theme.colors.primary.DEFAULT} />
          </View>
          <Text style={styles.title}>{auth.documentUploadTitle}</Text>
          <Text style={styles.subtitle}>{auth.documentUploadSubtitle}</Text>
        </View>

        {/* Tipo de documento */}
        <View style={styles.documentTypeSection}>
          <Text style={styles.sectionLabel}>{auth.documentUploadTypeLabel}</Text>
          <View style={styles.documentTypesRow}>
            {DOCUMENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.documentTypeChip,
                  selectedType === type.key && styles.documentTypeChipSelected,
                ]}
                onPress={() => setSelectedType(type.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.documentTypeChipText,
                    selectedType === type.key && styles.documentTypeChipTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Área de upload */}
        <TouchableOpacity
          style={[
            styles.uploadArea,
            !!imageUri && styles.uploadAreaHasImage,
          ]}
          onPress={showImagePicker}
          activeOpacity={0.8}
          disabled={isUploading}
        >
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <View style={styles.previewOverlay}>
                <Text style={styles.previewOverlayText}>
                  {auth.documentUploadChangePhoto}
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    setImageUri(null);
                  }}
                >
                  <Ionicons name="trash-outline" size={moderateScale(18, 0.3)} color={theme.palette.neutral[0]} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons
                name="camera-outline"
                size={moderateScale(40, 0.3)}
                color={theme.palette.neutral[400]}
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadTitle}>{auth.documentUploadPlaceholderTitle}</Text>
              <Text style={styles.uploadSubtitle}>{auth.documentUploadPlaceholderSubtitle}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Diretrizes */}
        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>{auth.documentUploadGuidelinesTitle}</Text>
          <View style={styles.guidelineItem}>
            <Ionicons name="sunny-outline" size={moderateScale(16, 0.3)} color={theme.colors.text.secondary} style={styles.guidelineIcon} />
            <Text style={styles.guidelineText}>{auth.documentUploadGuidelineLight}</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="scan-outline" size={moderateScale(16, 0.3)} color={theme.colors.text.secondary} style={styles.guidelineIcon} />
            <Text style={styles.guidelineText}>{auth.documentUploadGuidelineClear}</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="crop-outline" size={moderateScale(16, 0.3)} color={theme.colors.text.secondary} style={styles.guidelineIcon} />
            <Text style={styles.guidelineText}>{auth.documentUploadGuidelineFull}</Text>
          </View>
        </View>

        {/* Status do upload */}
        {uploadedDocument && (
          <View style={styles.statusSection}>
            <View style={styles.statusCard}>
              <View style={[styles.statusIconContainer, { backgroundColor: getStatusColor(uploadedDocument.status) + "15" }]}>
                <Ionicons name={getStatusIcon(uploadedDocument.status) as any} size={moderateScale(22, 0.3)} color={getStatusColor(uploadedDocument.status)} />
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>{auth.documentUploadStatusLabel}</Text>
                <Text style={[styles.statusValue, { color: getStatusColor(uploadedDocument.status) }]}>
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
            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            onPress={handleUpload}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            {isUploading ? (
              <Text style={styles.submitButtonText}>{auth.documentUploadSending}</Text>
            ) : (
              <Text style={styles.submitButtonText}>{auth.documentUploadSubmit}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
            <Text style={styles.skipButtonText}>{auth.documentUploadSkip}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
