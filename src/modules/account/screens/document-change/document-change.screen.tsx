import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAccount } from "@/modules/account/hooks/useAccount";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import type { DocumentType } from "@/modules/auth/services/document.service";

import { styles } from "./styles";

type SelectedFile = {
  uri: string;
  name: string;
  type: string;
  isPdf: boolean;
};

const DOCUMENT_TYPES: { key: DocumentType; labelKey: keyof ReturnType<typeof useLocale<LocaleKeys>>["account"] }[] = [
  { key: "RG", labelKey: "documentTypeRG" },
  { key: "CNH", labelKey: "documentTypeCNH" },
  { key: "CPF", labelKey: "documentTypeCPF" },
  { key: "PASSPORT", labelKey: "documentTypePassport" },
];

export default function DocumentChangeScreen() {
  const insets = useSafeAreaInsets();
  const { account } = useLocale<LocaleKeys>();
  const { uploadDocument } = useAccount();

  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePickImage(): Promise<void> {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedFile({
        uri: asset.uri,
        name: asset.fileName ?? "document.jpg",
        type: asset.mimeType ?? "image/jpeg",
        isPdf: false,
      });
    }
  }

  async function handlePickDocument(): Promise<void> {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedFile({
        uri: asset.uri,
        name: asset.name,
        type: "application/pdf",
        isPdf: true,
      });
    }
  }

  async function handleSubmit(): Promise<void> {
    if (!selectedType) {
      Alert.alert("", account.documentNoTypeError);
      return;
    }
    if (!selectedFile) {
      Alert.alert("", account.documentNoFileError);
      return;
    }
    setIsSubmitting(true);
    try {
      await uploadDocument({
        documentType: selectedType,
        file: { uri: selectedFile.uri, name: selectedFile.name, type: selectedFile.type },
      });
      Alert.alert("", account.documentSaveSuccess, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("", "Não foi possível enviar o documento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{account.documentChangeTitle}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: moderateScale(32, 0.5) }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{account.documentTypeLabel}</Text>
          <View style={styles.chipsRow}>
            {DOCUMENT_TYPES.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.chip, selectedType === item.key && styles.chipSelected]}
                onPress={() => setSelectedType(item.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.chipText, selectedType === item.key && styles.chipTextSelected]}
                >
                  {account[item.labelKey] as string}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{account.documentUploadLabel}</Text>
          <View style={styles.uploadRow}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePickImage}
              activeOpacity={0.7}
            >
              <Ionicons name="image-outline" size={20} color={theme.colors.primary.DEFAULT} />
              <Text style={styles.uploadButtonText}>Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePickDocument}
              activeOpacity={0.7}
            >
              <Ionicons name="document-outline" size={20} color={theme.colors.primary.DEFAULT} />
              <Text style={styles.uploadButtonText}>PDF</Text>
            </TouchableOpacity>
          </View>

          {selectedFile && (
            <View style={styles.filePreview}>
              {selectedFile.isPdf ? (
                <View style={styles.pdfPreview}>
                  <Ionicons
                    name="document-text"
                    size={32}
                    color={theme.colors.primary.DEFAULT}
                  />
                  <Text style={styles.fileName} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                </View>
              ) : (
                <Image
                  source={{ uri: selectedFile.uri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              )}
              <TouchableOpacity
                style={styles.removeFile}
                onPress={() => setSelectedFile(null)}
                hitSlop={8}
              >
                <Ionicons name="close-circle" size={22} color={theme.colors.status.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? account.documentSavingButton : account.documentSaveButton}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
