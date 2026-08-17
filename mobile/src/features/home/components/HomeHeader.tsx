import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { BodyLarge, Caption, H3 } from '@/shared/ui/Typography';
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
          <BodyLarge className="font-display-medium text-petrol-700">{getInitials(name)}</BodyLarge>
        </View>
        <View>
          <Caption>{getGreeting()}</Caption>
          <H3>{name}</H3>
        </View>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Notificações" hitSlop={12}>
        <Ionicons name="notifications-outline" size={24} color="#26302E" />
      </Pressable>
    </View>
  );
}
