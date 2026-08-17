import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { BodyLarge, H1 } from '@/shared/ui/Typography';
import { SelectableRow } from '@/features/caregiver-onboarding/components/SelectableRow';
import { VerificationStepHeader } from '@/features/caregiver-onboarding/components/VerificationStepHeader';
import {
  useCaregiverVerificationStore,
  type DocumentType,
} from '@/features/caregiver-onboarding/store/useCaregiverVerificationStore';

const OPTIONS: { type: DocumentType; label: string; description: string }[] = [
  { type: 'rg', label: 'RG', description: 'Frente e verso' },
  { type: 'cnh', label: 'CNH', description: 'Frente e verso' },
  { type: 'other', label: 'Outro documento', description: 'Passaporte ou carteira profissional' },
];

export default function DocumentTypeScreen() {
  const insets = useSafeAreaInsets();
  const documentType = useCaregiverVerificationStore((state) => state.documentType);
  const setDocumentType = useCaregiverVerificationStore((state) => state.setDocumentType);

  const [selected, setSelected] = useState<DocumentType | null>(documentType);

  function handleContinue() {
    if (!selected) return;
    setDocumentType(selected);
    router.push('/(caregiver-onboarding)/document-capture');
  }

  return (
    <View
      className="flex-1 bg-neutral-0 px-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <VerificationStepHeader step={1} totalSteps={5} onBack={() => router.back()} />

      <View className="gap-3 pt-8">
        <H1>Qual documento você vai enviar?</H1>
        <BodyLarge className="text-neutral-700">
          Escolha um documento de identificação oficial com foto.
        </BodyLarge>
      </View>

      <View accessibilityRole="radiogroup" className="gap-3 pt-8">
        {OPTIONS.map((option) => (
          <SelectableRow
            key={option.type}
            icon="card-outline"
            label={option.label}
            description={option.description}
            selected={selected === option.type}
            onPress={() => setSelected(option.type)}
          />
        ))}
      </View>

      <View className="flex-1" />

      <Button label="Continuar" disabled={!selected} onPress={handleContinue} />
    </View>
  );
}
