import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, Alert } from "react-native";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation } from "expo-router";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { useLoading } from "@/shared/hooks/useLoading";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { AccountService, type ProviderProfileMe } from "../../services/account.service";
import styles from "./styles";

export default function ProviderBioScreen() {
  const navigation = useNavigation();
  const { account } = useLocale<LocaleKeys>();
  const { showLoading, hideLoading } = useLoading();

  const [profile, setProfile] = useState<ProviderProfileMe | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [dirty, setDirty] = useState(false);

  const initialRef = useRef<Pick<ProviderProfileMe, "businessName" | "description" | "isAvailable"> | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await AccountService.getProviderProfileMe();
        setProfile(data);
        setBusinessName(data.businessName ?? "");
        setDescription(data.description ?? "");
        setIsAvailable(data.isAvailable);
        initialRef.current = {
          businessName: data.businessName,
          description: data.description,
          isAvailable: data.isAvailable,
        };
      } catch {
        Alert.alert("Erro", "Não foi possível carregar o perfil.");
      }
    }
    void load();
  }, []);

  useEffect(() => {
    if (!initialRef.current) return;
    const changed =
      businessName !== (initialRef.current.businessName ?? "") ||
      description !== (initialRef.current.description ?? "") ||
      isAvailable !== initialRef.current.isAvailable;
    setDirty(changed);
  }, [businessName, description, isAvailable]);

  const handleSave = useCallback(async () => {
    showLoading();
    try {
      await AccountService.updateProviderProfile({ businessName, description, isAvailable });
      initialRef.current = { businessName, description, isAvailable };
      setDirty(false);
      Alert.alert("", account.providerBioSaveSuccess);
    } catch {
      Alert.alert("Erro", account.providerBioSaveError);
    } finally {
      hideLoading();
    }
  }, [businessName, description, isAvailable, account, showLoading, hideLoading]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: account.providerBioTitle });
  }, [navigation, account.providerBioTitle]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>{account.providerBioBusinessNameLabel}</Text>
      <TextInput
        style={styles.input}
        value={businessName}
        onChangeText={setBusinessName}
        placeholder={account.providerBioBusinessNamePlaceholder}
        placeholderTextColor={theme.colors.text.tertiary}
      />

      <Text style={styles.label}>{account.providerBioDescriptionLabel}</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={description}
        onChangeText={setDescription}
        placeholder={account.providerBioDescriptionPlaceholder}
        placeholderTextColor={theme.colors.text.tertiary}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View style={styles.row}>
        <Text style={styles.label}>{account.providerBioIsAvailableLabel}</Text>
        <Switch
          value={isAvailable}
          onValueChange={setIsAvailable}
          trackColor={{ true: theme.colors.primary.DEFAULT }}
        />
      </View>

      {profile && (
        <View style={styles.ratingRow}>
          <Text style={styles.ratingLabel}>Avaliação média</Text>
          <Text style={styles.ratingValue}>{Number(profile.averageRating).toFixed(1)} ★</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.saveButton, !dirty && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!dirty}
      >
        <Text style={styles.saveButtonText}>{account.providerBioSaveButton}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
