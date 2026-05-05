import { useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, StyleSheet } from "react-native";
import { useNavigation, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useHome } from "@/modules/home/hooks/useHome";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { SduiRenderer } from "@/modules/sdui/components/SduiRenderer";
import { styles } from "./styles";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export default function HomeScreen() {
  const { home } = useLocale<LocaleKeys>();
  const { data, isLoading, error, refetch } = useHome();
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const { logout } = useAuth();
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () =>
        isSignedIn ? (
          <TouchableOpacity
            onPress={logout}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="log-out-outline" size={22} color={theme.colors.status.error} />
          </TouchableOpacity>
        )         : (
          <TouchableOpacity
            onPress={() => router.push("/(auth)")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="log-in-outline" size={22} color={theme.colors.primary.DEFAULT} />
          </TouchableOpacity>
        ),
    });
  }, [navigation, isSignedIn, logout]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push({
        pathname: '/(app)/search' as any,
        params: { q: searchTerm.trim() },
      });
      setSearchTerm('');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
      </View>
    );
  }

  if (error && isSignedIn) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{home.loadError}</Text>
        <Text onPress={() => refetch()} style={styles.retryText}>
          {home.loadError}
        </Text>
      </View>
    );
  }

  if (error && !isSignedIn) {
    return (
      <View style={styles.guestContainer}>
        <Ionicons name="home-outline" size={64} color={theme.colors.primary.light} />
        <Text style={styles.guestTitle}>{home.guestWelcome}</Text>
        <Text style={styles.guestDescription}>{home.guestDescription}</Text>
        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => router.push("/(auth)")}
          activeOpacity={0.85}
        >
          <Ionicons name="log-in-outline" size={20} color={theme.palette.neutral[0]} style={{ marginRight: moderateScale(8, 0.5) }} />
          <Text style={styles.guestButtonText}>{home.signIn}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar Fixa no Topo */}
      <View style={localStyles.searchContainer}>
        <View style={localStyles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color={theme.colors.text.secondary}
            style={localStyles.searchIcon}
          />
          
          <TextInput
            style={localStyles.input}
            placeholder="Buscar profissionais..."
            placeholderTextColor={theme.colors.text.secondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          
          {searchTerm.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchTerm('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={handleSearch}
            style={localStyles.searchButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="search" size={20} color={theme.colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
      </View>
      
      <SduiRenderer layout={data?.layout ?? []} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  searchContainer: {
    backgroundColor: theme.colors.background.DEFAULT,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.xl,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: verticalScale(10),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
  },
  searchIcon: {
    marginRight: moderateScale(8, 0.5),
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    paddingVertical: 0,
  },
  searchButton: {
    marginLeft: moderateScale(8, 0.5),
    padding: moderateScale(4, 0.3),
  },
});
