import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Caption } from '@/shared/ui/Typography';

interface TabBarIconProps {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  label: string;
  activeBgClass: string;
  activeTextClass: string;
  activeColorHex: string;
}

const INACTIVE_COLOR = '#8B8880';

export function TabBarIcon({
  focused,
  icon,
  activeIcon,
  label,
  activeBgClass,
  activeTextClass,
  activeColorHex,
}: TabBarIconProps) {
  return (
    <View
      className={`flex-row items-center gap-1.5 rounded-pill px-3 py-1.5 ${focused ? activeBgClass : ''}`}
    >
      <Ionicons
        name={focused ? activeIcon : icon}
        size={18}
        color={focused ? activeColorHex : INACTIVE_COLOR}
      />
      <Caption className={`font-body-medium ${focused ? activeTextClass : 'text-neutral-500'}`}>
        {label}
      </Caption>
    </View>
  );
}
