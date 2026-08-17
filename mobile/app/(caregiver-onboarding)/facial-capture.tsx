import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { BodyLarge, H1 } from '@/shared/ui/Typography';
import { VerificationStatusBadge } from '@/features/caregiver-onboarding/components/VerificationStatusBadge';
import { VerificationStepHeader } from '@/features/caregiver-onboarding/components/VerificationStepHeader';
import {
  useCaregiverVerificationStore,
  type FaceStatus,
} from '@/features/caregiver-onboarding/store/useCaregiverVerificationStore';

const STATUS_META: Record<
  FaceStatus,
  {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    tone: 'neutral' | 'info' | 'success' | 'amber' | 'error';
  }
> = {
  pending: { icon: 'camera-outline', label: 'Pronto para capturar', tone: 'neutral' },
  capturing: { icon: 'camera-outline', label: 'Capturando…', tone: 'info' },
  analyzing: { icon: 'time-outline', label: 'Analisando sua foto…', tone: 'amber' },
  success: { icon: 'checkmark-circle-outline', label: 'Identidade confirmada', tone: 'success' },
  failed: {
    icon: 'alert-circle-outline',
    label: 'Não conseguimos confirmar seu rosto',
    tone: 'error',
  },
};

export default function FacialCapture() {
  const insets = useSafeAreaInsets();
  const faceStatus = useCaregiverVerificationStore((state) => state.faceStatus);
  const setFaceStatus = useCaregiverVerificationStore((state) => state.setFaceStatus);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach(clearTimeout);
    };
  }, []);

  function simulateCapture() {
    setFaceStatus('capturing');
    timers.current.push(setTimeout(() => setFaceStatus('analyzing'), 900));
  }

  function handlePrimaryAction() {
    if (faceStatus === 'pending' || faceStatus === 'failed') {
      simulateCapture();
      return;
    }
    if (faceStatus === 'analyzing') {
      setFaceStatus('success');
      return;
    }
    if (faceStatus === 'success') {
      router.push('/(caregiver-onboarding)/review');
    }
  }

  const meta = STATUS_META[faceStatus];
  const isBusy = faceStatus === 'capturing';

  return (
    <View
      className="flex-1 bg-neutral-0 px-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <VerificationStepHeader step={4} totalSteps={5} onBack={() => router.back()} />

      <View className="gap-3 pt-8">
        <H1>Posicione seu rosto</H1>
        <BodyLarge className="text-neutral-700">
          Centralize o rosto no círculo e toque para capturar.
        </BodyLarge>
      </View>

      <View className="flex-1 items-center justify-center gap-6">
        <View
          className={`h-56 w-56 items-center justify-center rounded-full border-2 border-dashed ${
            faceStatus === 'success'
              ? 'border-success-500 bg-success-100'
              : faceStatus === 'failed'
                ? 'border-error-500 bg-error-100'
                : 'border-neutral-300 bg-white'
          }`}
        >
          <Ionicons
            name={faceStatus === 'success' ? 'checkmark-circle' : 'person-outline'}
            size={64}
            color={
              faceStatus === 'success' ? '#2F6B45' : faceStatus === 'failed' ? '#C1432E' : '#C7C1B7'
            }
          />
        </View>

        <VerificationStatusBadge icon={meta.icon} label={meta.label} tone={meta.tone} />
      </View>

      <View className="gap-4">
        <Button
          label={
            faceStatus === 'success'
              ? 'Continuar'
              : faceStatus === 'failed'
                ? 'Tentar novamente'
                : faceStatus === 'analyzing'
                  ? 'Simular aprovação'
                  : isBusy
                    ? 'Capturando…'
                    : 'Tirar foto'
          }
          disabled={isBusy}
          onPress={handlePrimaryAction}
        />
        {faceStatus === 'analyzing' ? (
          <Pressable
            accessibilityRole="button"
            className="items-center"
            onPress={() => setFaceStatus('failed')}
          >
            <Text className="font-body text-caption text-neutral-500 underline">
              Simular falha (teste)
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
