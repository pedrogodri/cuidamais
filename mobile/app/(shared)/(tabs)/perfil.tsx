import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AboutSection } from '@/features/caregiver-profile/components/AboutSection';
import { ProfileHeaderCard } from '@/features/caregiver-profile/components/ProfileHeaderCard';
import { ReviewsList } from '@/features/caregiver-profile/components/ReviewsList';
import {
  MOCK_CAREGIVER_PROFILE,
  MOCK_REVIEWS,
} from '@/features/caregiver-profile/mockCaregiverProfile';
import { H3 } from '@/shared/ui/Typography';

export default function Perfil() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-neutral-0" style={{ paddingTop: insets.top }}>
      <View className="border-b border-neutral-100 px-4 py-3">
        <H3>Perfil</H3>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <ProfileHeaderCard
          name={MOCK_CAREGIVER_PROFILE.name}
          initials={MOCK_CAREGIVER_PROFILE.initials}
          verified={MOCK_CAREGIVER_PROFILE.verified}
          topRated={MOCK_CAREGIVER_PROFILE.topRated}
          rating={MOCK_CAREGIVER_PROFILE.rating}
          reviewCount={MOCK_CAREGIVER_PROFILE.reviewCount}
        />
        <AboutSection
          bio={MOCK_CAREGIVER_PROFILE.bio}
          specialties={MOCK_CAREGIVER_PROFILE.specialties}
          experienceYears={MOCK_CAREGIVER_PROFILE.experienceYears}
          region={MOCK_CAREGIVER_PROFILE.region}
          availability={MOCK_CAREGIVER_PROFILE.availability}
          rate={MOCK_CAREGIVER_PROFILE.rate}
        />
        <ReviewsList reviews={MOCK_REVIEWS} />
      </ScrollView>
    </View>
  );
}
