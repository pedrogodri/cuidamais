import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export type StatusBadgeTone = 'neutral' | 'info' | 'success' | 'amber' | 'error';

interface VerificationStatusBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tone: StatusBadgeTone;
}

const TONE: Record<StatusBadgeTone, { bg: string; text: string; icon: string }> = {
  neutral: { bg: 'bg-neutral-100', text: 'text-neutral-700', icon: '#5C6B67' },
  info: { bg: 'bg-info-100', text: 'text-info-500', icon: '#4472A8' },
  success: { bg: 'bg-success-100', text: 'text-success-700', icon: '#2F6B45' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '#A9721F' },
  error: { bg: 'bg-error-100', text: 'text-error-500', icon: '#C1432E' },
};

export function VerificationStatusBadge({ icon, label, tone }: VerificationStatusBadgeProps) {
  const c = TONE[tone];
  return (
    <View className={`flex-row items-center gap-2 self-start rounded-pill px-4 py-2 ${c.bg}`}>
      <Ionicons name={icon} size={16} color={c.icon} />
      <Text className={`font-body-medium text-caption ${c.text}`}>{label}</Text>
    </View>
  );
}
