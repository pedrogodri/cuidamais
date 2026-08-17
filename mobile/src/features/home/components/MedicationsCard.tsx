import { View } from 'react-native';
import { Body, Caption, H3 } from '@/shared/ui/Typography';
import type { MockMedication } from '../mockData';

const STATUS_LABEL: Record<MockMedication['status'], string> = {
  taken: 'Tomado',
  pending: 'Pendente',
  late: 'Atrasado',
};

const STATUS_CLASSES: Record<MockMedication['status'], { bg: string; text: string }> = {
  taken: { bg: 'bg-success-100', text: 'text-success-700' },
  pending: { bg: 'bg-neutral-100', text: 'text-neutral-700' },
  late: { bg: 'bg-error-100', text: 'text-error-500' },
};

interface MedicationsCardProps {
  medications: MockMedication[];
}

export function MedicationsCard({ medications }: MedicationsCardProps) {
  return (
    <View className="gap-3 rounded-md border border-neutral-200 bg-white p-4">
      <H3>Remédios de hoje</H3>
      <View className="gap-3">
        {medications.map((med) => {
          const statusClasses = STATUS_CLASSES[med.status];
          return (
            <View key={med.id} className="flex-row items-center gap-3">
              <Caption className="font-mono">{med.time}</Caption>
              <Body className="font-body-medium flex-1 text-neutral-900">{med.name}</Body>
              <View className={`rounded-pill px-3 py-1 ${statusClasses.bg}`}>
                <Caption className={`font-body-medium ${statusClasses.text}`}>
                  {STATUS_LABEL[med.status]}
                </Caption>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
