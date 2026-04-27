import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { TimerRow } from '@/src/components/domain/TimerRow';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ListRow } from '@/src/components/ui/ListRow';
import { useTimerStore } from '@/src/features/timer/store';
import { useLocalDataHydration } from '@/src/hooks/useLocalDataHydration';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { syncAll } from '@/src/lib/db/sync';
import { useNow } from '@/src/hooks/useNow';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function HomeScreen() {
  useNow();
  const theme = useAppTheme();
  const { isGuest, userId } = useAuth();
  const hydrateLocalData = useLocalDataHydration({ auto: false });
  const templates = useTimerStore((state) => state.templates);
  const activeTimers = useTimerStore((state) => state.activeTimers);
  const startTimer = useTimerStore((state) => state.startTimer);
  const quickTemplate = templates[0];

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <AppText variant="display">LabPilot</AppText>
            <AppText variant="callout" muted>Dein Labor-Cockpit fuer Routine, Zaehler und Referenzwissen.</AppText>
          </View>
          <Button label="Einstellungen" icon="settings" variant="ghost" onPress={() => router.push('/settings')} />
        </View>
        {isGuest ? (
          <Card style={{ borderColor: theme.warning }}>
            <AppText variant="bodyEmph" style={{ color: theme.warning }}>Offline-Modus</AppText>
            <AppText muted>Alle Kernfunktionen laufen lokal. Anmeldung und Sync kannst du spaeter aktivieren.</AppText>
          </Card>
        ) : null}
      </View>

      <Section title="Aktive Timer">
        {activeTimers.length ? (
          activeTimers.map((timer) => <TimerRow key={timer.id} timer={timer} />)
        ) : (
          <EmptyState icon="timer" title="Kein Timer aktiv" description="Starte eine Vorlage oder lege einen neuen Timer fuer deinen Arbeitsschritt an." />
        )}
      </Section>

      <Section title="Schnellzugriff">
        <View style={styles.quickGrid}>
          <Button label="Timer" icon="timer" onPress={() => router.push('/(tabs)/timer')} />
          <Button label="Kolonien" icon="science" variant="secondary" onPress={() => router.push('/(tabs)/zaehler/kolonien')} />
        </View>
        {quickTemplate ? (
          <ListRow
            icon="bolt"
            title={`${quickTemplate.name} starten`}
            subtitle={`${Math.round(quickTemplate.durationSeconds / 60)} Min. Vorlage`}
            accentColor={theme.area[quickTemplate.bereich]}
            onPress={() => startTimer(quickTemplate)}
          />
        ) : null}
        <ListRow
          icon="sync"
          title="Sync pruefen"
          subtitle="Pusht lokale Aenderungen, sobald Supabase konfiguriert ist."
          onPress={async () => {
            const result = await syncAll(userId);
            if (!result.skipped) await hydrateLocalData(userId);
          }}
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  titleCopy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
