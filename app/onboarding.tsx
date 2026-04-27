import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { AppIcon } from '@/src/components/ui/AppIcon';
import { usePreferencesStore } from '@/src/features/settings/preferences.store';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

const onboardingItems = [
  {
    icon: 'offline-bolt' as const,
    title: 'Offline zuerst',
    text: 'Timer, Protokolle, Zaehler und Referenzen bleiben direkt auf dem Geraet verfuegbar.',
  },
  {
    icon: 'timer' as const,
    title: 'Routine im Fokus',
    text: 'Aktive Timer, Schrittprotokolle und Zaehlungen sind fuer schnelle Laborablaeufe sortiert.',
  },
  {
    icon: 'health-and-safety' as const,
    title: 'Datensparsam arbeiten',
    text: 'Patienten-IDs sind lokale Freitextfelder. Keine direkt identifizierenden Daten eintragen.',
  },
];

export default function OnboardingScreen() {
  const theme = useAppTheme();
  const setOnboardingCompleted = usePreferencesStore((state) => state.setOnboardingCompleted);

  function finishOnboarding() {
    setOnboardingCompleted(true);
    router.replace('/(tabs)');
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">LabPilot einrichten</AppText>
        <AppText variant="callout" muted>Ein kurzer Startcheck fuer den sicheren lokalen Einsatz.</AppText>
      </View>
      <View style={styles.items}>
        {onboardingItems.map((item) => (
          <Card key={item.title}>
            <View style={styles.itemRow}>
              <View style={[styles.icon, { backgroundColor: theme.backgroundSunk }]}> 
                <AppIcon name={item.icon} size={24} color={theme.info} />
              </View>
              <View style={styles.itemCopy}>
                <AppText variant="h3">{item.title}</AppText>
                <AppText muted>{item.text}</AppText>
              </View>
            </View>
          </Card>
        ))}
      </View>
      <Card style={{ borderColor: theme.warning }}>
        <AppText variant="bodyEmph" style={{ color: theme.warning }}>Kein Medizinprodukt</AppText>
        <AppText muted>LabPilot unterstuetzt Ausbildung und Routineorganisation, ersetzt aber keine validierten Laborprozesse oder Befundfreigaben.</AppText>
      </Card>
      <Button label="Starten" icon="check" fullWidth onPress={finishOnboarding} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    paddingTop: spacing.xxl,
  },
  items: {
    gap: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCopy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
});