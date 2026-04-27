import { useColorScheme as useSystemColorScheme } from 'react-native';
import { create } from 'zustand';

import { isAppLanguage, isThemePreference, resolveColorScheme, type AppLanguage, type ThemePreference } from '@/src/features/settings/preferences';
import { appStorage } from '@/src/lib/storage/mmkv';

const themePreferenceKey = 'settings.themePreference';
export const languagePreferenceKey = 'settings.language';
export type { AppLanguage, ThemePreference } from '@/src/features/settings/preferences';

interface PreferencesStore {
  themePreference: ThemePreference;
  language: AppLanguage;
  onboardingCompleted: boolean;
  setThemePreference: (preference: ThemePreference) => void;
  setLanguage: (language: AppLanguage) => void;
  setOnboardingCompleted: (completed: boolean) => void;
}

function readThemePreference(): ThemePreference {
  const stored = appStorage.getString(themePreferenceKey) as ThemePreference | undefined;
  return isThemePreference(stored) ? stored : 'system';
}

export function readLanguagePreference(): AppLanguage | null {
  const stored = appStorage.getString(languagePreferenceKey) as AppLanguage | undefined;
  return isAppLanguage(stored) ? stored : null;
}

export const usePreferencesStore = create<PreferencesStore>((set) => ({
  themePreference: readThemePreference(),
  language: readLanguagePreference() ?? 'de',
  onboardingCompleted: appStorage.getBoolean('settings.onboardingCompleted') ?? false,
  setThemePreference: (themePreference) => {
    appStorage.set(themePreferenceKey, themePreference);
    set({ themePreference });
  },
  setLanguage: (language) => {
    appStorage.set(languagePreferenceKey, language);
    set({ language });
  },
  setOnboardingCompleted: (onboardingCompleted) => {
    appStorage.set('settings.onboardingCompleted', onboardingCompleted);
    set({ onboardingCompleted });
  },
}));

export function useResolvedColorScheme() {
  const systemScheme = useSystemColorScheme();
  const themePreference = usePreferencesStore((state) => state.themePreference);
  return resolveColorScheme(themePreference, systemScheme);
}