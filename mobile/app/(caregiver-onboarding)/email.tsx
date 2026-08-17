import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { BodyLarge, H1 } from '@/shared/ui/Typography';
import { VerificationStepHeader } from '@/features/caregiver-onboarding/components/VerificationStepHeader';
import { useCaregiverVerificationStore } from '@/features/caregiver-onboarding/store/useCaregiverVerificationStore';

export default function Email() {
  const insets = useSafeAreaInsets();
  const storedEmail = useCaregiverVerificationStore((state) => state.email);
  const setEmail = useCaregiverVerificationStore((state) => state.setEmail);
  const [email, setLocalEmail] = useState(storedEmail);
  const [error, setError] = useState<string | undefined>();

  function handleContinue() {
    if (!email.includes('@') || !email.includes('.')) {
      setError('Informe um e-mail válido.');
      return;
    }
    setError(undefined);
    setEmail(email);
    router.push('/(caregiver-onboarding)/email-verify');
  }

  return (
    <View
      className="flex-1 bg-neutral-0 px-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <VerificationStepHeader step={3} totalSteps={5} onBack={() => router.back()} />

      <View className="gap-3 pt-8">
        <H1>Confirme seu e-mail</H1>
        <BodyLarge className="text-neutral-700">
          Vamos usar esse e-mail para avisos importantes sobre sua verificação.
        </BodyLarge>
      </View>

      <View className="pt-8">
        <TextField
          label="E-mail"
          placeholder="maria@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setLocalEmail}
          error={error}
        />
      </View>

      <View className="flex-1" />

      <Button label="Enviar código" onPress={handleContinue} />
    </View>
  );
}
