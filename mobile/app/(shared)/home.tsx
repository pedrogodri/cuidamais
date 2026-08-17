import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { Body, H1 } from '@/shared/ui/Typography';

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 justify-between bg-neutral-0 px-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <View className="gap-2">
        <H1>Bem-vindo ao CuidaMais</H1>
        <Body>Busca, chat e agenda chegam nos próximos ciclos.</Body>
      </View>

      <View className="gap-3">
        <Body className="text-neutral-500">
          Quer prestar cuidado profissional? Ative um perfil de Cuidador na mesma conta.
        </Body>
        <Button
          label="Quero ser cuidador"
          variant="secondary"
          onPress={() => router.push('/(caregiver-onboarding)/intro')}
        />
      </View>
    </View>
  );
}
