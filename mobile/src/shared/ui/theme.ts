import { Platform, type ViewStyle } from 'react-native';

export const colors = {
  petrol500: '#1C5D52',
  petrol700: '#123D36',
  petrol100: '#E3F1ED',
  amber500: '#D89B3C',
  amber700: '#A9721F',
  amber100: '#FBF0DC',
  vinculo500: '#C65B76',
  vinculo700: '#A8455F',
  vinculo100: '#F6E4E9',
  success500: '#3F8557',
  success700: '#2F6B45',
  success100: '#E7F3EA',
  error500: '#C1432E',
  error100: '#FBE6E2',
  info500: '#4472A8',
  info100: '#E7EEF5',
  neutral0: '#FAF8F5',
  neutral50: '#F3F0EB',
  neutral100: '#E8E4DD',
  neutral200: '#DDD8D0',
  neutral300: '#C7C1B7',
  neutral500: '#8B8880',
  neutral700: '#5C6B67',
  neutral900: '#26302E',
  white: '#FFFFFF',
} as const;

/**
 * RN's shadow* props (iOS) and elevation (Android) don't share a single CSS
 * shorthand, so elevation is expressed as style objects rather than className.
 */
export const elevation: Record<'e1' | 'e2' | 'e3', ViewStyle> = {
  e1: Platform.select({
    android: { elevation: 2 },
    default: {
      shadowColor: colors.petrol500,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
    },
  }) as ViewStyle,
  e2: Platform.select({
    android: { elevation: 6 },
    default: {
      shadowColor: colors.petrol500,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
  }) as ViewStyle,
  e3: Platform.select({
    android: { elevation: 10 },
    default: {
      shadowColor: colors.petrol500,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
    },
  }) as ViewStyle,
};
