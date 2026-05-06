import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ResourceRow } from '@/src/components/ui/ResourceRow';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { usePreferencesStore, type AppLanguage, type ThemePreference } from '@/src/features/settings/preferences.store';
import { useEntitlements } from '@/src/hooks/useEntitlements';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { isRevenueCatConfigured } from '@/src/lib/env';
import i18n from '@/src/lib/i18n';
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
  const { isPro } = useEntitlements();
  const themePreference = usePreferencesStore((state) => state.themePreference);
  const language = usePreferencesStore((state) => state.language);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const setOnboardingCompleted = usePreferencesStore((state) => state.setOnboardingCompleted);
  const showSubscription = isPro || isRevenueCatConfigured;

  function updateLanguage(nextLanguage: AppLanguage) {
    setLanguage(nextLanguage);
    void i18n.changeLanguage(nextLanguage);
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Arbeitsbereich"
        title="Einstellungen"
        description="Profil, Darstellung und lokale Arbeitsumgebung fuer deinen Laboralltag."
        chips={
          <>
            <StatusChip label={isGuest ? 'Lokal' : 'Cloud'} tone={isGuest ? 'warning' : 'info'} icon={isGuest ? 'offline-bolt' : 'cloud-done'} />
            <StatusChip label={`Sprache ${language.toUpperCase()}`} tone="neutral" icon="language" />
            {showSubscription ? <StatusChip label={isPro ? 'Pro aktiv' : 'Pro verfuegbar'} tone="warning" icon="workspace-premium" /> : null}
          </>
        }
      />
      <Section title="Profil" description="Konto, Berechtigungen und Kaufstatus.">
        <ResourceRow icon="person" eyebrow="Profil" title="Account" subtitle="Login, Rolle und Sync-Status" onPress={() => router.push('/settings/account')} />
        {showSubscription ? <ResourceRow icon="workspace-premium" eyebrow="Zusatzfunktionen" title="LabPilot Pro" subtitle="Zusatzfunktionen, Restore und Berechtigungen" accentColor={theme.warning} onPress={() => router.push('/settings/subscription')} /> : null}
      </Section>
      <Section title="Darstellung" description="Farbschema und Sprache fuer diese Installation.">
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
          <AppText variant="footnote" muted>Deutsch ist vollstaendig gepflegt; Englisch deckt aktuell die Kerntexte ab.</AppText>
        </Card>
      </Section>
      <Section title="Arbeitsbereich" description="Lokale Daten, Startcheck und App-Informationen.">
        <ResourceRow icon="storage" eyebrow="Daten" title="Lokale Daten" subtitle="Verlaeufe und gespeicherte Zaehlungen verwalten" onPress={() => router.push('/settings/data')} />
        <ResourceRow
          icon="flag"
          eyebrow="Einrichtung"
          title="Startcheck erneut anzeigen"
          subtitle="Oeffnet die Einfuehrung zu Routine, Datenschutz und Arbeitsweise erneut."
          onPress={() => {
            setOnboardingCompleted(false);
            router.replace('/onboarding');
          }}
        />
        <ResourceRow icon="info" eyebrow="App" title="Ueber LabPilot" subtitle="Version, Datenschutz und Hinweise" onPress={() => router.push('/settings/about')} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
