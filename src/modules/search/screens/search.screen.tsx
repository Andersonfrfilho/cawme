import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchService } from "@/modules/search/services/search.service";
import { SearchParams } from "@/modules/search/types/search.types";
import React, { useLayoutEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { styles } from "./styles";
import { t } from "@/shared/locales";
import { colors } from "@/shared/constants";

export function SearchResults({
  params,
}: {
  params: Omit<SearchParams, "page">;
}) {
  const query = useInfiniteQuery({
    queryKey: ["search", params],
    queryFn: ({ pageParam = 1 }) =>
      SearchService.get({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 2 * 60 * 1000,
  });

  if (query.isLoading) return <ActivityIndicator style={styles.loader} />;
  if (query.isError)
    return <Text style={styles.error}>{t("search.loadError")}</Text>;

  return (
    <View style={styles.container}>
      <Text>Resultados</Text>
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

  return (
    <SearchResults
      params={
        {
          /* placeholder */
        } as any
      }
    />
  );
}
