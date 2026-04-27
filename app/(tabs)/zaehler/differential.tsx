import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { useDifferentialStore } from '@/src/features/zaehler/differential.store';
import { useHaptics } from '@/src/hooks/useHaptics';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function DifferentialScreen() {
  const theme = useAppTheme();
  const haptics = useHaptics();
  const { cells, target, increment, decrement, reset } = useDifferentialStore();
  const total = cells.reduce((sum, cell) => sum + cell.count, 0);
  const done = total >= target;

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Diff-BB</AppText>
        <AppText variant="callout" muted>Zaehlt bis {target} Zellen und berechnet Prozentanteile live.</AppText>
      </View>
      <View style={styles.metrics}>
        <NumericDisplay value={`${total}/${target}`} label="Zellen" />
        <NumericDisplay value={`${Math.round((total / target) * 100)}%`} label="Fortschritt" />
      </View>
      {done ? <AppText variant="bodyEmph" style={{ color: theme.success }}>Zielzellzahl erreicht.</AppText> : null}
      <View style={styles.cellGrid}>
        {cells.map((cell) => {
          const percentage = total ? Math.round((cell.count / total) * 100) : 0;
          return (
            <Pressable
              key={cell.id}
              accessibilityRole="button"
              accessibilityLabel={`${cell.label}: ${cell.count}, ${percentage} Prozent`}
              onPress={() => { increment(cell.id); haptics.selection(); }}
              onLongPress={() => { decrement(cell.id); haptics.warning(); }}
              style={({ pressed }) => [styles.cell, { backgroundColor: theme.card, borderColor: pressed ? theme.focus : theme.border }]}>
              <View>
                <AppText variant="bodyEmph" numberOfLines={2}>{cell.shortLabel}</AppText>
                <AppText variant="footnote" muted numberOfLines={2}>{cell.label}</AppText>
              </View>
              <AppText variant="display">{cell.count}</AppText>
              <AppText variant="footnote" muted>{percentage}%</AppText>
            </Pressable>
          );
        })}
      </View>
      <Button label="Zuruecksetzen" icon="restart-alt" variant="secondary" onPress={reset} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  cellGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cell: {
    width: '48%',
    minHeight: 162,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
});
