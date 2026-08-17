import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { colors, elevation } from './theme';
import type { ProfileTheme } from '@/features/auth/theme/profileTheme';

const ICON_HEX: Record<ProfileTheme['type'], string> = {
  caregiver: colors.white,
  cared_person: colors.neutral900,
  family: colors.white,
};

const CHECK_HEX: Record<ProfileTheme['type'], string> = {
  caregiver: colors.petrol500,
  cared_person: colors.amber700,
  family: colors.vinculo500,
};

interface ProfileOptionCardProps {
  theme: ProfileTheme;
  selected: boolean;
  dimmed: boolean;
  onPress: () => void;
}

export function ProfileOptionCard({ theme, selected, dimmed, onPress }: ProfileOptionCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${theme.label}: ${theme.description}`}
      onPress={onPress}
      style={selected ? elevation.e2 : undefined}
      className={`min-h-[88px] flex-row items-center gap-4 rounded-md border-2 px-5 py-4 ${theme.bgClass100} ${
        selected ? theme.borderClass500 : 'border-transparent'
      } ${dimmed ? 'opacity-60' : ''}`}
    >
      <View className={`h-12 w-12 items-center justify-center rounded-full ${theme.bgClass500}`}>
        <Ionicons name={theme.icon} size={24} color={ICON_HEX[theme.type]} />
      </View>
      <View className="flex-1 gap-1">
        <Text className={`font-display-medium text-h3 ${theme.textClass700}`}>{theme.label}</Text>
        <Text className="font-body text-body text-neutral-700">{theme.description}</Text>
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={24} color={CHECK_HEX[theme.type]} />
      ) : null}
    </Pressable>
  );
}
