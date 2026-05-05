import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, FlatList, TextInput, StyleSheet } from "react-native";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useSearch } from "@/modules/search/hooks/useSearch";
import { styles } from "./styles";
import { t } from "@/shared/locales";
import { colors, theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export function SearchResults() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [searchTerm, setSearchTerm] = useState(params.q || '');
  
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useSearch({ q: params.q || '' });

  useEffect(() => {
    if (params.q) {
      setSearchTerm(params.q);
    }
  }, [params.q]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.setParams({ q: searchTerm.trim() });
      refetch();
    }
  };

  const allItems = data?.pages.flatMap((page) => page.layout ?? []) ?? [];

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <ActivityIndicator style={styles.footerLoader} />;
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={colors.text.secondary} />
      <Text style={styles.emptyText}>{t("search.noResults")}</Text>
      {searchTerm && (
        <Text style={styles.emptySubtext}>
          Tente buscar por: "eletricista", "encanador", "pedreiro"...
        </Text>
      )}
    </View>
  );

  return (
    <View style={localStyles.container}>
      {/* Search Input */}
      <View style={localStyles.searchContainer}>
        <View style={localStyles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.text.secondary}
            style={{ marginRight: moderateScale(8, 0.5) }}
          />
          
          <TextInput
            style={localStyles.input}
            placeholder="O que você precisa?"
            placeholderTextColor={colors.text.secondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          
          {searchTerm.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchTerm('');
                router.setParams({ q: '' });
                refetch();
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
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

      {/* Results */}
      {isLoading && <ActivityIndicator style={styles.loader} />}
      {isError && <Text style={styles.error}>{t("search.loadError")}</Text>}
      
      {!isLoading && !isError && (
        <FlatList
          data={allItems}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.type ?? "Item"}</Text>
            </View>
          )}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={allItems.length === 0 ? renderEmpty : null}
          contentContainerStyle={allItems.length === 0 ? styles.emptyContent : styles.listContent}
        />
      )}
    </View>
  );
}

export default function SearchScreen() {
  const navigation = useNavigation();
  const isSignedIn = useAuthStore((s) => s.isSignedIn);

  useLayoutEffect(() => {
    if (isSignedIn) {
      navigation.setOptions({ headerLeft: () => null });
      return;
    }
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.replace("/(auth)")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isSignedIn]);

  return <SearchResults />;
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
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
