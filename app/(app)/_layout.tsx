import { Tabs } from 'expo-router';
import { useAppConfigStore } from '@/modules/app-config/store/app-config.store';
import { Ionicons } from '@expo/vector-icons';
import { t } from '@/shared/locales';
import { theme } from '@/shared/constants';
import { scale } from '@/shared/utils/scale';
import { BottomTabBar } from '@/shared/components/BottomTabBar';

// Rotas em (app)/ que não devem aparecer como tabs
const HIDDEN_ROUTES = ['providers', 'company'];

const DEFAULT_TABS = [
  { id: 'search', label: t('navigation.search'), icon: 'search-outline' },
  { id: 'dashboard', label: t('navigation.dashboard'), icon: 'stats-chart-outline' },
  { id: 'home', label: t('navigation.home'), icon: 'home-outline' },
  { id: 'chat', label: t('navigation.chat'), icon: 'chatbubbles-outline' },
  { id: 'notifications', label: t('navigation.notifications'), icon: 'notifications-outline' },
];

const ICON_MAP: Record<string, any> = {
  home: 'home-outline',
  'home-outline': 'home-outline',
  search: 'search-outline',
  'search-outline': 'search-outline',
  dashboard: 'stats-chart-outline',
  'stats-chart': 'stats-chart-outline',
  'stats-chart-outline': 'stats-chart-outline',
  list: 'list-outline',
  chat: 'chatbubbles-outline',
  chatbubbles: 'chatbubbles-outline',
  'chatbubbles-outline': 'chatbubbles-outline',
  notifications: 'notifications-outline',
  'notifications-outline': 'notifications-outline',
  bell: 'notifications-outline',
};

function centerHome<T extends { id: string }>(tabs: T[]): T[] {
  const home = tabs.find((tab) => tab.id === 'home');
  const others = tabs.filter((tab) => tab.id !== 'home');
  if (!home) return tabs;
  const mid = Math.floor(others.length / 2);
  return [...others.slice(0, mid), home, ...others.slice(mid)];
}

export default function AppLayout() {
  const config = useAppConfigStore((s) => s.config);

  const rawTabs = config?.navigation.tabBar.items.filter((tab) => tab.visible) ?? DEFAULT_TABS;

  const uniqueTabs = rawTabs.filter((tab, index, self) =>
    index === self.findIndex((t) => t.id === tab.id),
  );

  const tabs = centerHome(uniqueTabs);

  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} hiddenRoutes={HIDDEN_ROUTES} />}
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary.DEFAULT,
        tabBarInactiveTintColor: theme.colors.text.secondary,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.id}
          name={tab.id}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={ICON_MAP[tab.icon] ?? 'help-circle-outline'}
                size={focused ? size + scale(2) : size}
                color={color}
              />
            ),
            tabBarBadge: (tab as any).badge || undefined,
          }}
        />
      ))}

      {HIDDEN_ROUTES.map((name) => (
        <Tabs.Screen key={name} name={name} options={{ href: null }} />
      ))}
    </Tabs>
  );
}
