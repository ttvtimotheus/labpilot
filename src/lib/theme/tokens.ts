import { useColorScheme } from 'react-native';

import type { Bereich } from '@/src/types/domain';

export const areaLabels: Record<Bereich, string> = {
  mibi: 'Mikrobiologie',
  haema: 'Hämatologie',
  chemie: 'Klinische Chemie',
  histo: 'Histologie',
  general: 'Allgemein',
  learn: 'Lernen',
};

export const areaSymbols: Record<Bereich, string> = {
  mibi: 'science',
  haema: 'bloodtype',
  chemie: 'biotech',
  histo: 'content-cut',
  general: 'widgets',
  learn: 'school',
};

export const lightTheme = {
  mode: 'light',
  background: '#FFFFFF',
  backgroundElev: '#F7F7F8',
  backgroundSunk: '#F2F2F4',
  foreground: '#0A0A0B',
  foregroundMuted: '#59595F',
  foregroundSubtle: '#74747A',
  border: '#E6E6E8',
  borderStrong: '#CFCFD4',
  focus: '#1E5FBF',
  success: '#10803C',
  warning: '#B45309',
  danger: '#C62828',
  info: '#1E5FBF',
  card: '#F7F7F8',
  area: {
    mibi: '#10803C',
    haema: '#C62828',
    chemie: '#1E5FBF',
    histo: '#7B3FB8',
    general: '#59595F',
    learn: '#B45309',
  },
} as const;

export const darkTheme = {
  mode: 'dark',
  background: '#0B0B0C',
  backgroundElev: '#1C1C1E',
  backgroundSunk: '#111113',
  foreground: '#FFFFFF',
  foregroundMuted: '#B8B8BE',
  foregroundSubtle: '#8E8E94',
  border: '#2C2C30',
  borderStrong: '#3A3A40',
  focus: '#5AA9FF',
  success: '#34C759',
  warning: '#FBBF24',
  danger: '#FF6B6B',
  info: '#5AA9FF',
  card: '#1C1C1E',
  area: {
    mibi: '#34C759',
    haema: '#FF6B6B',
    chemie: '#5AA9FF',
    histo: '#BF7AFF',
    general: '#B8B8BE',
    learn: '#FBBF24',
  },
} as const;

export type AppTheme = typeof lightTheme;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const typography = {
  display: { fontSize: 34, lineHeight: 41, fontFamily: 'Inter_600SemiBold' },
  h1: { fontSize: 28, lineHeight: 34, fontFamily: 'Inter_600SemiBold' },
  h2: { fontSize: 22, lineHeight: 28, fontFamily: 'Inter_600SemiBold' },
  h3: { fontSize: 17, lineHeight: 22, fontFamily: 'Inter_600SemiBold' },
  body: { fontSize: 17, lineHeight: 22, fontFamily: 'Inter_400Regular' },
  bodyEmph: { fontSize: 17, lineHeight: 22, fontFamily: 'Inter_500Medium' },
  callout: { fontSize: 16, lineHeight: 21, fontFamily: 'Inter_400Regular' },
  subhead: { fontSize: 15, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  footnote: { fontSize: 13, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  caption: { fontSize: 12, lineHeight: 16, fontFamily: 'Inter_500Medium' },
  mono: { fontSize: 17, lineHeight: 22, fontFamily: 'JetBrainsMono_500Medium' },
} as const;

export function useAppTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}
