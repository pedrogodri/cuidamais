import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';
import { useSessionGuard } from '@/features/auth/guards/useSessionGuard';
import { getProfileIconColorHex, getProfileTheme } from '@/features/auth/theme/profileTheme';
import { TabBarIcon } from '@/features/navigation/components/TabBarIcon';
import { isTabVisible, type TabName } from '@/features/navigation/getVisibleTabs';

const DEFAULT_TONE = {
  activeBgClass: getProfileTheme('caregiver').bgClass100,
  activeTextClass: getProfileTheme('caregiver').textClass700,
  activeColorHex: getProfileIconColorHex('caregiver'),
};

const TABS: {
  name: TabName;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  label: string;
}[] = [
  { name: 'home', title: 'Home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
  {
    name: 'perfil',
    title: 'Perfil',
    icon: 'person-outline',
    activeIcon: 'person',
    label: 'Perfil',
  },
  {
    name: 'buscar',
    title: 'Buscar',
    icon: 'search-outline',
    activeIcon: 'search',
    label: 'Buscar',
  },
  {
    name: 'agenda',
    title: 'Agenda',
    icon: 'calendar-outline',
    activeIcon: 'calendar',
    label: 'Agenda',
  },
  {
    name: 'chat',
    title: 'Chat',
    icon: 'chatbubble-outline',
    activeIcon: 'chatbubble',
    label: 'Chat',
  },
];

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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        // Overrides React Navigation's default ~31x28px icon-only box
        // (see docs/features/navigation.md) so tabBarIcon can render an
        // icon+label pill without the label getting clipped.
        tabBarIconStyle: { width: 100, height: 32 },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            href: isTabVisible(tab.name, activeType) ? undefined : null,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                icon={tab.icon}
                activeIcon={tab.activeIcon}
                label={tab.label}
                {...tone}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
