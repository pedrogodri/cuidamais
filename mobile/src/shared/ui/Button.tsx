import { Pressable, Text } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function Button({ label, onPress, disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`items-center justify-center rounded-lg bg-blue-600 px-4 py-3 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <Text className="text-base font-semibold text-white">{label}</Text>
    </Pressable>
  );
}
