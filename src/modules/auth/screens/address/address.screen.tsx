import React, { useState, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { cepProvider } from "@/shared/providers/cep";
import { AddressService } from "@/modules/auth/services/address.service";
import type { AddressSuggestion } from "@/modules/auth/services/address.service";
import { logger } from "@/shared/utils/logger";
import { useRegisterStore } from "@/modules/auth/store/register.store";
import type { MapPickerResult } from "@/modules/auth/screens/map-picker/types";
import { styles } from "./styles";
import type { AddressScreenParams, AddressFormValues } from "./types";

const DEFAULT_LATITUDE = -23.5505;
const DEFAULT_LONGITUDE = -46.6333;

type ScreenStep = "cep" | "autocomplete" | "confirm";

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function getRawCep(value: string): string {
  return value.replace(/\D/g, "");
}

export default function AddressScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const params = useLocalSearchParams<AddressScreenParams>();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBack = useCallback(() => {
    if (step === "autocomplete") {
      setStep("cep");
    } else {
      router.back();
    }
  }, [step]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="chevron-back" size={moderateScale(22, 0.3)} color={theme.colors.text.primary} />
        </TouchableOpacity>
      ),
      headerTitle: step === "autocomplete" ? "" : auth.addressTitle,
      headerShadowVisible: false,
    });
  }, [navigation, handleBack, step]);

  const [step, setStep] = useState<ScreenStep>("cep");
  const [cep, setCep] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [foundAddress, setFoundAddress] = useState<{
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    postcode: string;
    latitude?: string;
    longitude?: string;
  } | null>(null);
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [numberError, setNumberError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numberRef = useRef<TextInput>(null);
  const complementRef = useRef<TextInput>(null);
  const searchRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!params.mapPickerResult) return;
    try {
      const result = JSON.parse(params.mapPickerResult) as MapPickerResult;
      setFoundAddress({
        street: result.street,
        neighborhood: result.neighborhood,
        city: result.city,
        state: result.state,
        postcode: result.cep,
        latitude: String(result.latitude),
        longitude: String(result.longitude),
      });
      if (result.cep) setCep(formatCep(result.cep));
      setStep("confirm");
    } catch {}
  }, [params.mapPickerResult]);

  const handleCepChange = useCallback((text: string) => {
    const formatted = formatCep(text);
    setCep(formatted);
    setCepError("");

    const raw = getRawCep(formatted);
    if (raw.length === 8) {
      Keyboard.dismiss();
      lookupCep(raw);
    }
  }, []);

  const lookupCep = useCallback(async (rawCep: string) => {
    setLoadingCep(true);
    setCepError("");
    try {
      const result = await cepProvider.search(rawCep);
      if (result && result.localidade) {
        // ViaCEP returns only text — geocode to get coordinates for the map marker.
        // Build query from most-specific to least: street, neighborhood, city, state + country.
        let latitude: string | undefined;
        let longitude: string | undefined;
        try {
          const geocodeQuery = [result.logradouro, result.bairro, result.localidade, result.uf, "Brasil"]
            .filter(Boolean)
            .join(", ");
          const geocoded = await Location.geocodeAsync(geocodeQuery);
          if (geocoded.length > 0) {
            latitude = String(geocoded[0].latitude);
            longitude = String(geocoded[0].longitude);
          }
        } catch {
          // Geocoding failed — map will show at default coordinates; user can adjust with map picker
        }

        setFoundAddress({
          street: result.logradouro || "",
          neighborhood: result.bairro || "",
          city: result.localidade || "",
          state: result.uf || "",
          postcode: rawCep,
          latitude,
          longitude,
        });
        setStep("confirm");
        logger.screenEvent("AddressScreen", "cep.found", { cep: rawCep });
        setTimeout(() => numberRef.current?.focus(), 300);
      } else {
        setCepError(auth.addressCepNotFound);
        logger.screenEvent("AddressScreen", "cep.not-found", { cep: rawCep });
      }
    } catch {
      setCepError(auth.addressCepNotFound);
      logger.screenEvent("AddressScreen", "cep.error", { cep: rawCep });
    } finally {
      setLoadingCep(false);
    }
  }, [auth]);

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

  const handleSelectSuggestion = useCallback((item: AddressSuggestion) => {
    setFoundAddress({
      street: item.street,
      neighborhood: item.neighborhood,
      city: item.city,
      state: item.state,
      postcode: item.postcode.replace(/\D/g, ""),
      latitude: String(item.latitude),
      longitude: String(item.longitude),
    });
    setCep(item.postcode ? formatCep(item.postcode) : cep);
    setStep("confirm");
    logger.screenEvent("AddressScreen", "autocomplete.select", { address: item.fullAddress });
    setTimeout(() => numberRef.current?.focus(), 300);
  }, [cep]);

  const handleChangeCep = useCallback(() => {
    setStep("cep");
    setFoundAddress(null);
    setNumber("");
    setComplement("");
    setNumberError("");
  }, []);

  const handleGoToSearch = useCallback(() => {
    setStep("autocomplete");
    setSuggestions([]);
    setSearchQuery("");
    setTimeout(() => searchRef.current?.focus(), 300);
  }, []);

  const handleOpenMapPicker = useCallback(() => {
    const lat = foundAddress?.latitude ? parseFloat(foundAddress.latitude) : DEFAULT_LATITUDE;
    const lng = foundAddress?.longitude ? parseFloat(foundAddress.longitude) : DEFAULT_LONGITUDE;
    const addressLabel = foundAddress
      ? [foundAddress.street, foundAddress.city, foundAddress.state].filter(Boolean).join(", ")
      : "";
    router.push({
      pathname: "/(auth)/map-picker" as any,
      params: {
        ...params,
        initialLatitude: String(lat),
        initialLongitude: String(lng),
        initialAddress: addressLabel,
        returnTo: "/(auth)/address",
      },
    });
  }, [foundAddress, params]);

  const handleAdvance = useCallback(async () => {
    if (!number.trim()) {
      setNumberError(auth.addressNumberRequired);
      numberRef.current?.focus();
      return;
    }
    if (!foundAddress) return;

    setIsSubmitting(true);

    try {
      await AddressService.saveAddress({
        keycloakId: params.keycloakId,
        cep: getRawCep(cep) || foundAddress.postcode,
        street: foundAddress.street,
        number: number.trim(),
        complement: complement.trim() || undefined,
        neighborhood: foundAddress.neighborhood,
        city: foundAddress.city,
        state: foundAddress.state,
        latitude: foundAddress.latitude,
        longitude: foundAddress.longitude,
      });

      useRegisterStore.getState().setAddress({
        cep: getRawCep(cep) || foundAddress.postcode,
        street: foundAddress.street,
        number: number.trim(),
        complement: complement.trim() || undefined,
        neighborhood: foundAddress.neighborhood,
        city: foundAddress.city,
        state: foundAddress.state,
        latitude: foundAddress.latitude,
        longitude: foundAddress.longitude,
      });

      logger.screenEvent("AddressScreen", "address.complete", { cep: foundAddress.postcode });

      router.replace({
        pathname: "/verification" as any,
        params: {
          email: params.email,
          phone: params.phone,
          firstName: params.firstName,
          lastName: params.lastName,
          documentType: params.documentType,
          mode: "post-register",
        },
      });
    } catch (error) {
      setIsSubmitting(false);
    }
  }, [number, complement, foundAddress, cep, params]);

  if (step === "autocomplete") {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
          <View style={styles.searchHeader}>
            <View style={styles.searchInputRow}>
              <Ionicons
                name="search-outline"
                size={moderateScale(18, 0.3)}
                color={theme.colors.primary.DEFAULT}
                style={styles.searchIcon}
              />
              <TextInput
                ref={searchRef}
                style={styles.searchInput}
                placeholder={auth.addressSearchPlaceholder}
                placeholderTextColor={theme.palette.neutral[400]}
                value={searchQuery}
                onChangeText={handleSearchChange}
                autoFocus
                returnKeyType="search"
                autoCorrect={false}
                spellCheck={false}
              />
              {loadingSuggestions && (
                <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
              )}
              {searchQuery.length > 0 && !loadingSuggestions && (
                <TouchableOpacity
                  onPress={() => { setSearchQuery(""); setSuggestions([]); }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={moderateScale(18, 0.3)} color={theme.palette.neutral[400]} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            style={styles.suggestionScrollView}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={`s-${index}`}
                style={[styles.suggestionItem, index === suggestions.length - 1 && styles.suggestionItemLast]}
                onPress={() => handleSelectSuggestion(item)}
                activeOpacity={0.7}
              >
                <View style={styles.suggestionIcon}>
                  <Ionicons name="location" size={moderateScale(18, 0.3)} color={theme.colors.primary.DEFAULT} />
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionStreet} numberOfLines={1}>
                    {item.street}{item.number ? `, ${item.number}` : ""}
                  </Text>
                  <Text style={styles.suggestionCity} numberOfLines={1}>
                    {[item.neighborhood, item.city, item.state].filter(Boolean).join(", ")}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={moderateScale(16, 0.3)} color={theme.palette.neutral[300]} />
              </TouchableOpacity>
            ))}

            {searchQuery.length >= 3 && !loadingSuggestions && suggestions.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={moderateScale(36, 0.3)} color={theme.palette.neutral[300]} />
                <Text style={styles.emptyStateText}>Nenhum resultado encontrado</Text>
                <Text style={styles.emptyStateSubtext}>Tente um endereço diferente</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  if (step === "confirm" && foundAddress) {
    const hasCoordinates = !!foundAddress.latitude && !!foundAddress.longitude;
    const mapLat = hasCoordinates ? parseFloat(foundAddress.latitude!) : DEFAULT_LATITUDE;
    const mapLng = hasCoordinates ? parseFloat(foundAddress.longitude!) : DEFAULT_LONGITUDE;

    return (
      <View style={styles.root}>
        <View style={styles.confirmMapContainer}>
          <MapView
            style={styles.confirmMap}
            region={{ latitude: mapLat, longitude: mapLng, latitudeDelta: 0.005, longitudeDelta: 0.005 }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            showsUserLocation={false}
          >
            {hasCoordinates && (
              <Marker coordinate={{ latitude: mapLat, longitude: mapLng }} pinColor={theme.colors.primary.DEFAULT} />
            )}
          </MapView>
          <TouchableOpacity style={styles.confirmMapTouchable} onPress={handleOpenMapPicker} activeOpacity={0.85}>
            <View style={styles.confirmMapAdjustBadge}>
              <Ionicons name="pencil-outline" size={moderateScale(12, 0.3)} color={theme.palette.neutral[0]} />
              <Text style={styles.confirmMapAdjustText}>{auth.addressUseMap}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.confirmSection}>
              <View style={styles.foundBadge}>
                <Ionicons name="checkmark-circle" size={moderateScale(18, 0.3)} color={theme.colors.status.success} />
                <Text style={styles.foundBadgeText}>{auth.addressFoundLabel}</Text>
              </View>

              <View style={styles.addressCard}>
                <View style={styles.addressCardIcon}>
                  <Ionicons name="location" size={moderateScale(20, 0.3)} color={theme.colors.primary.DEFAULT} />
                </View>
                <View style={styles.addressCardContent}>
                  <Text style={styles.addressCardStreet}>
                    {foundAddress.street || foundAddress.city}
                  </Text>
                  <Text style={styles.addressCardCity}>
                    {[foundAddress.neighborhood, foundAddress.city, foundAddress.state]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                  {cep.length > 0 && (
                    <Text style={styles.addressCardCep}>CEP {cep}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={handleChangeCep}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.changeButtonText}>{auth.addressChangeButton}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldsSection}>
              <View style={styles.numberRow}>
                <View style={styles.numberField}>
                  <Text style={styles.fieldLabel}>{auth.addressNumberLabel}</Text>
                  <TextInput
                    testID="address-number-input"
                    ref={numberRef}
                    style={[styles.fieldInput, numberError ? styles.fieldInputError : null]}
                    placeholder={auth.addressNumberPlaceholder}
                    placeholderTextColor={theme.palette.neutral[400]}
                    value={number}
                    onChangeText={(text) => { setNumber(text); setNumberError(""); }}
                    keyboardType="numeric"
                    returnKeyType="next"
                    onSubmitEditing={() => complementRef.current?.focus()}
                    autoCorrect={false}
                  />
                  {numberError ? <Text style={styles.fieldError}>{numberError}</Text> : null}
                </View>

                <View style={styles.complementField}>
                  <Text style={styles.fieldLabel}>{auth.addressComplementLabel}</Text>
                  <TextInput
                    ref={complementRef}
                    style={styles.fieldInput}
                    placeholder={auth.addressComplementPlaceholder}
                    placeholderTextColor={theme.palette.neutral[400]}
                    value={complement}
                    onChangeText={setComplement}
                    returnKeyType="done"
                    onSubmitEditing={handleAdvance}
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
            <TouchableOpacity
              testID="address-advance-button"
              style={[styles.advanceButton, isSubmitting && styles.advanceButtonDisabled]}
              onPress={handleAdvance}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.palette.neutral[0]} size="small" />
              ) : (
                <Text style={styles.advanceButtonText}>{auth.addressAdvanceButton}</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cepStepHeader}>
            <Text style={styles.cepStepTitle}>{auth.addressTitle}</Text>
            <Text style={styles.cepStepSubtitle}>{auth.addressSubtitle}</Text>
          </View>

          <Text style={styles.fieldLabel}>{auth.addressCepLabel}</Text>
          <View style={[styles.cepInputRow, cepError ? styles.cepInputRowError : null]}>
            <Ionicons
              name="location-outline"
              size={moderateScale(20, 0.3)}
              color={cepError ? theme.colors.status.error : theme.colors.primary.DEFAULT}
              style={styles.cepIcon}
            />
            <TextInput
              testID="address-cep-input"
              style={styles.cepInput}
              placeholder={auth.addressCepPlaceholder}
              placeholderTextColor={theme.palette.neutral[400]}
              value={cep}
              onChangeText={handleCepChange}
              keyboardType="numeric"
              returnKeyType="done"
              maxLength={9}
              autoFocus
              autoCorrect={false}
            />
            {loadingCep && (
              <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
            )}
          </View>

          {cepError ? (
            <View style={styles.cepErrorRow}>
              <Ionicons name="alert-circle-outline" size={moderateScale(14, 0.3)} color={theme.colors.status.error} />
              <Text style={styles.cepErrorText}>{cepError}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.dontKnowCepButton} onPress={handleGoToSearch} activeOpacity={0.7}>
            <Text style={styles.dontKnowCepText}>{auth.addressDontKnowCep}</Text>
            <Ionicons name="chevron-forward" size={moderateScale(14, 0.3)} color={theme.colors.primary.DEFAULT} />
          </TouchableOpacity>

          <View style={styles.orDivider}>
            <View style={styles.orDividerLine} />
            <Text style={styles.orDividerText}>{auth.addressOr}</Text>
            <View style={styles.orDividerLine} />
          </View>

          <TouchableOpacity style={styles.mapButton} onPress={handleOpenMapPicker} activeOpacity={0.8}>
            <Ionicons name="map-outline" size={moderateScale(18, 0.3)} color={theme.colors.primary.DEFAULT} />
            <Text style={styles.mapButtonText}>{auth.addressUseMap}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
