import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { ProfileOptionCard } from '@/shared/ui/ProfileOptionCard';
import { H1 } from '@/shared/ui/Typography';
import type { ProfileType } from '@/features/auth/store/useActiveProfileStore';
import {
  getProfileButtonTone,
  getProfileTheme,
  PROFILE_ORDER,
} from '@/features/auth/theme/profileTheme';

export default function ProfileChoice() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<ProfileType | null>(null);

  function handleContinue() {
    if (!selected) return;
    router.push({ pathname: '/(auth)/confirmation', params: { profile: selected } });
  }

  return (
    <View
      className="flex-1 bg-neutral-0 px-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
    >
      <H1 className="text-center">Como você vai usar o app?</H1>

      <View accessibilityRole="radiogroup" className="gap-3 pt-8">
        {PROFILE_ORDER.map((type) => (
          <ProfileOptionCard
            key={type}
            theme={getProfileTheme(type)}
            selected={selected === type}
            dimmed={selected !== null && selected !== type}
            onPress={() => setSelected(type)}
          />
        ))}
      </View>

      <View className="pt-8">
        <Button
          label="Continuar"
          disabled={!selected}
          tone={selected ? getProfileButtonTone(selected) : 'petrol'}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}
