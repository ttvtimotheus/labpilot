import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { TextField } from '@/src/components/ui/TextField';
import { getProtokoll } from '@/src/features/protokolle/data';
import { useProtokollRunStore } from '@/src/features/protokolle/store';
import { useTimerStore } from '@/src/features/timer/store';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { saveProtokollRunLocal } from '@/src/lib/db/localPersistence';
import { spacing } from '@/src/lib/theme/tokens';
import { formatDuration } from '@/src/lib/utils/time';

export default function RunProtokollScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const protokoll = getProtokoll(id);
  const [startedAt] = useState(() => new Date().toISOString());
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState('');
  const [completedRunId, setCompletedRunId] = useState<string | null>(null);
  const { userId } = useAuth();
  const startCustomTimer = useTimerStore((state) => state.startCustomTimer);
  const completeRun = useProtokollRunStore((state) => state.completeRun);
  const step = protokoll?.steps[index];
  const progress = useMemo(() => {
    if (!protokoll) return '0/0';
    return `${Math.min(index + 1, protokoll.steps.length)}/${protokoll.steps.length}`;
  }, [index, protokoll]);

  if (!protokoll || !step) {
    return (
      <Screen>
        <EmptyState icon="assignment-late" title="Run nicht moeglich" description="Das Protokoll ist nicht mehr vorhanden." actionLabel="Zurueck" onAction={() => router.back()} />
      </Screen>
    );
  }

  const isLast = index === protokoll.steps.length - 1;
  const completedAt = completedRunId ? new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : null;

  if (completedRunId) {
    return (
      <Screen>
        <View style={styles.header}>
          <AppText variant="h1">Durchlauf gespeichert</AppText>
          <AppText variant="callout" muted>{protokoll.name} wurde lokal abgelegt.</AppText>
        </View>
        <Card bereich={protokoll.bereich} elevated>
          <AppText variant="bodyEmph">Abgeschlossen um {completedAt} Uhr</AppText>
          <AppText muted>{notes.trim() ? notes.trim() : 'Keine Notizen erfasst.'}</AppText>
        </Card>
        <View style={styles.actions}>
          <Button label="Zur Protokolluebersicht" icon="assignment" onPress={() => router.replace('/(tabs)/protokolle')} />
          <Button label="Nochmal durchfuehren" icon="replay" variant="secondary" onPress={() => { setIndex(0); setNotes(''); setCompletedRunId(null); }} />
        </View>
      </Screen>
    );
  }

  function finishRun() {
    if (!protokoll) return;
    const run = completeRun({ protokoll, startedAt, notes });
    void saveProtokollRunLocal(userId, run);
    setCompletedRunId(run.id);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">{protokoll.name}</AppText>
        <AppText variant="callout" muted>Schritt {progress}</AppText>
      </View>
      <Card bereich={protokoll.bereich} elevated>
        <AppText variant="h2">{step.name}</AppText>
        <AppText>{step.instructions}</AppText>
        {step.durationSeconds ? <NumericDisplay value={formatDuration(step.durationSeconds)} label="Sollzeit" /> : null}
      </Card>
      <TextField
        label="Notizen zum Durchlauf"
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlignVertical="top"
        helpText="Optional, bleibt lokal gespeichert und wird spaeter synchronisiert."
        style={styles.notesInput}
      />
      <View style={styles.actions}>
        {step.durationSeconds ? (
          <Button label="Timer fuer Schritt starten" icon="timer" onPress={() => startCustomTimer({ name: `${protokoll.name}: ${step.name}`, durationSeconds: step.durationSeconds ?? 1, bereich: protokoll.bereich })} />
        ) : null}
        <Button label={isLast ? 'Abschliessen' : 'Naechster Schritt'} icon={isLast ? 'check' : 'arrow-forward'} onPress={() => (isLast ? finishRun() : setIndex((value) => value + 1))} />
        {index > 0 ? <Button label="Zurueck" icon="arrow-back" variant="secondary" onPress={() => setIndex((value) => Math.max(0, value - 1))} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  actions: {
    gap: spacing.sm,
  },
  notesInput: {
    minHeight: 112,
  },
});
