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
import type { MapPickerScreenParams, MapPickerResult } from "./types";

const DEFAULT_LAT = -23.5505;
const DEFAULT_LNG = -46.6333;

export default function MapPickerScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const params = useLocalSearchParams();
  const initialLat = params.initialLat ? parseFloat(params.initialLat as string) : DEFAULT_LAT;
  const initialLng = params.initialLng ? parseFloat(params.initialLng as string) : DEFAULT_LNG;
  const initialAddress = (params.initialAddress as string) ?? "";
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);

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

  const reverseGeocode = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const result = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (result.length > 0) {
        const loc = result[0];
        setAddress(
          [loc.street, loc.streetNumber, loc.district, loc.city, loc.region]
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
    async (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      setLat(latitude);
      setLng(longitude);
      setSelecting(true);
      await reverseGeocode(latitude, longitude);
      setSelecting(false);
    },
    [reverseGeocode],
  );

  const handleConfirm = useCallback(() => {
    const result: MapPickerResult = {
      lat,
      lng,
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      cep: "",
      formattedAddress: address,
    };

    router.dismiss();
    router.setParams({
      mapPickerResult: JSON.stringify(result),
    });
  }, [lat, lng, address]);

  const handleGetCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(auth.mapPickerPermission, auth.mapPickerPermissionDesc);
      return;
    }

    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLat(latitude);
      setLng(longitude);
      await reverseGeocode(latitude, longitude);
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
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
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
