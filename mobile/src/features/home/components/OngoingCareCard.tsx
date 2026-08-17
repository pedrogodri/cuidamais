import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Button } from '@/shared/ui/Button';
import { formatElapsed } from '../formatElapsed';

interface OngoingCareCardProps {
  clientName: string;
  clockInTime: string;
}

export function OngoingCareCard({ clientName, clockInTime }: OngoingCareCardProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="gap-4 rounded-md border border-neutral-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-body-medium text-caption uppercase tracking-widest text-neutral-500">
          Atendimento em andamento
        </Text>
        <View className="h-2 w-2 rounded-full bg-success-500" />
      </View>

      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-petrol-100">
          <Ionicons name="person-outline" size={22} color="#1C5D52" />
        </View>
        <View>
          <Text className="font-display-medium text-h3 text-neutral-900">{clientName}</Text>
          <Text className="font-body text-caption text-neutral-500">Clock-in às {clockInTime}</Text>
        </View>
      </View>

      <View className="items-center rounded-sm bg-petrol-100 py-4">
        <Text className="font-mono text-h1 text-petrol-700">{formatElapsed(elapsedSeconds)}</Text>
        <Text className="font-body text-caption text-neutral-700">Tempo trabalhado</Text>
      </View>

      <Button label="Finalizar atendimento" tone="petrol" onPress={() => {}} />
    </View>
  );
}
