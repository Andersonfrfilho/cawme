import React, { useState } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useSearch } from '@/modules/search/hooks/useSearch';
import { SduiRenderer } from '@/modules/sdui/components/SduiRenderer';
import { ScreenComponentData } from '@/modules/sdui/types/sdui.types';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useSearch({ q: query });

  // Achata todas as páginas de layout em uma única lista de componentes
  // Em SDUI paginado, geralmente o BFF repete o layout ou traz componentes de lista
  const allComponents = data?.pages.flatMap((page) => page.layout) ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.input}
          placeholder="O que você precisa?"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>Erro ao buscar resultados.</Text>
      ) : (
        <FlatList
          data={allComponents}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <SduiRenderer layout={[item]} />
          )}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator style={{ margin: 10 }} /> : null
          }
          ListEmptyComponent={
            !isLoading && <Text style={styles.emptyText}>Nenhum resultado encontrado.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
