import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Button } from '@/shared/ui/Button';
import { Caption, H1, H3, Overline } from '@/shared/ui/Typography';
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
        <Overline className="font-body-medium text-caption">Atendimento em andamento</Overline>
        <View className="h-2 w-2 rounded-full bg-success-500" />
      </View>

      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-petrol-100">
          <Ionicons name="person-outline" size={22} color="#1C5D52" />
        </View>
        <View>
          <H3>{clientName}</H3>
          <Caption>Clock-in às {clockInTime}</Caption>
        </View>
      </View>

      <View className="items-center rounded-sm bg-petrol-100 py-4">
        <H1 className="font-mono text-petrol-700">{formatElapsed(elapsedSeconds)}</H1>
        <Caption className="text-neutral-700">Tempo trabalhado</Caption>
      </View>

      <Button label="Finalizar atendimento" tone="petrol" onPress={() => {}} />
    </View>
  );
}
