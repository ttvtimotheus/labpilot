import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { useTimerStore } from '@/src/features/timer/store';
import { useNow } from '@/src/hooks/useNow';
import { areaLabels, spacing, useAppTheme } from '@/src/lib/theme/tokens';
import { formatDuration, getRemainingSeconds } from '@/src/lib/utils/time';

export default function ActiveTimerScreen() {
  useNow();
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const timer = useTimerStore((state) => state.activeTimers.find((candidate) => candidate.id === id));
  const cancelTimer = useTimerStore((state) => state.cancelTimer);
  const completeTimer = useTimerStore((state) => state.completeTimer);

  if (!timer) {
    return (
      <Screen>
        <EmptyState icon="timer-off" title="Timer nicht gefunden" description="Der Timer ist bereits beendet oder wurde entfernt." actionLabel="Zurueck" onAction={() => router.back()} />
      </Screen>
    );
  }

  const remaining = getRemainingSeconds(timer.endsAt);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">{timer.name}</AppText>
        <AppText variant="callout" muted>{areaLabels[timer.bereich]}</AppText>
      </View>
      <Card bereich={timer.bereich} elevated style={styles.timerCard}>
        <NumericDisplay value={formatDuration(remaining)} label="verbleibend" size="lg" />
        <AppText variant="footnote" muted>Gestartet um {new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(new Date(timer.startedAt))}</AppText>
      </Card>
      {remaining === 0 ? <AppText variant="bodyEmph" style={{ color: theme.success }}>Timer ist fertig.</AppText> : null}
      <View style={styles.actions}>
        <Button label="Abschliessen" icon="check" fullWidth onPress={async () => { await completeTimer(timer.id); router.back(); }} />
        <Button label="Abbrechen" icon="close" variant="destructive" fullWidth onPress={async () => { await cancelTimer(timer.id); router.back(); }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  timerCard: {
    alignItems: 'center',
  },
  actions: {
    gap: spacing.sm,
  },
});
