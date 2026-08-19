import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { BodyLarge, H1 } from '@/shared/ui/Typography';
import { colors } from '@/shared/ui/theme';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';
import {
  getProfileButtonTone,
  getProfileTheme,
  parseProfileType,
} from '@/features/auth/theme/profileTheme';

const ICON_HEX_ON_FILL: Record<string, string> = {
  caregiver: colors.white,
  cared_person: colors.neutral900,
  family: colors.white,
};

export default function Confirmation() {
  const insets = useSafeAreaInsets();
  const { profile } = useLocalSearchParams<{ profile?: string }>();
  const profileType = parseProfileType(profile);
  const theme = getProfileTheme(profileType);
  const setActiveProfile = useActiveProfileStore((state) => state.setActiveProfile);

  function handleContinue() {
    setActiveProfile({ type: profileType, id: 'draft' });
    router.replace('/(shared)/(tabs)/home');
  }

  return (
    <View className="flex-1 justify-between bg-neutral-0 px-4">
      <View className="flex-1 items-center justify-center gap-6">
        <View className={`h-24 w-24 items-center justify-center rounded-full ${theme.bgClass500}`}>
          <Ionicons name="checkmark" size={48} color={ICON_HEX_ON_FILL[profileType]} />
        </View>
        <View className="items-center gap-3">
          <H1>Conta criada</H1>
          <BodyLarge className="text-center text-neutral-700">
            Sua conta foi criada. Vamos te ajudar a completar seu perfil.
          </BodyLarge>
        </View>
      </View>

      <View style={{ paddingBottom: insets.bottom + 16 }}>
        <Button
          label="Continuar"
          tone={getProfileButtonTone(profileType)}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}
