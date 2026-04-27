import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ListRow } from '@/src/components/ui/ListRow';
import { usePreferencesStore, type AppLanguage, type ThemePreference } from '@/src/features/settings/preferences.store';
import i18n from '@/src/lib/i18n';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Hell' },
  { value: 'dark', label: 'Dunkel' },
];

const languageOptions: { value: AppLanguage; label: string }[] = [
  { value: 'de', label: 'Deutsch' },
  { value: 'en', label: 'English' },
];

export default function SettingsScreen() {
  const theme = useAppTheme();
  const { isGuest } = useAuth();
  const themePreference = usePreferencesStore((state) => state.themePreference);
  const language = usePreferencesStore((state) => state.language);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const setOnboardingCompleted = usePreferencesStore((state) => state.setOnboardingCompleted);

  function updateLanguage(nextLanguage: AppLanguage) {
    setLanguage(nextLanguage);
    void i18n.changeLanguage(nextLanguage);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Einstellungen</AppText>
        <AppText variant="callout" muted>{isGuest ? 'Offline-Profil' : 'Angemeldetes Profil'}</AppText>
      </View>
      <Section title="Konto">
        <ListRow icon="person" title="Account" subtitle="Login, Rolle und Sync-Status" onPress={() => router.push('/settings/account')} />
        <ListRow icon="workspace-premium" title="LabPilot Pro" subtitle="Abo, Restore und Entitlements" accentColor={theme.warning} onPress={() => router.push('/settings/subscription')} />
      </Section>
      <Section title="Darstellung">
        <Card>
          <AppText variant="bodyEmph">Theme</AppText>
          <View style={styles.optionGrid}>
            {themeOptions.map((option) => (
              <Button
                key={option.value}
                label={option.label}
                variant={themePreference === option.value ? 'primary' : 'secondary'}
                onPress={() => setThemePreference(option.value)}
              />
            ))}
          </View>
        </Card>
        <Card>
          <AppText variant="bodyEmph">Sprache</AppText>
          <View style={styles.optionGrid}>
            {languageOptions.map((option) => (
              <Button
                key={option.value}
                label={option.label}
                variant={language === option.value ? 'primary' : 'secondary'}
                onPress={() => updateLanguage(option.value)}
              />
            ))}
          </View>
          <AppText variant="footnote" muted>Deutsch ist im MVP voll gepflegt; Englisch bleibt vorerst Basistext.</AppText>
        </Card>
      </Section>
      <Section title="App">
        <ListRow icon="storage" title="Lokale Daten" subtitle="Verlaeufe und gespeicherte Zaehlungen verwalten" onPress={() => router.push('/settings/data')} />
        <ListRow
          icon="flag"
          title="Startcheck erneut anzeigen"
          subtitle="Oeffnet die Hinweise fuer Offline-Modus, Routine und Datenschutz."
          onPress={() => {
            setOnboardingCompleted(false);
            router.replace('/onboarding');
          }}
        />
        <ListRow icon="info" title="Ueber LabPilot" subtitle="Version, Datenschutz und Hinweise" onPress={() => router.push('/settings/about')} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
