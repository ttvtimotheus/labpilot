import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { getProtokoll } from '@/src/features/protokolle/data';
import { useTimerStore } from '@/src/features/timer/store';
import { spacing } from '@/src/lib/theme/tokens';
import { formatDuration } from '@/src/lib/utils/time';

export default function RunProtokollScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const protokoll = getProtokoll(id);
  const [index, setIndex] = useState(0);
  const startCustomTimer = useTimerStore((state) => state.startCustomTimer);
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
      <View style={styles.actions}>
        {step.durationSeconds ? (
          <Button label="Timer fuer Schritt starten" icon="timer" onPress={() => startCustomTimer({ name: `${protokoll.name}: ${step.name}`, durationSeconds: step.durationSeconds ?? 1, bereich: protokoll.bereich })} />
        ) : null}
        <Button label={isLast ? 'Abschliessen' : 'Naechster Schritt'} icon={isLast ? 'check' : 'arrow-forward'} onPress={() => (isLast ? router.back() : setIndex((value) => value + 1))} />
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
});
