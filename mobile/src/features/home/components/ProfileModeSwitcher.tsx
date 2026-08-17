import { Pressable, Text, View } from 'react-native';
import {
  useActiveProfileStore,
  type ProfileType,
} from '@/features/auth/store/useActiveProfileStore';
import { getProfileTheme, PROFILE_ORDER } from '@/features/auth/theme/profileTheme';

export function ProfileModeSwitcher() {
  const activeType = useActiveProfileStore((state) => state.activeProfile?.type);
  const setActiveProfile = useActiveProfileStore((state) => state.setActiveProfile);

  function handleSelect(type: ProfileType) {
    setActiveProfile({ type, id: 'preview' });
  }

  return (
    <View accessibilityRole="radiogroup" className="flex-row gap-2">
      {PROFILE_ORDER.map((type) => {
        const theme = getProfileTheme(type);
        const selected = activeType === type;
        return (
          <Pressable
            key={type}
            accessibilityRole="radio"
            accessibilityLabel={theme.label}
            accessibilityState={{ selected }}
            onPress={() => handleSelect(type)}
            className={`flex-1 items-center rounded-pill border-2 px-3 py-2 ${
              selected
                ? `${theme.borderClass500} ${theme.bgClass100}`
                : 'border-transparent bg-neutral-100'
            }`}
          >
            <Text
              className={`font-body-medium text-caption ${
                selected ? theme.textClass700 : 'text-neutral-500'
              }`}
            >
              {theme.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
