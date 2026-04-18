import React from 'react';
import { ScrollView, View } from 'react-native';
import { ScreenComponentData, ComponentType, SduiComponentProps } from '@/modules/sdui/types/sdui.types';
import { resolveSduiAction } from '@/shared/utils/sdui-action';

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

export function SduiRenderer({ layout }: { layout: ScreenComponentData[] }) {
  return (
    <ScrollView style={{ flex: 1 }}>
      {layout
        .sort((a, b) => a.order - b.order)
        .map((component) => {
          const Component = COMPONENT_MAP[component.type];
          if (!Component) return null;
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
