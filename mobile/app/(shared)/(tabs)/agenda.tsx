import { Text, View } from 'react-native';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';

export default function Agenda() {
  const activeProfile = useActiveProfileStore((state) => state.activeProfile);
  const isFamilyMode = activeProfile?.type === 'family' || activeProfile?.type === 'cared_person';

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">
        {isFamilyMode ? 'Remédios e agenda (placeholder)' : 'Agenda (placeholder)'}
      </Text>
    </View>
  );
}
