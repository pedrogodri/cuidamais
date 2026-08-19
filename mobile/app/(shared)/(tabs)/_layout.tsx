import { Tabs } from 'expo-router';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';
import { useSessionGuard } from '@/features/auth/guards/useSessionGuard';
import { getProfileIconColorHex, getProfileTheme } from '@/features/auth/theme/profileTheme';
import { TabBarIcon } from '@/features/navigation/components/TabBarIcon';
import { isTabVisible } from '@/features/navigation/getVisibleTabs';

const DEFAULT_TONE = {
  activeBgClass: 'bg-petrol-100',
  activeTextClass: 'text-petrol-700',
  activeColorHex: '#123D36',
};

export default function TabsLayout() {
  useSessionGuard();
  const activeProfile = useActiveProfileStore((state) => state.activeProfile);
  const activeType = activeProfile?.type ?? null;

  const tone = activeType
    ? {
        activeBgClass: getProfileTheme(activeType).bgClass100,
        activeTextClass: getProfileTheme(activeType).textClass700,
        activeColorHex: getProfileIconColorHex(activeType),
      }
    : DEFAULT_TONE;

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          href: isTabVisible('home', activeType) ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon="home-outline"
              activeIcon="home"
              label="Home"
              {...tone}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          href: isTabVisible('perfil', activeType) ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon="person-outline"
              activeIcon="person"
              label="Perfil"
              {...tone}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Buscar',
          href: isTabVisible('buscar', activeType) ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon="search-outline"
              activeIcon="search"
              label="Buscar"
              {...tone}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          href: isTabVisible('agenda', activeType) ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon="calendar-outline"
              activeIcon="calendar"
              label="Agenda"
              {...tone}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          href: isTabVisible('chat', activeType) ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon="chatbubble-outline"
              activeIcon="chatbubble"
              label="Chat"
              {...tone}
            />
          ),
        }}
      />
    </Tabs>
  );
}
