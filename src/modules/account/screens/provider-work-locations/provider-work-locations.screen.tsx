import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { useLoading } from "@/shared/hooks/useLoading";
import { theme } from "@/shared/constants";
import { moderateScale } from "@/shared/utils/scale";
import {
  AccountService,
  type WorkLocation,
  type UserAddress,
} from "../../services/account.service";
import { styles } from "./styles";

export default function ProviderWorkLocationsScreen() {
  const navigation = useNavigation();
  const { account } = useLocale<LocaleKeys>();
  const { showLoading, hideLoading } = useLoading();

  const [locations, setLocations] = useState<WorkLocation[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: account.providerWorkLocationsTitle });
  }, [navigation, account.providerWorkLocationsTitle]);

  const loadLocations = useCallback(async () => {
    setLoadingLocations(true);
    try {
      const data = await AccountService.listWorkLocations();
      setLocations(data);
    } catch {
      Alert.alert("Erro", account.providerWorkLocationsAddError);
    } finally {
      setLoadingLocations(false);
    }
  }, [account.providerWorkLocationsAddError]);

  useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  const handleAdd = useCallback(async () => {
    try {
      const data = await AccountService.listAddresses();
      if (data.length === 0) {
        Alert.alert("", account.providerWorkLocationsNoAddresses);
        return;
      }
      const locationAddressIds = new Set(locations.map((l) => l.addressId));
      const available = data.filter((a) => !locationAddressIds.has(a.addressId));
      if (available.length === 0) {
        Alert.alert("", "Todos os seus endereços já estão adicionados como localizações.");
        return;
      }
      setAddresses(available);
      setPickerVisible(true);
    } catch {
      Alert.alert("Erro", account.providerWorkLocationsAddError);
    }
  }, [locations, account]);

  const handlePickAddress = useCallback(
    async (address: UserAddress) => {
      setPickerVisible(false);
      setAddingId(address.addressId);
      showLoading();
      try {
        await AccountService.addWorkLocation({ addressId: address.addressId });
        await loadLocations();
      } catch {
        Alert.alert("Erro", account.providerWorkLocationsAddError);
      } finally {
        hideLoading();
        setAddingId(null);
      }
    },
    [loadLocations, account, showLoading, hideLoading],
  );

  const handleRemove = useCallback(
    (location: WorkLocation) => {
      Alert.alert(
        account.providerWorkLocationsDeleteConfirmTitle,
        account.providerWorkLocationsDeleteConfirmMessage,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: account.providerWorkLocationsDeleteConfirmButton,
            style: "destructive",
            onPress: async () => {
              showLoading();
              try {
                await AccountService.removeWorkLocation(location.id);
                await loadLocations();
              } catch {
                Alert.alert("Erro", account.providerWorkLocationsDeleteError);
              } finally {
                hideLoading();
              }
            },
          },
        ],
      );
    },
    [account, loadLocations, showLoading, hideLoading],
  );

  const renderLocation = useCallback(
    ({ item }: { item: WorkLocation }) => (
      <View style={styles.locationCard}>
        <View style={styles.locationInfo}>
          {item.isPrimary && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>Principal</Text>
            </View>
          )}
          <Text style={styles.locationCity}>
            {item.city}, {item.state}
          </Text>
          <Text style={styles.locationStreet}>
            {item.street}, {item.neighborhood}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleRemove(item)} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={moderateScale(20)} color={theme.colors.status.error} />
        </TouchableOpacity>
      </View>
    ),
    [handleRemove],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{account.providerWorkLocationsSubtitle}</Text>

      {loadingLocations ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary.DEFAULT}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={renderLocation}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{account.providerWorkLocationsEmpty}</Text>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Ionicons name="add-circle-outline" size={moderateScale(20)} color={theme.palette.neutral[0]} />
        <Text style={styles.addButtonText}>{account.providerWorkLocationsAddButton}</Text>
      </TouchableOpacity>

      <Modal visible={pickerVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{account.providerWorkLocationsPickAddressTitle}</Text>
            <ScrollView>
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.addressId}
                  style={[styles.addressOption, addingId === address.addressId && styles.addressOptionDisabled]}
                  onPress={() => handlePickAddress(address)}
                  disabled={addingId !== null}
                >
                  <Text style={styles.addressOptionCity}>
                    {address.city}, {address.state}
                  </Text>
                  <Text style={styles.addressOptionStreet}>
                    {address.street}, {address.number}
                    {address.complement ? `, ${address.complement}` : ""}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setPickerVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
