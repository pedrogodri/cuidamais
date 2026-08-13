import { Tabs } from 'expo-router';
import { useProfileGuard } from '@/features/auth/guards/useProfileGuard';

export default function FamilyLayout() {
  useProfileGuard('family');

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Buscar' }} />
    </Tabs>
  );
}
