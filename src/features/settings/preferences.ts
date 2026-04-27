import type { ColorSchemeName } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';
export type AppLanguage = 'de' | 'en';

export const validThemePreferences: ThemePreference[] = ['system', 'light', 'dark'];
export const validLanguages: AppLanguage[] = ['de', 'en'];

export function isThemePreference(value: string | undefined): value is ThemePreference {
  return Boolean(value && validThemePreferences.includes(value as ThemePreference));
}

export function isAppLanguage(value: string | undefined): value is AppLanguage {
  return Boolean(value && validLanguages.includes(value as AppLanguage));
}

export function resolveColorScheme(preference: ThemePreference, systemScheme: ColorSchemeName) {
  if (preference === 'system') return systemScheme === 'dark' ? 'dark' : 'light';
  return preference;
}