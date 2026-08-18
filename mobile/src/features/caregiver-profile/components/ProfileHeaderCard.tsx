import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { VerificationStatusBadge } from '@/features/caregiver-onboarding/components/VerificationStatusBadge';
import { BodyLarge, Caption, H2 } from '@/shared/ui/Typography';

interface ProfileHeaderCardProps {
  name: string;
  initials: string;
  verified: boolean;
  topRated: boolean;
  rating: number;
  reviewCount: number;
}

export function ProfileHeaderCard({
  name,
  initials,
  verified,
  topRated,
  rating,
  reviewCount,
}: ProfileHeaderCardProps) {
  return (
    <View className="items-center gap-3 rounded-md border border-neutral-200 bg-white p-6">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-petrol-100">
        <BodyLarge className="font-display-medium text-h2 text-petrol-700">{initials}</BodyLarge>
      </View>

      <H2 className="text-center">{name}</H2>

      <View className="flex-row items-center gap-1">
        <Ionicons name="star" size={16} color="#A9721F" />
        <Caption className="font-body-medium text-neutral-900">{rating}</Caption>
        <Caption>({reviewCount} avaliações)</Caption>
      </View>

      {verified || topRated ? (
        <View className="flex-row flex-wrap justify-center gap-2">
          {verified ? (
            <VerificationStatusBadge icon="shield-checkmark" label="Verificado" tone="success" />
          ) : null}
          {topRated ? (
            <VerificationStatusBadge icon="ribbon" label="Mais bem avaliado" tone="amber" />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
