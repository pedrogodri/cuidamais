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
  type CaptureStatus,
} from '@/features/caregiver-onboarding/store/useCaregiverVerificationStore';

const DOCUMENT_LABEL: Record<string, string> = {
  rg: 'RG',
  cnh: 'CNH',
  other: 'documento',
};

const STATUS_META: Record<
  CaptureStatus,
  {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    tone: 'neutral' | 'info' | 'success' | 'amber' | 'error';
  }
> = {
  pending: { icon: 'cloud-upload-outline', label: 'Aguardando envio', tone: 'neutral' },
  capturing: { icon: 'camera-outline', label: 'Capturando documento…', tone: 'info' },
  uploaded: { icon: 'checkmark-circle-outline', label: 'Documento enviado', tone: 'success' },
  analyzing: { icon: 'time-outline', label: 'Em análise', tone: 'amber' },
  invalid: {
    icon: 'alert-circle-outline',
    label: 'Não foi possível ler o documento',
    tone: 'error',
  },
};

const NEEDS_BACK: Record<string, boolean> = { rg: true, cnh: true, other: false };

export default function DocumentCapture() {
  const insets = useSafeAreaInsets();
  const documentType = useCaregiverVerificationStore((state) => state.documentType);
  const documentStatus = useCaregiverVerificationStore((state) => state.documentStatus);
  const setDocumentStatus = useCaregiverVerificationStore((state) => state.setDocumentStatus);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach(clearTimeout);
    };
  }, []);

  function simulateCapture() {
    setDocumentStatus('capturing');
    timers.current.push(setTimeout(() => setDocumentStatus('analyzing'), 900));
  }

  function handlePrimaryAction() {
    if (documentStatus === 'pending' || documentStatus === 'invalid') {
      simulateCapture();
      return;
    }
    if (documentStatus === 'analyzing') {
      setDocumentStatus('uploaded');
      return;
    }
    if (documentStatus === 'uploaded') {
      router.push('/(caregiver-onboarding)/phone');
    }
  }

  const meta = STATUS_META[documentStatus];
  const isBusy = documentStatus === 'capturing';
  const needsBack = documentType ? NEEDS_BACK[documentType] : false;
  const label = documentType ? DOCUMENT_LABEL[documentType] : 'documento';

  return (
    <View
      className="flex-1 bg-neutral-0 px-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <VerificationStepHeader step={1} totalSteps={5} onBack={() => router.back()} />

      <View className="gap-3 pt-8">
        <H1>Envie seu {label}</H1>
        <BodyLarge className="text-neutral-700">
          {needsBack
            ? 'Vamos precisar da frente e do verso, bem legíveis e sem reflexo.'
            : 'Tire uma foto legível, sem reflexo e com todas as informações visíveis.'}
        </BodyLarge>
      </View>

      <View className="flex-1 items-center justify-center gap-6 py-8">
        <View className="w-full flex-row gap-4">
          <View
            className={`h-40 flex-1 items-center justify-center rounded-md border-2 border-dashed ${
              documentStatus === 'uploaded'
                ? 'border-success-500 bg-success-100'
                : 'border-neutral-300 bg-white'
            }`}
          >
            <Ionicons
              name={documentStatus === 'uploaded' ? 'checkmark-circle' : 'scan-outline'}
              size={32}
              color={documentStatus === 'uploaded' ? '#2F6B45' : '#C7C1B7'}
            />
            <Text className="pt-2 font-body-medium text-caption text-neutral-500">Frente</Text>
          </View>
          {needsBack ? (
            <View
              className={`h-40 flex-1 items-center justify-center rounded-md border-2 border-dashed ${
                documentStatus === 'uploaded'
                  ? 'border-success-500 bg-success-100'
                  : 'border-neutral-300 bg-white'
              }`}
            >
              <Ionicons
                name={documentStatus === 'uploaded' ? 'checkmark-circle' : 'scan-outline'}
                size={32}
                color={documentStatus === 'uploaded' ? '#2F6B45' : '#C7C1B7'}
              />
              <Text className="pt-2 font-body-medium text-caption text-neutral-500">Verso</Text>
            </View>
          ) : null}
        </View>

        <VerificationStatusBadge icon={meta.icon} label={meta.label} tone={meta.tone} />
      </View>

      <View className="gap-4">
        <Button
          label={
            documentStatus === 'uploaded'
              ? 'Continuar'
              : documentStatus === 'invalid'
                ? 'Tentar novamente'
                : documentStatus === 'analyzing'
                  ? 'Simular aprovação'
                  : isBusy
                    ? 'Capturando…'
                    : 'Capturar documento'
          }
          disabled={isBusy}
          onPress={handlePrimaryAction}
        />
        {documentStatus === 'analyzing' ? (
          <Pressable
            accessibilityRole="button"
            className="items-center"
            onPress={() => setDocumentStatus('invalid')}
          >
            <Text className="font-body text-caption text-neutral-500 underline">
              Simular reprovação (teste)
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
