import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Body, Caption, H3 } from '@/shared/ui/Typography';

interface AboutSectionProps {
  bio: string;
  specialties: string[];
  experienceYears: number;
  region: string;
  availability: string;
  rate: { amount: string; unit: string };
}

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

function InfoRow({ icon, text }: InfoRowProps) {
  return (
    <View className="flex-row items-center gap-2">
      <Ionicons name={icon} size={16} color="#5C6B67" />
      <Caption className="text-neutral-700">{text}</Caption>
    </View>
  );
}

export function AboutSection({
  bio,
  specialties,
  experienceYears,
  region,
  availability,
  rate,
}: AboutSectionProps) {
  return (
    <View className="gap-4 rounded-md border border-neutral-200 bg-white p-4">
      <View className="gap-2">
        <H3>Sobre</H3>
        <Body>{bio}</Body>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {specialties.map((specialty) => (
          <View key={specialty} className="rounded-pill bg-petrol-100 px-3 py-1.5">
            <Caption className="font-body-medium text-petrol-700">{specialty}</Caption>
          </View>
        ))}
      </View>

      <View className="gap-2 border-t border-neutral-100 pt-3">
        <InfoRow icon="briefcase-outline" text={`${experienceYears} anos de experiência`} />
        <InfoRow icon="location-outline" text={region} />
        <InfoRow icon="time-outline" text={availability} />
        <InfoRow icon="cash-outline" text={`${rate.amount}${rate.unit}`} />
      </View>
    </View>
  );
}
