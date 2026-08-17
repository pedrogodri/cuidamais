import { View } from 'react-native';
import { BodyLarge, Caption, H3 } from '@/shared/ui/Typography';

interface VitalSignsCardProps {
  bloodPressure: string;
  glucose: string;
  weight: string;
  recordedAt: string;
}

export function VitalSignsCard({
  bloodPressure,
  glucose,
  weight,
  recordedAt,
}: VitalSignsCardProps) {
  return (
    <View className="gap-3 rounded-md border border-neutral-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <H3>Sinais vitais</H3>
        <Caption>{recordedAt}</Caption>
      </View>
      <View className="flex-row gap-4">
        <View className="flex-1 gap-1">
          <Caption>Pressão</Caption>
          <BodyLarge className="font-mono">{bloodPressure}</BodyLarge>
        </View>
        <View className="flex-1 gap-1">
          <Caption>Glicemia</Caption>
          <BodyLarge className="font-mono">{glucose}</BodyLarge>
        </View>
        <View className="flex-1 gap-1">
          <Caption>Peso</Caption>
          <BodyLarge className="font-mono">{weight}</BodyLarge>
        </View>
      </View>
    </View>
  );
}
