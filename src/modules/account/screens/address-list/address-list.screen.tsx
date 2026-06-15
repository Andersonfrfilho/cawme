import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAccount } from "@/modules/account/hooks/useAccount";
import type { UserAddress } from "@/modules/account/services/account.service";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

import { styles } from "./styles";

function handleAdd(): void {
  router.push({ pathname: "/(app)/account/address-change" as any });
}

export default function AddressListScreen() {
  const insets = useSafeAreaInsets();
  const { account } = useLocale<LocaleKeys>();
  const { listAddresses, deleteAddress } = useAccount();

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [confirmAddress, setConfirmAddress] = useState<UserAddress | null>(null);

  useFocusEffect(
    useCallback(() => {
      listAddresses().then(setAddresses).catch(() => {});
    }, []),
  );

  function handleEdit(address: UserAddress): void {
    router.push({
      pathname: "/(app)/account/address-change" as any,
      params: {
        addressId: address.id,
        label: address.label,
        isPrimary: String(address.isPrimary),
        street: address.street,
        number: address.number,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        postcode: address.postcode,
        latitude: address.latitude != null ? String(address.latitude) : undefined,
        longitude: address.longitude != null ? String(address.longitude) : undefined,
      },
    });
  }

  async function handleDeleteConfirmed(): Promise<void> {
    if (!confirmAddress) return;
    const target = confirmAddress;
    setConfirmAddress(null);
    try {
      await deleteAddress(target.id);
      setAddresses((prev) => prev.filter((a) => a.id !== target.id));
    } catch {
      Alert.alert("", "Não foi possível remover o endereço.");
    }
  }

  function formatAddress(address: UserAddress): string {
    return `${address.street}, ${address.number} — ${address.city}/${address.state}`;
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{account.addressListTitle}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: moderateScale(32, 0.5) }}
      >
        {addresses.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum endereço cadastrado.</Text>
        ) : (
          addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <TouchableOpacity
                style={styles.addressInfo}
                onPress={() => handleEdit(address)}
                activeOpacity={0.7}
              >
                <View style={styles.addressLabelRow}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={theme.colors.primary.DEFAULT}
                  />
                  <Text style={styles.addressLabel} numberOfLines={1} ellipsizeMode="tail">
                    {address.label}
                  </Text>
                  {address.isPrimary && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryBadgeText}>Principal</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText} numberOfLines={2}>
                  {formatAddress(address)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButton, addresses.length === 1 && styles.deleteButtonDisabled]}
                onPress={() => setConfirmAddress(address)}
                disabled={addresses.length === 1}
                hitSlop={8}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={addresses.length === 1 ? theme.colors.text.tertiary : theme.colors.status.error}
                />
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.85}>
          <Ionicons name="add" size={20} color={theme.palette.neutral[0]} />
          <Text style={styles.addButtonText}>{account.addressAddButton}</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmModal
        visible={confirmAddress !== null}
        title={account.addressDeleteConfirmTitle}
        message={account.addressDeleteConfirmMessage}
        confirmLabel={account.addressDeleteConfirmButton}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmAddress(null)}
      />
    </View>
  );
}
