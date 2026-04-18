import { Tabs } from 'expo-router';
import { useAppConfigStore } from '@/modules/app-config/store/app-config.store';
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_TABS = [
  { id: 'home', label: 'Início', icon: 'home-outline' },
  { id: 'search', label: 'Buscar', icon: 'search-outline' },
  { id: 'dashboard', label: 'Dashboard', icon: 'stats-chart-outline' },
  { id: 'chat', label: 'Chat', icon: 'chatbubbles-outline' },
  { id: 'notifications', label: 'Avisos', icon: 'notifications-outline' },
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
            tabBarBadge: tab.badge || undefined,
          }}
        />
      ))}
    </Tabs>
  );
}
