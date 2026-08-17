import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { MedicationsCard } from '@/features/home/components/MedicationsCard';
import { OngoingCareCard } from '@/features/home/components/OngoingCareCard';
import { ProfileModeSwitcher } from '@/features/home/components/ProfileModeSwitcher';
import { TodaysTasksCard } from '@/features/home/components/TodaysTasksCard';
import { UpcomingAppointmentCard } from '@/features/home/components/UpcomingAppointmentCard';
import { VitalSignsCard } from '@/features/home/components/VitalSignsCard';
import {
  MOCK_APPOINTMENT,
  MOCK_CARED_PERSON_NAME,
  MOCK_MEDICATIONS,
  MOCK_ONGOING_CARE,
  MOCK_TODAYS_TASKS,
  MOCK_VITAL_SIGNS,
} from '@/features/home/mockData';

export default function Home() {
  const insets = useSafeAreaInsets();
  const activeProfile = useActiveProfileStore((state) => state.activeProfile);
  const isFamilyMode = activeProfile?.type === 'family' || activeProfile?.type === 'cared_person';

  return (
    <ScrollView
      className="flex-1 bg-neutral-0"
      contentContainerClassName="gap-6 px-4"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <HomeHeader name="Maria Silva" />
      <ProfileModeSwitcher />

      {activeProfile?.type === 'caregiver' ? (
        <View className="gap-4">
          <OngoingCareCard
            clientName={MOCK_ONGOING_CARE.clientName}
            clockInTime={MOCK_ONGOING_CARE.clockInTime}
          />
          <TodaysTasksCard tasks={MOCK_TODAYS_TASKS} />
        </View>
      ) : null}

      {isFamilyMode ? (
        <View className="gap-4">
          {activeProfile?.type === 'family' ? (
            <Text className="font-body-medium text-caption text-neutral-500">
              Cuidando de: {MOCK_CARED_PERSON_NAME}
            </Text>
          ) : null}
          <MedicationsCard medications={MOCK_MEDICATIONS} />
          <VitalSignsCard {...MOCK_VITAL_SIGNS} />
          <UpcomingAppointmentCard {...MOCK_APPOINTMENT} />
        </View>
      ) : null}

      {!activeProfile ? (
        <View className="items-center gap-3 rounded-md border border-dashed border-neutral-300 bg-white p-6">
          <Ionicons name="hand-left-outline" size={28} color="#8B8880" />
          <Text className="text-center font-body text-body text-neutral-700">
            Escolha um modo acima para ver sua Home.
          </Text>
        </View>
      ) : null}

      {activeProfile?.type !== 'caregiver' ? (
        <View className="gap-3 border-t border-neutral-100 pt-6">
          <Text className="font-body text-body text-neutral-500">
            Quer prestar cuidado profissional? Ative um perfil de Cuidador na mesma conta.
          </Text>
          <Button
            label="Quero ser cuidador"
            variant="secondary"
            onPress={() => router.push('/(caregiver-onboarding)/intro')}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}
