import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { BodyLarge, H1 } from '@/shared/ui/Typography';
import { VerificationStepHeader } from '@/features/caregiver-onboarding/components/VerificationStepHeader';

const INSTRUCTIONS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'sunny-outline', label: 'Fique em um local bem iluminado' },
  { icon: 'glasses-outline', label: 'Remova óculos, boné ou qualquer coisa que cubra o rosto' },
  { icon: 'eye-outline', label: 'Olhe diretamente para a câmera' },
  { icon: 'scan-outline', label: 'Mantenha o rosto dentro da área indicada' },
];

export default function FacialIntro() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-neutral-0 px-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <VerificationStepHeader step={4} totalSteps={5} onBack={() => router.back()} />

      <View className="items-center pt-8">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-petrol-100">
          <Ionicons name="person-outline" size={44} color="#1C5D52" />
        </View>
      </View>

      <View className="items-center gap-3 pt-6">
        <H1 className="text-center">Vamos confirmar seu rosto</H1>
        <BodyLarge className="text-center text-neutral-700">
          Uma última etapa para garantir que é você mesmo. Leva só alguns segundos.
        </BodyLarge>
      </View>

      <View className="gap-3 pt-8">
        {INSTRUCTIONS.map((item) => (
          <View key={item.label} className="flex-row items-center gap-4">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-petrol-100">
              <Ionicons name={item.icon} size={18} color="#1C5D52" />
            </View>
            <Text className="font-body text-body flex-1 text-neutral-700">{item.label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-1" />

      <Button
        label="Continuar"
        onPress={() => router.push('/(caregiver-onboarding)/facial-capture')}
      />
    </View>
  );
}
