import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface SelectableRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectableRow({ icon, label, description, selected, onPress }: SelectableRowProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`min-h-[64px] flex-row items-center gap-4 rounded-md border-2 bg-white px-4 py-4 ${
        selected ? 'border-petrol-500' : 'border-neutral-200'
      }`}
    >
      <View
        className={`h-11 w-11 items-center justify-center rounded-full ${
          selected ? 'bg-petrol-500' : 'bg-neutral-100'
        }`}
      >
        <Ionicons name={icon} size={20} color={selected ? '#FFFFFF' : '#5C6B67'} />
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-body-medium text-body-lg text-neutral-900">{label}</Text>
        {description ? (
          <Text className="font-body text-caption text-neutral-500">{description}</Text>
        ) : null}
      </View>
      <View
        className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
          selected ? 'border-petrol-500' : 'border-neutral-300'
        }`}
      >
        {selected ? <View className="h-3 w-3 rounded-full bg-petrol-500" /> : null}
      </View>
    </Pressable>
  );
}
