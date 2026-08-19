import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import type { CaregiverSummary } from '@/features/caregiver-search/mockCaregivers';
import { Body, Caption, H3 } from '@/shared/ui/Typography';

interface CaregiverListItemProps {
  caregiver: CaregiverSummary;
  onPress: () => void;
}

export function CaregiverListItem({ caregiver, onPress }: CaregiverListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row gap-3 rounded-md border border-neutral-200 bg-white p-4 active:bg-neutral-50"
    >
      <View className="h-14 w-14 items-center justify-center rounded-full bg-petrol-100">
        <Body className="font-display-medium text-petrol-700">{caregiver.initials}</Body>
      </View>
      <View className="flex-1 gap-1">
        <H3>{caregiver.name}</H3>
        <View className="flex-row items-center gap-1">
          <Ionicons name="star" size={14} color="#A9721F" />
          <Caption className="font-body-medium text-neutral-900">{caregiver.rating}</Caption>
          <Caption>({caregiver.reviewCount} avaliações)</Caption>
        </View>
        <Caption className="text-neutral-700">{caregiver.specialties.join(', ')}</Caption>
        <View className="flex-row items-center justify-between pt-1">
          <Caption className="text-neutral-500">{caregiver.region}</Caption>
          <Caption className="font-body-medium text-petrol-700">
            {caregiver.rate.amount}
            {caregiver.rate.unit}
          </Caption>
        </View>
      </View>
    </Pressable>
  );
}
