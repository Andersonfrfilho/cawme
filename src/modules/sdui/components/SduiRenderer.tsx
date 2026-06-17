import React from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { ScreenComponentData, ComponentType, SduiComponentProps } from '@/modules/sdui/types/sdui.types';
import { resolveSduiAction } from '@/shared/utils/sdui-action';
import { styles } from './styles';

import BannerCarousel from './BannerCarousel';
import CategoryList from './CategoryList';
import CategoryGrid from './CategoryGrid';
import ProviderGrid from './ProviderGrid';
import ProviderList from './ProviderList';
import SectionHeader from './SectionHeader';
import SearchBar from './SearchBar';
import SearchFilters from './SearchFilters';
import PromoBanner from './PromoBanner';
import EmptyState from './EmptyState';

const COMPONENT_MAP: Record<ComponentType, React.ComponentType<SduiComponentProps>> = {
  banner_carousel: BannerCarousel,
  category_list: CategoryList,
  category_grid: CategoryGrid,
  provider_grid: ProviderGrid,
  provider_list: ProviderList,
  section_header: SectionHeader,
  search_bar: SearchBar,
  search_filters: SearchFilters,
  promo_banner: PromoBanner,
  empty_state: EmptyState,
};

interface SduiRendererProps {
  readonly layout: ScreenComponentData[];
  readonly activeFilter?: string | null;
  readonly searchTerm?: string;
  readonly onFilterChange?: (filterId: string | null) => void;
  readonly onRefresh?: () => void;
  readonly refreshing?: boolean;
}

export function SduiRenderer({ layout, activeFilter, searchTerm, onFilterChange, onRefresh, refreshing }: SduiRendererProps) {
  return (
    <ScrollView
      style={styles.scrollView}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing ?? false}
            onRefresh={onRefresh}
            colors={['#1A45E8']}
            tintColor="#1A45E8"
          />
        ) : undefined
      }
    >
      {layout
        .sort((a, b) => a.order - b.order)
        .map((component) => {
          const Component = COMPONENT_MAP[component.type];
          if (!Component) return null;

          if (component.type === 'search_filters' || component.type === 'category_list') {
            return (
              <Component
                key={component.id}
                data={component.data}
                config={{ ...component.config, activeFilter }}
                onItemPress={(item) => {
                  const filterId = (item?.filterId ?? item?.name) as string | undefined;
                  onFilterChange?.(filterId === activeFilter ? null : (filterId ?? null));
                }}
              />
            );
          }

          if (component.type === 'provider_list' || component.type === 'provider_grid') {
            return (
              <Component
                key={component.id}
                data={component.data}
                config={{ ...component.config, activeFilter, searchTerm }}
                onItemPress={(item) => resolveSduiAction(component.action, item)}
              />
            );
          }

          return (
            <Component
              key={component.id}
              data={component.data}
              config={component.config}
              onItemPress={(item) => resolveSduiAction(component.action, item)}
            />
          );
        })}
    </ScrollView>
  );
}
