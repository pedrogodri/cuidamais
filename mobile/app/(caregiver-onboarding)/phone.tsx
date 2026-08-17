import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { BodyLarge, H1 } from '@/shared/ui/Typography';
import { VerificationStepHeader } from '@/features/caregiver-onboarding/components/VerificationStepHeader';
import { useCaregiverVerificationStore } from '@/features/caregiver-onboarding/store/useCaregiverVerificationStore';

export default function Phone() {
  const insets = useSafeAreaInsets();
  const storedPhone = useCaregiverVerificationStore((state) => state.phone);
  const setPhone = useCaregiverVerificationStore((state) => state.setPhone);
  const [phone, setLocalPhone] = useState(storedPhone);
  const [error, setError] = useState<string | undefined>();

  function handleContinue() {
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Informe um telefone válido com DDD.');
      return;
    }
    setError(undefined);
    setPhone(phone);
    router.push('/(caregiver-onboarding)/phone-verify');
  }

  return (
    <View
      className="flex-1 bg-neutral-0 px-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <VerificationStepHeader step={2} totalSteps={5} onBack={() => router.back()} />

      <View className="gap-3 pt-8">
        <H1>Qual é o seu telefone?</H1>
        <BodyLarge className="text-neutral-700">
          Vamos enviar um código por SMS para confirmar que é você.
        </BodyLarge>
      </View>

      <View className="pt-8">
        <TextField
          label="Telefone"
          placeholder="(11) 99999-9999"
          keyboardType="phone-pad"
          autoComplete="tel"
          value={phone}
          onChangeText={setLocalPhone}
          error={error}
        />
      </View>

      <View className="flex-1" />

      <Button label="Enviar código" onPress={handleContinue} />
    </View>
  );
}
