import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

interface TextFieldProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export function TextField({ label, error, isPassword = false, ...inputProps }: TextFieldProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const hasError = Boolean(error);

  return (
    <View className="w-full gap-2">
      <Text className="font-body-medium text-body text-neutral-900">{label}</Text>
      <View
        className={`min-h-[52px] flex-row items-center rounded-sm border bg-white px-4 ${
          hasError ? 'border-error-500' : 'border-neutral-200'
        }`}
      >
        <TextInput
          className="font-body text-body-lg flex-1 text-neutral-900"
          placeholderTextColor="#8B8880"
          secureTextEntry={isPassword && !isRevealed}
          accessibilityLabel={label}
          {...inputProps}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isRevealed ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={12}
            onPress={() => setIsRevealed((prev) => !prev)}
          >
            <Ionicons
              name={isRevealed ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#8B8880"
            />
          </Pressable>
        ) : null}
      </View>
      {hasError ? (
        <View className="flex-row items-center gap-1">
          <Ionicons name="alert-circle-outline" size={16} color="#C1432E" />
          <Text className="font-body-medium text-caption text-error-500">{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
