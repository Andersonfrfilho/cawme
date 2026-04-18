import { Tabs } from 'expo-router';
import { useAppConfigStore } from '@/modules/app-config/store/app-config.store';
import { Ionicons } from '@expo/vector-icons';
import { t } from '@/shared/locales';

const DEFAULT_TABS = [
  { id: 'home', label: t('navigation.home'), icon: 'home-outline' },
  { id: 'search', label: t('navigation.search'), icon: 'search-outline' },
  { id: 'dashboard', label: t('navigation.dashboard'), icon: 'stats-chart-outline' },
  { id: 'chat', label: t('navigation.chat'), icon: 'chatbubbles-outline' },
  { id: 'notifications', label: t('navigation.notifications'), icon: 'notifications-outline' },
];

export default function AppLayout() {
  const config = useAppConfigStore((s) => s.config);
  
  // Mapeia ícones do BFF para Ionicons (exemplo simplificado)
  const getIconName = (icon: string): any => {
    switch (icon) {
      case 'home': return 'home';
      case 'search': return 'search';
      case 'dashboard': return 'stats-chart';
      case 'chat': return 'chatbubbles';
      case 'notifications': return 'notifications';
      default: return 'help-circle';
    }
  };

  const tabs = config?.navigation.tabBar.items.filter((t) => t.visible) ?? DEFAULT_TABS;

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.id}
          name={tab.id}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={getIconName(tab.icon)} size={size} color={color} />
            ),
                tabBarBadge: (tab as any).badge || undefined,
          }}
        />
      ))}
    </Tabs>
  );
}
