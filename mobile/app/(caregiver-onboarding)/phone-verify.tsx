import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { BodyLarge, H1 } from '@/shared/ui/Typography';
import { VerificationStepHeader } from '@/features/caregiver-onboarding/components/VerificationStepHeader';
import { useCaregiverVerificationStore } from '@/features/caregiver-onboarding/store/useCaregiverVerificationStore';

const MOCK_CODE = '123456';
const RESEND_SECONDS = 30;

export default function PhoneVerify() {
  const insets = useSafeAreaInsets();
  const phone = useCaregiverVerificationStore((state) => state.phone);
  const setPhoneVerified = useCaregiverVerificationStore((state) => state.setPhoneVerified);

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function handleConfirm() {
    if (code !== MOCK_CODE) {
      setError('Código incorreto. Confira e tente de novo.');
      return;
    }
    setError(undefined);
    setPhoneVerified(true);
    router.push('/(caregiver-onboarding)/email');
  }

  function handleResend() {
    setSecondsLeft(RESEND_SECONDS);
    setError(undefined);
  }

  return (
    <View
      className="flex-1 bg-neutral-0 px-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <VerificationStepHeader step={2} totalSteps={5} onBack={() => router.back()} />

      <View className="gap-3 pt-8">
        <H1>Confirme o código</H1>
        <BodyLarge className="text-neutral-700">
          Enviamos um código de 6 dígitos por SMS para {phone || 'seu telefone'}.
        </BodyLarge>
      </View>

      <View className="pt-8">
        <TextField
          label="Código de verificação"
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          error={error}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={secondsLeft > 0}
        onPress={handleResend}
        className="items-start pt-4"
      >
        <Text
          className={`font-body-medium text-caption ${
            secondsLeft > 0 ? 'text-neutral-300' : 'text-petrol-500 underline'
          }`}
        >
          {secondsLeft > 0 ? `Reenviar código em ${secondsLeft}s` : 'Reenviar código'}
        </Text>
      </Pressable>

      <Text className="pt-2 font-body text-caption text-neutral-500">
        Protótipo: use o código {MOCK_CODE}.
      </Text>

      <View className="flex-1" />

      <Button label="Confirmar" onPress={handleConfirm} />
    </View>
  );
}
