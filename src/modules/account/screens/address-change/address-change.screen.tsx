import { Ionicons } from "@expo/vector-icons";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAccount } from "@/modules/account/hooks/useAccount";
import { AddressService } from "@/modules/auth/services/address.service";
import type { AddressSuggestion } from "@/modules/auth/services/address.service";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { useToast } from "@/shared/hooks/useToast";
import { Toast } from "@/shared/components/Toast";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { cepProvider } from "@/shared/providers/cep";

import { styles } from "./styles";

type AddressChangeScreenParams = {
  addressId?: string;
  label?: string;
  isPrimary?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postcode?: string;
  latitude?: string;
  longitude?: string;
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
  const { toast, toastOpacity, showToast } = useToast();

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
  const [latitude, setLatitude] = useState<number | undefined>(
    params.latitude ? Number.parseFloat(params.latitude) : undefined,
  );
  const [longitude, setLongitude] = useState<number | undefined>(
    params.longitude ? Number.parseFloat(params.longitude) : undefined,
  );
  const [isPrimary, setIsPrimary] = useState(params.isPrimary === "true");

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapRef = useRef<MapView>(null);

  function animateMapTo(lat: number, lon: number): void {
    mapRef.current?.animateToRegion(
      { latitude: lat, longitude: lon, latitudeDelta: 0.005, longitudeDelta: 0.005 },
      400,
    );
  }

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const results = await AddressService.autocomplete(text);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 400);
  }, []);

  function handleSelectSuggestion(suggestion: AddressSuggestion): void {
    setStreet(suggestion.street);
    setNumber(suggestion.number);
    setNeighborhood(suggestion.neighborhood);
    setCity(suggestion.city);
    setState(suggestion.state);
    setPostcode(formatCep(suggestion.postcode));
    setLatitude(suggestion.latitude);
    setLongitude(suggestion.longitude);
    setSearchQuery("");
    setSuggestions([]);
    animateMapTo(suggestion.latitude, suggestion.longitude);
  }

  async function handleCepBlur(): Promise<void> {
    const raw = postcode.replace(/\D/g, "");
    if (raw.length !== 8) return;
    setIsLookingUp(true);
    try {
      const result = await cepProvider.search(raw);
      if (result) {
        if (result.logradouro) setStreet(result.logradouro);
        if (result.bairro) setNeighborhood(result.bairro);
        if (result.localidade) setCity(result.localidade);
        if (result.uf) setState(result.uf);

        const geocodeQuery = [result.logradouro, result.bairro, result.localidade, result.uf, "Brasil"]
          .filter(Boolean)
          .join(", ");
        try {
          const geocoded = await Location.geocodeAsync(geocodeQuery);
          if (geocoded.length > 0) {
            setLatitude(geocoded[0].latitude);
            setLongitude(geocoded[0].longitude);
            animateMapTo(geocoded[0].latitude, geocoded[0].longitude);
          }
        } catch {
          // geocoding falhou — campos preenchidos mas mapa sem coordenadas
        }
      }
    } catch {
      // CEP não encontrado — usuário preenche manualmente
    } finally {
      setIsLookingUp(false);
    }
  }

  async function handleSubmit(): Promise<void> {
    if (!label.trim()) {
      showToast(account.addressLabelRequired, "error");
      return;
    }
    if (!postcode || !street || !number || !city || !state) {
      showToast("Preencha todos os campos obrigatórios.", "error");
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
        latitude,
        longitude,
        isPrimary,
      });
      showToast(account.addressSaveSuccess, "success");
      setTimeout(() => router.back(), 1500);
    } catch {
      showToast("Não foi possível salvar o endereço. Tente novamente.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const coordinates =
    latitude != null && longitude != null ? { latitude, longitude } : null;

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
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search-outline"
              size={moderateScale(18, 0.3)}
              color={theme.colors.primary.DEFAULT}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar endereço..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoCorrect={false}
              returnKeyType="search"
            />
            {loadingSuggestions && (
              <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
            )}
            {searchQuery.length > 0 && !loadingSuggestions && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setSuggestions([]);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="close-circle"
                  size={moderateScale(18, 0.3)}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            )}
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestionsList}>
              {suggestions.map((item, index) => (
                <TouchableOpacity
                  key={item.fullAddress}
                  style={[
                    styles.suggestionItem,
                    index < suggestions.length - 1 && styles.suggestionItemBorder,
                  ]}
                  onPress={() => handleSelectSuggestion(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="location-outline"
                    size={moderateScale(16, 0.3)}
                    color={theme.colors.primary.DEFAULT}
                    style={styles.suggestionIcon}
                  />
                  <View style={styles.suggestionContent}>
                    <Text style={styles.suggestionStreet} numberOfLines={1}>
                      {item.street}
                      {item.number ? `, ${item.number}` : ""}
                    </Text>
                    <Text style={styles.suggestionCity} numberOfLines={1}>
                      {[item.neighborhood, item.city, item.state].filter(Boolean).join(", ")}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

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

        <TouchableOpacity
          style={styles.primaryRow}
          onPress={() => setIsPrimary((previous) => !previous)}
          activeOpacity={0.7}
        >
          <View style={styles.primaryRowText}>
            <Text style={styles.primaryRowTitle}>Endereço principal</Text>
            <Text style={styles.primaryRowSubtitle}>Usado como padrão nas solicitações</Text>
          </View>
          <Switch
            value={isPrimary}
            onValueChange={setIsPrimary}
            trackColor={{ false: theme.colors.border.DEFAULT, true: theme.colors.primary.DEFAULT }}
            thumbColor={theme.palette.neutral[0]}
          />
        </TouchableOpacity>

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

        {coordinates && (
          <View style={styles.mapSection}>
            <Text style={styles.label}>Localização no mapa</Text>
            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                onRegionChangeComplete={async (region) => {
                  setLatitude(region.latitude);
                  setLongitude(region.longitude);
                  try {
                    const results = await Location.reverseGeocodeAsync({
                      latitude: region.latitude,
                      longitude: region.longitude,
                    });
                    if (results.length > 0) {
                      const geocoded = results[0];
                      if (geocoded.street) setStreet(geocoded.street);
                      if (geocoded.streetNumber) setNumber(geocoded.streetNumber);
                      if (geocoded.district) setNeighborhood(geocoded.district);
                      if (geocoded.city) setCity(geocoded.city);
                      if (geocoded.region) setState(geocoded.region.slice(0, 2).toUpperCase());
                      if (geocoded.postalCode) setPostcode(formatCep(geocoded.postalCode));
                    }
                  } catch {
                    // coordenadas atualizadas mesmo sem reverse geocoding
                  }
                }}
              />
              <View style={styles.mapPinOverlay} pointerEvents="none">
                <Ionicons
                  name="location"
                  size={moderateScale(40, 0.3)}
                  color={theme.colors.primary.DEFAULT}
                />
              </View>
            </View>
            <Text style={styles.mapHint}>Mova o mapa para ajustar a posição</Text>
          </View>
        )}

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

      <Toast toast={toast} opacity={toastOpacity} />
    </KeyboardAvoidingView>
  );
}
