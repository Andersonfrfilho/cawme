import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAccount } from "@/modules/account/hooks/useAccount";
import type { UserAddress } from "@/modules/account/services/account.service";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

import { styles } from "./styles";

export default function AddressListScreen() {
  const insets = useSafeAreaInsets();
  const { account } = useLocale<LocaleKeys>();
  const { listAddresses, deleteAddress } = useAccount();

  const [addresses, setAddresses] = useState<UserAddress[]>([]);

  useFocusEffect(
    useCallback(() => {
      listAddresses()
        .then(setAddresses)
        .catch(() => {});
    }, []),
  );

  function handleAdd(): void {
    router.push({ pathname: "/(app)/account/address-change" as any });
  }

  function handleEdit(address: UserAddress): void {
    router.push({
      pathname: "/(app)/account/address-change" as any,
      params: {
        addressId: address.id,
        label: address.label,
        street: address.street,
        number: address.number,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        postcode: address.postcode,
      },
    });
  }

  function handleDelete(address: UserAddress): void {
    Alert.alert(
      account.addressDeleteConfirmTitle,
      account.addressDeleteConfirmMessage,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: account.addressDeleteConfirmButton,
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAddress(address.id);
              setAddresses((prev) => prev.filter((a) => a.id !== address.id));
            } catch {
              Alert.alert("", "Não foi possível remover o endereço.");
            }
          },
        },
      ],
    );
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
                  <Text style={styles.addressLabel}>{address.label}</Text>
                </View>
                <Text style={styles.addressText} numberOfLines={2}>
                  {formatAddress(address)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(address)}
                hitSlop={8}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={theme.colors.status.error}
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
    </View>
  );
}
