import { Text, View } from 'react-native';

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
        <Text className="font-display-medium text-h3 text-neutral-900">Sinais vitais</Text>
        <Text className="font-body text-caption text-neutral-500">{recordedAt}</Text>
      </View>
      <View className="flex-row gap-4">
        <View className="flex-1 gap-1">
          <Text className="font-body text-caption text-neutral-500">Pressão</Text>
          <Text className="font-mono text-body-lg text-neutral-900">{bloodPressure}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="font-body text-caption text-neutral-500">Glicemia</Text>
          <Text className="font-mono text-body-lg text-neutral-900">{glucose}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="font-body text-caption text-neutral-500">Peso</Text>
          <Text className="font-mono text-body-lg text-neutral-900">{weight}</Text>
        </View>
      </View>
    </View>
  );
}
