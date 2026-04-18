export type ComponentActionType = 'navigate' | 'open_modal' | 'external_link' | 'none';

export interface ComponentAction {
  type: ComponentActionType;
  route?: string;
  url?: string;
  params?: Record<string, string>;
}

export type ComponentType =
  | 'banner_carousel'
  | 'category_list'
  | 'category_grid'
  | 'provider_grid'
  | 'provider_list'
  | 'section_header'
  | 'search_bar'
  | 'search_filters'
  | 'promo_banner'
  | 'empty_state';

export interface ScreenComponentData {
  id: string;
  type: ComponentType;
  order: number;
  config: Record<string, any>;
  data: any[];
  action: ComponentAction | null;
}

export interface SduiComponentProps {
  data: any[];
  config: Record<string, any>;
  onItemPress: (item?: any) => void;
}
