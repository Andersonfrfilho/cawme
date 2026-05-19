import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { styles } from "./styles";
import type { MapPickerResult } from "./types";

const DEFAULT_LATITUDE = -23.5505;
const DEFAULT_LONGITUDE = -46.6333;

export default function MapPickerScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const params = useLocalSearchParams();
  const currentLatitude = params.initialLatitude ? parseFloat(params.initialLatitude as string) : DEFAULT_LATITUDE;
  const currentLongitude = params.initialLongitude ? parseFloat(params.initialLongitude as string) : DEFAULT_LONGITUDE;
  const initialAddress = (params.initialAddress as string) ?? "";
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [latitude, setLatitude] = useState(currentLatitude);
  const [longitude, setLongitude] = useState(currentLongitude);
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [addressDetails, setAddressDetails] = useState<{
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  }>({ street: "", number: "", neighborhood: "", city: "", state: "", cep: "" });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="close" size={moderateScale(24, 0.3)} color={theme.colors.text.primary} />
        </TouchableOpacity>
      ),
      headerTitle: auth.mapPickerTitle,
      headerRight: () => (
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={loading || !address}
          style={{ marginRight: 16 }}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.primary.DEFAULT} size="small" />
          ) : (
            <Text style={[styles.confirmText, (!address || loading) && styles.confirmTextDisabled]}>
              {auth.mapPickerConfirm}
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, loading, address]);

  const reverseGeocode = useCallback(async (geocodeLatitude: number, geocodeLongitude: number) => {
    setLoading(true);
    try {
      const result = await Location.reverseGeocodeAsync({ latitude: geocodeLatitude, longitude: geocodeLongitude });
      if (result.length > 0) {
        const location = result[0];
        const details = {
          street: location.street ?? "",
          number: location.streetNumber ?? "",
          neighborhood: location.district ?? location.subregion ?? "",
          city: location.city ?? "",
          state: location.region ?? "",
          cep: location.postalCode ?? "",
        };
        setAddressDetails(details);
        setAddress(
          [details.street, details.number, details.neighborhood, details.city, details.state]
            .filter(Boolean)
            .join(", "),
        );
      }
    } catch {
      Alert.alert(auth.mapPickerError, auth.mapPickerErrorDesc);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMarkerDragEnd = useCallback(
    async (event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
      const { latitude: markerLatitude, longitude: markerLongitude } = event.nativeEvent.coordinate;
      setLatitude(markerLatitude);
      setLongitude(markerLongitude);
      setSelecting(true);
      await reverseGeocode(markerLatitude, markerLongitude);
      setSelecting(false);
    },
    [reverseGeocode],
  );

  const handleConfirm = useCallback(() => {
    const result: MapPickerResult = {
      latitude,
      longitude,
      street: addressDetails.street,
      number: addressDetails.number,
      neighborhood: addressDetails.neighborhood,
      city: addressDetails.city,
      state: addressDetails.state,
      cep: addressDetails.cep,
      formattedAddress: address,
    };

    const returnTo = (params.returnTo as string) ?? "/address";
    const { initialLatitude, initialLongitude, initialAddress: _ia, returnTo: _rt, mapPickerResult, ...restParams } = params;
    router.navigate({
      pathname: returnTo as any,
      params: {
        ...restParams,
        mapPickerResult: JSON.stringify(result),
      },
    });
  }, [latitude, longitude, address, addressDetails, params]);

  const handleGetCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(auth.mapPickerPermission, auth.mapPickerPermissionDesc);
      return;
    }

    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude: currentLocationLatitude, longitude: currentLocationLongitude } = location.coords;
      setLatitude(currentLocationLatitude);
      setLongitude(currentLocationLongitude);
      await reverseGeocode(currentLocationLatitude, currentLocationLongitude);
    } catch {
      Alert.alert(auth.mapPickerError, auth.mapPickerErrorDesc);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          draggable
          onDragEnd={handleMarkerDragEnd}
          pinColor={theme.colors.primary.DEFAULT}
        />
      </MapView>

      {selecting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
        </View>
      )}

      {address && (
        <View style={[styles.addressCard, { marginBottom: insets.bottom }]}>
          <Ionicons name="location" size={moderateScale(20, 0.3)} color={theme.colors.primary.DEFAULT} />
          <Text style={styles.addressText} numberOfLines={2}>{address}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.currentLocationButton, { bottom: address ? verticalScale(100) + insets.bottom : verticalScale(24) + insets.bottom }]}
        onPress={handleGetCurrentLocation}
        disabled={loading}
        activeOpacity={0.85}
      >
        <Ionicons name="locate" size={moderateScale(20, 0.3)} color={theme.palette.neutral[0]} />
        <Text style={styles.currentLocationText}>{auth.mapPickerCurrentLocation}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
