import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SduiComponentProps } from '@/modules/sdui/types/sdui.types';
import { theme } from '@/shared/constants';
import { moderateScale, verticalScale } from '@/shared/utils/scale';
import { router } from 'expo-router';

interface SearchBarConfig {
  placeholder?: string;
  showFilters?: boolean;
}

export default function SearchBar({ config, onItemPress }: SduiComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchBarConfig: SearchBarConfig = config || {};

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push({
        pathname: '/(app)/search' as any,
        params: { q: searchTerm.trim() },
      });
      onItemPress({ searchTerm: searchTerm.trim() });
    }
  };

  const handleNavigateToSearch = () => {
    router.push('/(app)/search' as any);
    onItemPress({});
  };

  return (
    <View style={localStyles.container}>
      <View style={localStyles.searchBar}>
        <Ionicons
          name="search-outline"
          size={20}
          color={theme.colors.text.secondary}
          style={localStyles.searchIcon}
        />
        
        <TextInput
          style={localStyles.input}
          placeholder={searchBarConfig.placeholder || 'O que você precisa?'}
          placeholderTextColor={theme.colors.text.secondary}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
      
      {searchBarConfig.showFilters && (
        <View style={localStyles.filtersRow}>
          <TouchableOpacity style={localStyles.filterChip} onPress={handleNavigateToSearch}>
            <Ionicons name="location-outline" size={14} color={theme.colors.text.primary} />
            <Text style={localStyles.filterChipText}>Localização</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={localStyles.filterChip} onPress={handleNavigateToSearch}>
            <Ionicons name="star-outline" size={14} color={theme.colors.text.primary} />
            <Text style={localStyles.filterChipText}>Melhores avaliados</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(8),
    backgroundColor: theme.colors.background.DEFAULT,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.xl,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: verticalScale(12),
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
  filtersRow: {
    flexDirection: 'row',
    marginTop: verticalScale(12),
    gap: theme.spacing[2],
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: verticalScale(8),
    borderRadius: theme.radii.lg,
    gap: moderateScale(6, 0.3),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
  },
  filterChipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
