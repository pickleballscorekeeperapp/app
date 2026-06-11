import { Platform } from 'react-native';

/**
 * Spacing, radius, type, and motion tokens — same canon as CourtsideView v11.
 * 4pt grid. Touch targets minimum 48pt; primary rally targets far larger
 * (sweaty hands, sun glare, phone propped on a fence post).
 */
export const space = {
  px: 1,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 32,
  '8': 40,
  '9': 48,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 18,
  '2xl': 22,
  pill: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 22,
  '3xl': 28,
  '4xl': 36,
  score: 88, // even bigger than CourtsideView — score is the whole product
  call: 56, // the spoken score call banner
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

export const minTouch = 48;

const systemSans = Platform.select({
  ios: 'Avenir Next',
  android: 'sans-serif',
  default: 'System',
}) ?? 'System';

const systemDisplay = Platform.select({
  ios: 'AvenirNextCondensed-Heavy',
  android: 'sans-serif-condensed',
  default: systemSans,
}) ?? systemSans;

export const families = {
  display: systemDisplay,
  sans: systemSans,
} as const;

export const shadows = {
  greenCta: {
    shadowColor: '#20A66B',
    shadowOpacity: 0.28,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  card: {
    shadowColor: '#111827',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
} as const;
