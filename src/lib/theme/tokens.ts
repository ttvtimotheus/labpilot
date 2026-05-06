import { useResolvedColorScheme } from '@/src/features/settings/preferences.store';
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
  background: '#F4F1EA',
  backgroundElev: '#FBF8F2',
  backgroundSunk: '#E7E0D6',
  foreground: '#18222B',
  foregroundMuted: '#56616C',
  foregroundSubtle: '#7B8790',
  border: '#DED6CA',
  borderStrong: '#C7BDAE',
  focus: '#275D94',
  success: '#2F765B',
  warning: '#AD6E24',
  danger: '#B44858',
  info: '#275D94',
  card: '#FFFDF8',
  area: {
    mibi: '#2F7A6A',
    haema: '#B44858',
    chemie: '#275D94',
    histo: '#6D62C3',
    general: '#5D6870',
    learn: '#AD6E24',
  },
} as const;

export const darkTheme = {
  mode: 'dark',
  background: '#0F1318',
  backgroundElev: '#171D24',
  backgroundSunk: '#212A33',
  foreground: '#F5F2EC',
  foregroundMuted: '#B8B4AD',
  foregroundSubtle: '#8D959C',
  border: '#2B333C',
  borderStrong: '#3E4955',
  focus: '#8AB7FF',
  success: '#53B886',
  warning: '#E2A74A',
  danger: '#F07E89',
  info: '#79AFFF',
  card: '#131A21',
  area: {
    mibi: '#4DAE98',
    haema: '#D96C78',
    chemie: '#79AFFF',
    histo: '#AA92FF',
    general: '#A6AFB6',
    learn: '#D8A04A',
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
  xxxl: 44,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontFamily: 'Inter_600SemiBold' },
  h1: { fontSize: 30, lineHeight: 36, fontFamily: 'Inter_600SemiBold' },
  h2: { fontSize: 22, lineHeight: 28, fontFamily: 'Inter_600SemiBold' },
  h3: { fontSize: 18, lineHeight: 24, fontFamily: 'Inter_600SemiBold' },
  body: { fontSize: 16, lineHeight: 22, fontFamily: 'Inter_400Regular' },
  bodyEmph: { fontSize: 16, lineHeight: 22, fontFamily: 'Inter_500Medium' },
  callout: { fontSize: 15, lineHeight: 21, fontFamily: 'Inter_400Regular' },
  subhead: { fontSize: 14, lineHeight: 19, fontFamily: 'Inter_400Regular' },
  footnote: { fontSize: 12, lineHeight: 17, fontFamily: 'Inter_400Regular' },
  caption: { fontSize: 11, lineHeight: 15, fontFamily: 'Inter_500Medium' },
  mono: { fontSize: 17, lineHeight: 22, fontFamily: 'JetBrainsMono_500Medium' },
} as const;

export function useAppTheme() {
  const scheme = useResolvedColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}
