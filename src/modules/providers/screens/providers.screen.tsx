import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale, scale } from "@/shared/utils/scale";
import { styles } from "./styles";

type ProviderItem = {
  id: string;
  businessName: string;
  averageRating: number;
  reviewCount: number;
  city: string;
  state: string;
  isAvailable: boolean;
};

const MOCK_PROVIDERS: ProviderItem[] = [
  { id: "1", businessName: "Maria Limpeza", averageRating: 4.9, reviewCount: 122, city: "São Paulo", state: "SP", isAvailable: true },
  { id: "2", businessName: "João Elétrica", averageRating: 4.7, reviewCount: 88, city: "São Paulo", state: "SP", isAvailable: true },
  { id: "3", businessName: "Ana Pintura", averageRating: 4.8, reviewCount: 56, city: "Campinas", state: "SP", isAvailable: false },
  { id: "4", businessName: "Carlos Encanador", averageRating: 4.6, reviewCount: 34, city: "São Paulo", state: "SP", isAvailable: true },
  { id: "5", businessName: "Fernanda Jardinagem", averageRating: 5.0, reviewCount: 210, city: "Guarulhos", state: "SP", isAvailable: true },
];

export default function ProvidersScreen() {
  const { providers } = useLocale<LocaleKeys>();

  const renderProvider = ({ item }: { item: ProviderItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/providers/${item.id}/profile` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.cardAvatar}>
        <Ionicons name="person" size={scale(28)} color={theme.colors.primary.DEFAULT} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.businessName}</Text>
        <View style={styles.cardRow}>
          <Ionicons name="star" size={moderateScale(14, 0.3)} color={theme.colors.accent.yellow} />
          <Text style={styles.cardRating}>{item.averageRating}</Text>
          <Text style={styles.cardReviews}>({item.reviewCount})</Text>
          <Ionicons name="location-outline" size={moderateScale(14, 0.3)} color={theme.colors.text.tertiary} style={{ marginLeft: moderateScale(8, 0.5) }} />
          <Text style={styles.cardLocation}>{item.city}, {item.state}</Text>
        </View>
        <View style={[styles.badge, item.isAvailable ? styles.badgeAvailable : styles.badgeUnavailable]}>
          <Text style={[styles.badgeText, item.isAvailable ? styles.badgeTextAvailable : styles.badgeTextUnavailable]}>
            {item.isAvailable ? providers.available : providers.unavailable}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={moderateScale(20, 0.3)} color={theme.colors.text.tertiary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={MOCK_PROVIDERS}
        keyExtractor={(item) => item.id}
        renderItem={renderProvider}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
