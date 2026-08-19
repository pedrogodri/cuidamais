import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AboutSection } from '@/features/caregiver-profile/components/AboutSection';
import { ProfileHeaderCard } from '@/features/caregiver-profile/components/ProfileHeaderCard';
import { ReviewsList } from '@/features/caregiver-profile/components/ReviewsList';
import { getCaregiverById } from '@/features/caregiver-search/mockCaregivers';
import { Body, H3 } from '@/shared/ui/Typography';

export default function CaregiverPublicProfile() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const caregiver = getCaregiverById(id);

  return (
    <View className="flex-1 bg-neutral-0" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 border-b border-neutral-100 px-2 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={12}
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
        >
          <Ionicons name="chevron-back" size={22} color="#26302E" />
        </Pressable>
        <H3>Perfil</H3>
      </View>

      {caregiver ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          <ProfileHeaderCard
            name={caregiver.name}
            initials={caregiver.initials}
            verified={caregiver.verified}
            topRated={caregiver.topRated}
            rating={caregiver.rating}
            reviewCount={caregiver.reviewCount}
          />
          <AboutSection
            bio={caregiver.bio}
            specialties={caregiver.specialties}
            experienceYears={caregiver.experienceYears}
            region={caregiver.region}
            availability={caregiver.availability}
            rate={caregiver.rate}
          />
          <ReviewsList reviews={caregiver.reviews} />
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center p-6">
          <Body className="text-center text-neutral-500">Cuidador não encontrado.</Body>
        </View>
      )}
    </View>
  );
}
