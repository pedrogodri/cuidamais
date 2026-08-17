import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { getGreeting } from '../getGreeting';

interface HomeHeaderProps {
  name: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function HomeHeader({ name }: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-petrol-100">
          <Text className="font-display-medium text-body-lg text-petrol-700">
            {getInitials(name)}
          </Text>
        </View>
        <View>
          <Text className="font-body text-caption text-neutral-500">{getGreeting()}</Text>
          <Text className="font-display-medium text-h3 text-neutral-900">{name}</Text>
        </View>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Notificações" hitSlop={12}>
        <Ionicons name="notifications-outline" size={24} color="#26302E" />
      </Pressable>
    </View>
  );
}
