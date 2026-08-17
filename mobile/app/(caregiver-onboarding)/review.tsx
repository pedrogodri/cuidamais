import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { H1 } from '@/shared/ui/Typography';
import { VerificationStepHeader } from '@/features/caregiver-onboarding/components/VerificationStepHeader';
import { useCaregiverVerificationStore } from '@/features/caregiver-onboarding/store/useCaregiverVerificationStore';

const DOCUMENT_LABEL: Record<string, string> = { rg: 'RG', cnh: 'CNH', other: 'Outro documento' };

interface ReviewRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  confirmed: boolean;
  onEdit: () => void;
}

function ReviewRow({ icon, title, value, confirmed, onEdit }: ReviewRowProps) {
  return (
    <View className="flex-row items-center gap-4 rounded-md border border-neutral-200 bg-white px-4 py-4">
      <View
        className={`h-11 w-11 items-center justify-center rounded-full ${
          confirmed ? 'bg-success-100' : 'bg-neutral-100'
        }`}
      >
        <Ionicons name={icon} size={20} color={confirmed ? '#2F6B45' : '#5C6B67'} />
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-body-medium text-body-lg text-neutral-900">{title}</Text>
        <Text className="font-body text-body text-neutral-700">{value}</Text>
      </View>
      <Pressable accessibilityRole="button" hitSlop={8} onPress={onEdit}>
        <Text className="font-body-medium text-caption text-petrol-500 underline">Editar</Text>
      </Pressable>
    </View>
  );
}

export default function Review() {
  const insets = useSafeAreaInsets();
  const state = useCaregiverVerificationStore();

  function handleFinish() {
    router.push('/(caregiver-onboarding)/conclusion');
  }

  return (
    <View
      className="flex-1 bg-neutral-0 px-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <VerificationStepHeader step={5} totalSteps={5} onBack={() => router.back()} />

      <View className="gap-3 pt-8">
        <H1>Revise suas informações</H1>
      </View>

      <ScrollView contentContainerClassName="gap-3 pt-6" showsVerticalScrollIndicator={false}>
        <ReviewRow
          icon="document-text-outline"
          title="Documento"
          value={
            state.documentType ? `${DOCUMENT_LABEL[state.documentType]} — enviado` : 'Não enviado'
          }
          confirmed={state.documentStatus === 'uploaded'}
          onEdit={() => router.push('/(caregiver-onboarding)/document-type')}
        />
        <ReviewRow
          icon="call-outline"
          title="Telefone"
          value={state.phone || 'Não informado'}
          confirmed={state.phoneVerified}
          onEdit={() => router.push('/(caregiver-onboarding)/phone')}
        />
        <ReviewRow
          icon="mail-outline"
          title="E-mail"
          value={state.email || 'Não informado'}
          confirmed={state.emailVerified}
          onEdit={() => router.push('/(caregiver-onboarding)/email')}
        />
        <ReviewRow
          icon="scan-outline"
          title="Identidade facial"
          value={state.faceStatus === 'success' ? 'Confirmada' : 'Pendente'}
          confirmed={state.faceStatus === 'success'}
          onEdit={() => router.push('/(caregiver-onboarding)/facial-intro')}
        />
      </ScrollView>

      <View className="pt-4">
        <Button label="Finalizar" onPress={handleFinish} />
      </View>
    </View>
  );
}
