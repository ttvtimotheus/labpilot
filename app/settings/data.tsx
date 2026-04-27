import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ListRow } from '@/src/components/ui/ListRow';
import { useProtokollRunStore } from '@/src/features/protokolle/store';
import { useTimerStore } from '@/src/features/timer/store';
import { useDifferentialStore } from '@/src/features/zaehler/differential.store';
import { useKolonieStore } from '@/src/features/zaehler/kolonien.store';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { clearLocalRows } from '@/src/lib/db/localPersistence';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

type ClearTarget = 'timer' | 'protokolle' | 'kolonien' | 'differential';

export default function DataSettingsScreen() {
  const theme = useAppTheme();
  const { userId } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const timerRuns = useTimerStore((state) => state.completedRuns.length);
  const activeTimers = useTimerStore((state) => state.activeTimers.length);
  const clearTimerHistory = useTimerStore((state) => state.clearHistory);
  const resetActiveTimers = useTimerStore((state) => state.resetAll);
  const protokollRuns = useProtokollRunStore((state) => state.completedRuns.length);
  const clearProtokollRuns = useProtokollRunStore((state) => state.clearRuns);
  const kolonieCounts = useKolonieStore((state) => state.savedCounts.length);
  const clearKolonieCounts = useKolonieStore((state) => state.clearSavedCounts);
  const differentialCounts = useDifferentialStore((state) => state.savedCounts.length);
  const clearDifferentialCounts = useDifferentialStore((state) => state.clearSavedCounts);

  async function clearTarget(target: ClearTarget) {
    if (target === 'timer') {
      clearTimerHistory();
      await clearLocalRows('timer_runs', userId);
      setMessage('Timerverlauf wurde geloescht.');
    }
    if (target === 'protokolle') {
      clearProtokollRuns();
      await clearLocalRows('protokoll_runs', userId);
      setMessage('Protokoll-Durchlaeufe wurden geloescht.');
    }
    if (target === 'kolonien') {
      clearKolonieCounts();
      await clearLocalRows('kolonie_counts', userId);
      setMessage('Kolonienzaehlungen wurden geloescht.');
    }
    if (target === 'differential') {
      clearDifferentialCounts();
      await clearLocalRows('differential_counts', userId);
      setMessage('Differentialzaehlungen wurden geloescht.');
    }
  }

  async function clearActiveTimers() {
    await resetActiveTimers();
    setMessage('Aktive Timer wurden gestoppt und entfernt.');
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Lokale Daten</AppText>
        <AppText variant="callout" muted>Alles hier liegt lokal auf diesem Geraet und kann einzeln entfernt werden.</AppText>
      </View>

      {message ? (
        <Card style={{ borderColor: theme.success }}>
          <AppText variant="bodyEmph" style={{ color: theme.success }}>Erledigt</AppText>
          <AppText muted>{message}</AppText>
        </Card>
      ) : null}

      <Section title="Uebersicht">
        <ListRow icon="timer" title="Aktive Timer" subtitle={`${activeTimers} laufend`} />
        <ListRow icon="history" title="Timerverlauf" subtitle={`${timerRuns} Eintraege`} />
        <ListRow icon="assignment" title="Protokoll-Durchlaeufe" subtitle={`${protokollRuns} Eintraege`} />
        <ListRow icon="science" title="Kolonienzaehlungen" subtitle={`${kolonieCounts} Eintraege`} />
        <ListRow icon="bloodtype" title="Differentialzaehlungen" subtitle={`${differentialCounts} Eintraege`} />
      </Section>

      <Section title="Loeschen">
        <Card style={{ borderColor: theme.warning }}>
          <AppText variant="bodyEmph" style={{ color: theme.warning }}>Lokale Aktion</AppText>
          <AppText muted>Geloeschte lokale Verlaeufe koennen ohne vorherigen Export nicht wiederhergestellt werden.</AppText>
        </Card>
        <View style={styles.actions}>
          <Button label="Aktive Timer stoppen" icon="timer-off" variant="secondary" disabled={!activeTimers} onPress={() => void clearActiveTimers()} />
          <Button label="Timerverlauf loeschen" icon="delete" variant="destructive" disabled={!timerRuns} onPress={() => void clearTarget('timer')} />
          <Button label="Protokollverlauf loeschen" icon="delete" variant="destructive" disabled={!protokollRuns} onPress={() => void clearTarget('protokolle')} />
          <Button label="Kolonienzaehlungen loeschen" icon="delete" variant="destructive" disabled={!kolonieCounts} onPress={() => void clearTarget('kolonien')} />
          <Button label="Differentialzaehlungen loeschen" icon="delete" variant="destructive" disabled={!differentialCounts} onPress={() => void clearTarget('differential')} />
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
  },
});