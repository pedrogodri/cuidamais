import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { BodyLarge, H1 } from '@/shared/ui/Typography';
import {
  useCaregiverVerificationStore,
  type ApplicationStatus,
} from '@/features/caregiver-onboarding/store/useCaregiverVerificationStore';

const STATUS_META: Record<
  ApplicationStatus,
  {
    icon: keyof typeof Ionicons.glyphMap;
    iconBg: string;
    iconColor: string;
    title: string;
    body: string;
  }
> = {
  in_review: {
    icon: 'time-outline',
    iconBg: 'bg-petrol-100',
    iconColor: '#1C5D52',
    title: 'Solicitação enviada',
    body: 'Recebemos suas informações. Nossa equipe analisa em até 2 dias úteis e você recebe uma notificação assim que tiver novidade.',
  },
  approved: {
    icon: 'checkmark-circle-outline',
    iconBg: 'bg-success-100',
    iconColor: '#2F6B45',
    title: 'Verificação aprovada',
    body: 'Seu perfil de Cuidador já está ativo. Você já pode aparecer nas buscas das famílias.',
  },
  needs_correction: {
    icon: 'alert-circle-outline',
    iconBg: 'bg-amber-100',
    iconColor: '#A9721F',
    title: 'Precisamos de um ajuste',
    body: 'Algumas informações precisam ser reenviadas antes de continuar. Revise os itens marcados e envie de novo.',
  },
  rejected: {
    icon: 'close-circle-outline',
    iconBg: 'bg-error-100',
    iconColor: '#C1432E',
    title: 'Não foi possível aprovar',
    body: 'Sua verificação não foi aprovada desta vez. Entre em contato com o suporte para entender os próximos passos.',
  },
};

export default function Conclusion() {
  const insets = useSafeAreaInsets();
  const applicationStatus = useCaregiverVerificationStore((state) => state.applicationStatus);
  const reset = useCaregiverVerificationStore((state) => state.reset);
  const meta = STATUS_META[applicationStatus];

  function handleDone() {
    reset();
    router.replace('/(family)');
  }

  return (
    <View
      className="flex-1 justify-between bg-neutral-0 px-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <View className="flex-1 items-center justify-center gap-6">
        <View className={`h-24 w-24 items-center justify-center rounded-full ${meta.iconBg}`}>
          <Ionicons name={meta.icon} size={48} color={meta.iconColor} />
        </View>
        <View className="items-center gap-3">
          <H1 className="text-center">{meta.title}</H1>
          <BodyLarge className="text-center text-neutral-700">{meta.body}</BodyLarge>
        </View>
      </View>

      <Button label="Voltar para o início" onPress={handleDone} />
    </View>
  );
}
