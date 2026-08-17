import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface VerificationStepHeaderProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
}

export function VerificationStepHeader({ step, totalSteps, onBack }: VerificationStepHeaderProps) {
  const progress = Math.min(1, Math.max(0, step / totalSteps));

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={12}
          onPress={onBack}
        >
          <Ionicons name="chevron-back" size={24} color="#26302E" />
        </Pressable>
        <Text className="font-body-medium text-caption text-neutral-500">
          Etapa {step} de {totalSteps}
        </Text>
      </View>
      <View className="h-1.5 overflow-hidden rounded-pill bg-neutral-100">
        <View
          className="h-1.5 rounded-pill bg-petrol-500"
          style={{ width: `${progress * 100}%` }}
        />
      </View>
    </View>
  );
}
