import { Tabs } from 'expo-router';
import { useAppConfigStore } from '@/modules/app-config/store/app-config.store';
import { Ionicons } from '@expo/vector-icons';
import { t } from '@/shared/locales';
import { theme } from '@/shared/constants';

const DEFAULT_TABS = [
  { id: 'home', label: t('navigation.home'), icon: 'home-outline' },
  { id: 'search', label: t('navigation.search'), icon: 'search-outline' },
  { id: 'dashboard', label: t('navigation.dashboard'), icon: 'stats-chart-outline' },
  { id: 'chat', label: t('navigation.chat'), icon: 'chatbubbles-outline' },
  { id: 'notifications', label: t('navigation.notifications'), icon: 'notifications-outline' },
];

const ICON_MAP: Record<string, any> = {
  home: 'home-outline',
  'home-outline': 'home-outline',
  search: 'search-outline',
  'search-outline': 'search-outline',
  providers: 'people-outline',
  people: 'people-outline',
  'people-outline': 'people-outline',
  dashboard: 'stats-chart-outline',
  'stats-chart': 'stats-chart-outline',
  'stats-chart-outline': 'stats-chart-outline',
  chat: 'chatbubbles-outline',
  chatbubbles: 'chatbubbles-outline',
  'chatbubbles-outline': 'chatbubbles-outline',
  notifications: 'notifications-outline',
  'notifications-outline': 'notifications-outline',
  bell: 'notifications-outline',
  list: 'list-outline',
  filter: 'filter-outline',
};

export default function AppLayout() {
  const config = useAppConfigStore((s) => s.config);

  const rawTabs = config?.navigation.tabBar.items.filter((t) => t.visible) ?? DEFAULT_TABS;

  const tabs = rawTabs.filter((tab, index, self) =>
    index === self.findIndex((t) => t.id === tab.id),
  );

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colors.primary.DEFAULT }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.id}
          name={tab.id}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={ICON_MAP[tab.icon] ?? 'help-circle-outline'} size={size} color={color} />
            ),
            tabBarBadge: (tab as any).badge || undefined,
          }}
        />
      ))}
    </Tabs>
  );
}
