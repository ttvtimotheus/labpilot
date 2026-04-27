import { Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { ExportMessageCard } from '@/src/components/domain/ExportMessageCard';
import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ListRow } from '@/src/components/ui/ListRow';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { TextField } from '@/src/components/ui/TextField';
import { useDifferentialStore } from '@/src/features/zaehler/differential.store';
import { useHaptics } from '@/src/hooks/useHaptics';
import { usePdfExport } from '@/src/hooks/usePdfExport';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { saveDifferentialCountLocal } from '@/src/lib/db/localPersistence';
import { shareDifferentialCountPdf } from '@/src/lib/export/pdf';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';
import type { DifferentialCountSnapshot } from '@/src/types/domain';

export default function DifferentialScreen() {
  const theme = useAppTheme();
  const haptics = useHaptics();
  const { userId } = useAuth();
  const [name, setName] = useState('');
  const { exportPdf, isExporting, message } = usePdfExport();
  const { cells, savedCounts, target, increment, decrement, reset, saveCurrent, setTarget } = useDifferentialStore();
  const total = cells.reduce((sum, cell) => sum + cell.count, 0);
  const done = total >= target;
  const latestCounts = savedCounts.slice(0, 3);

  async function exportCount(count: DifferentialCountSnapshot) {
    await exportPdf(() => shareDifferentialCountPdf(count));
  }

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
      <Card>
        <TextField label="Name / Praeparat" value={name} onChangeText={setName} placeholder="z. B. Diff-BB Kontrolle" />
        <TextField label="Zielzellzahl" value={String(target)} keyboardType="number-pad" onChangeText={(value) => setTarget(Number(value) || 100)} helpText="Mindestens 20 Zellen; Standard sind 100." />
      </Card>
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
      <View style={styles.actions}>
        <Button
          label="Zaehlung speichern"
          icon="save"
          disabled={!total}
          onPress={() => {
            const saved = saveCurrent(name);
            if (saved) {
              haptics.success();
              void saveDifferentialCountLocal(userId, saved);
              setName('');
            }
          }}
        />
        <Button label="Zuruecksetzen" icon="restart-alt" variant="secondary" onPress={reset} />
      </View>
      {latestCounts.length ? (
        <Section title="Letzte Zaehlungen">
          <ExportMessageCard message={message} />
          {latestCounts.map((count) => (
            <ListRow
              key={count.id}
              icon="picture-as-pdf"
              title={count.name ?? 'Differentialzaehlung'}
              subtitle={`${count.totalCells}/${count.target} Zellen · ${new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(count.createdAt))} · ${isExporting ? 'Export laeuft' : 'PDF exportieren'}`}
              accentColor={theme.area.haema}
              onPress={() => void exportCount(count)}
              disabled={isExporting}
            />
          ))}
        </Section>
      ) : null}
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
  actions: {
    gap: spacing.sm,
  },
});
