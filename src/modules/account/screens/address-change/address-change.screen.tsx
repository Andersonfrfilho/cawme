import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAccount } from "@/modules/account/hooks/useAccount";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { cepProvider } from "@/shared/providers/cep";

import { styles } from "./styles";

type AddressChangeScreenParams = {
  addressId?: string;
  label?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postcode?: string;
};

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function AddressChangeScreen() {
  const insets = useSafeAreaInsets();
  const { account } = useLocale<LocaleKeys>();
  const params = useLocalSearchParams<AddressChangeScreenParams>();
  const { saveAddress } = useAccount();

  const isEditing = !!params.addressId;

  const [label, setLabel] = useState(params.label ?? "");
  const [street, setStreet] = useState(params.street ?? "");
  const [number, setNumber] = useState(params.number ?? "");
  const [neighborhood, setNeighborhood] = useState(params.neighborhood ?? "");
  const [city, setCity] = useState(params.city ?? "");
  const [state, setState] = useState(params.state ?? "");
  const [postcode, setPostcode] = useState(
    params.postcode ? formatCep(params.postcode) : "",
  );
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCepBlur(): Promise<void> {
    const raw = postcode.replace(/\D/g, "");
    if (raw.length !== 8) return;
    setIsLookingUp(true);
    try {
      const result = await cepProvider.search(raw);
      if (result.street) setStreet(result.street);
      if (result.neighborhood) setNeighborhood(result.neighborhood);
      if (result.city) setCity(result.city);
      if (result.state) setState(result.state);
    } catch {
      // CEP não encontrado — usuário preenche manualmente
    } finally {
      setIsLookingUp(false);
    }
  }

  async function handleSubmit(): Promise<void> {
    if (!label.trim()) {
      Alert.alert("", account.addressLabelRequired);
      return;
    }
    if (!postcode || !street || !number || !city || !state) {
      Alert.alert("", "Preencha todos os campos obrigatórios.");
      return;
    }
    setIsSubmitting(true);
    try {
      await saveAddress({
        id: params.addressId,
        label: label.trim(),
        postcode: postcode.replace(/\D/g, ""),
        street,
        number,
        neighborhood,
        city,
        state,
      });
      Alert.alert("", account.addressSaveSuccess, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("", "Não foi possível salvar o endereço. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? account.addressChangeTitle : account.addressNewTitle}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: moderateScale(32, 0.5) }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{account.addressLabelLabel}</Text>
          <TextInput
            style={styles.input}
            placeholder={account.addressLabelPlaceholder}
            placeholderTextColor={theme.colors.text.secondary}
            value={label}
            onChangeText={setLabel}
            autoCorrect={false}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>CEP</Text>
          <View style={styles.cepRow}>
            <TextInput
              style={[styles.input, styles.inputFlex]}
              placeholder="00000-000"
              placeholderTextColor={theme.colors.text.secondary}
              value={postcode}
              onChangeText={(text) => setPostcode(formatCep(text))}
              onBlur={handleCepBlur}
              keyboardType="number-pad"
              maxLength={9}
            />
            {isLookingUp && (
              <Ionicons
                name="sync-outline"
                size={20}
                color={theme.colors.text.secondary}
                style={styles.cepSpinner}
              />
            )}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Logradouro</Text>
          <TextInput
            style={styles.input}
            placeholder="Rua, Avenida..."
            placeholderTextColor={theme.colors.text.secondary}
            value={street}
            onChangeText={setStreet}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.fieldFlex]}>
            <Text style={styles.label}>Número</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              placeholderTextColor={theme.colors.text.secondary}
              value={number}
              onChangeText={setNumber}
              keyboardType="number-pad"
            />
          </View>
          <View style={[styles.fieldGroup, styles.fieldFlexLarge]}>
            <Text style={styles.label}>Bairro</Text>
            <TextInput
              style={styles.input}
              placeholder="Bairro"
              placeholderTextColor={theme.colors.text.secondary}
              value={neighborhood}
              onChangeText={setNeighborhood}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.fieldFlexLarge]}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput
              style={styles.input}
              placeholder="Cidade"
              placeholderTextColor={theme.colors.text.secondary}
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={[styles.fieldGroup, styles.fieldSmall]}>
            <Text style={styles.label}>UF</Text>
            <TextInput
              style={styles.input}
              placeholder="SP"
              placeholderTextColor={theme.colors.text.secondary}
              value={state}
              onChangeText={(text) => setState(text.toUpperCase().slice(0, 2))}
              autoCapitalize="characters"
              maxLength={2}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? account.savingButton : account.saveButton}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
