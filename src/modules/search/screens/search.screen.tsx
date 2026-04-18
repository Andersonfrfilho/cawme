import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchService } from "@/modules/search/services/search.service";
import { SearchParams } from "@/modules/search/types/search.types";
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { t } from "@/shared/locales";

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
