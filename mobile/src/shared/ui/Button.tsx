import { Pressable, Text } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonTone = 'petrol' | 'amber' | 'vinculo';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  tone?: ButtonTone;
}

const PRIMARY_FILL: Record<ButtonTone, string> = {
  petrol: 'bg-petrol-500 active:bg-petrol-700',
  // amber-500 never carries white text (design-system.md 2.4) — dark text below handles this.
  amber: 'bg-amber-500 active:bg-amber-700',
  // vinculo-700, not -500, is the text-safe fill for white text (design-system.md 2.4).
  vinculo: 'bg-vinculo-700 active:bg-vinculo-500',
};

const PRIMARY_TEXT: Record<ButtonTone, string> = {
  petrol: 'text-white',
  amber: 'text-neutral-900',
  vinculo: 'text-white',
};

const SECONDARY_BORDER: Record<ButtonTone, string> = {
  petrol: 'border-petrol-500 active:bg-petrol-100',
  amber: 'border-amber-700 active:bg-amber-100',
  vinculo: 'border-vinculo-500 active:bg-vinculo-100',
};

const SECONDARY_TEXT: Record<ButtonTone, string> = {
  petrol: 'text-petrol-500',
  amber: 'text-amber-700',
  vinculo: 'text-vinculo-500',
};

export function Button({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  tone = 'petrol',
}: ButtonProps) {
  const shape = 'min-h-[52px] w-full items-center justify-center rounded-sm px-6';

  if (variant === 'secondary') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        onPress={onPress}
        disabled={disabled}
        className={`${shape} border-[1.5px] bg-transparent ${
          disabled ? 'border-neutral-200' : SECONDARY_BORDER[tone]
        }`}
      >
        <Text
          className={`font-body-medium text-body-lg ${disabled ? 'text-neutral-500' : SECONDARY_TEXT[tone]}`}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      className={`${shape} ${disabled ? 'bg-neutral-200' : PRIMARY_FILL[tone]}`}
    >
      <Text
        className={`font-body-medium text-body-lg ${disabled ? 'text-neutral-500' : PRIMARY_TEXT[tone]}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
