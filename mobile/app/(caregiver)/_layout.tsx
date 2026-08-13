import { Tabs } from 'expo-router';
import { useProfileGuard } from '@/features/auth/guards/useProfileGuard';

export default function CaregiverLayout() {
  useProfileGuard('caregiver');

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
