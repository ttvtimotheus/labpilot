import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ExportMessageCard } from '@/src/components/domain/ExportMessageCard';
import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ListRow } from '@/src/components/ui/ListRow';
import { NoticeBanner } from '@/src/components/ui/NoticeBanner';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { TextField } from '@/src/components/ui/TextField';
import { calculateCfu } from '@/src/features/zaehler/cfu';
import { useKolonieStore } from '@/src/features/zaehler/kolonien.store';
import { useHaptics } from '@/src/hooks/useHaptics';
import { usePdfExport } from '@/src/hooks/usePdfExport';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { saveKolonieCountLocal } from '@/src/lib/db/localPersistence';
import { shareKolonieCountPdf } from '@/src/lib/export/pdf';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';
import type { KolonieCategory, KolonieCountSnapshot } from '@/src/types/domain';

export default function KolonienScreen() {
  const theme = useAppTheme();
  const haptics = useHaptics();
  const { userId } = useAuth();
  const [name, setName] = useState('');
  const [isInstrumentMode, setInstrumentMode] = useState(false);
  const [resetSnapshot, setResetSnapshot] = useState<KolonieCategory[] | null>(null);
  const { exportPdf, retryExport, canRetry, isExporting, message, exportStatus } = usePdfExport();
  const { categories, savedCounts, dilutionFactor, platedVolumeMl, increment, decrement, reset, restoreCategories, saveCurrent, setDilutionFactor, setPlatedVolumeMl } = useKolonieStore();
  const total = categories.reduce((sum, category) => sum + category.count, 0);
  const cfu = calculateCfu(total, dilutionFactor, platedVolumeMl);
  const latestCounts = savedCounts.slice(0, 3);

  useEffect(() => {
    if (!resetSnapshot) return undefined;

    const timeout = setTimeout(() => setResetSnapshot(null), 8000);
    return () => clearTimeout(timeout);
  }, [resetSnapshot]);

  async function exportCount(count: KolonieCountSnapshot) {
    await exportPdf(() => shareKolonieCountPdf(count));
  }

  function resetWithUndo() {
    if (!total) {
      reset();
      return;
    }

    setResetSnapshot(categories.map((category) => ({ ...category })));
    reset();
    haptics.warning();
  }

  function undoReset() {
    if (!resetSnapshot) return;
    restoreCategories(resetSnapshot);
    setResetSnapshot(null);
    haptics.selection();
  }

  return (
    <Screen>
      {isInstrumentMode ? (
        <View style={[styles.instrumentBar, { backgroundColor: theme.backgroundElev, borderColor: theme.border }]}> 
          <View style={styles.instrumentCopy}>
            <AppText variant="caption" style={{ color: theme.area.mibi }}>Kolonien</AppText>
            <AppText variant="h3">Arbeitsmodus</AppText>
          </View>
          <Button label="Details" icon="fullscreen-exit" variant="secondary" onPress={() => setInstrumentMode(false)} />
        </View>
      ) : (
        <ScreenHeader
          eyebrow="Zaehler"
          title="Kolonien"
          description="Kategorien antippen, Gesamtzahl und CFU/ml direkt kontrollieren. Im Arbeitsmodus bleibt nur die Zaehllogik sichtbar."
          action={<Button label="Arbeitsmodus" icon="fullscreen" variant="secondary" onPress={() => setInstrumentMode(true)} />}
          chips={
            <>
              <StatusChip label={`${total} Kolonien`} tone={total ? 'success' : 'neutral'} icon="adjust" />
              <StatusChip label={`${new Intl.NumberFormat('de-DE').format(cfu)} CFU/ml`} tone="info" icon="science" />
            </>
          }
        />
      )}
      <View style={styles.metrics}>
        <NumericDisplay value={total} label="Kolonien" />
        <NumericDisplay value={new Intl.NumberFormat('de-DE').format(cfu)} label="CFU/ml" />
      </View>
      {!isInstrumentMode ? (
        <Card>
          <View style={styles.inputGrid}>
            <TextField label="Name / Platte" value={name} onChangeText={setName} placeholder="z. B. Urin CLED 10^-3" helpText="Keine direkt identifizierenden Patientendaten eintragen." />
            <TextField label="Verduennungsfaktor" value={String(dilutionFactor)} keyboardType="number-pad" onChangeText={(value) => setDilutionFactor(Number(value) || 1)} />
            <TextField label="Volumen ml" value={String(platedVolumeMl)} keyboardType="decimal-pad" onChangeText={(value) => setPlatedVolumeMl(Number(value.replace(',', '.')) || 0.1)} />
          </View>
        </Card>
      ) : null}
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityLabel={`${category.label}: ${category.count}`}
            onPress={() => { increment(category.id); haptics.selection(); }}
            onLongPress={() => { decrement(category.id); haptics.warning(); }}
            style={({ pressed }) => [styles.category, { backgroundColor: theme.card, borderColor: pressed ? theme.focus : theme.border }]}>
            <View style={[styles.swatch, { backgroundColor: category.colour }]} />
            <AppText variant="bodyEmph">{category.label}</AppText>
            <AppText variant="display">{category.count}</AppText>
            <AppText variant="footnote" muted>Langdruck -1</AppText>
          </Pressable>
        ))}
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
              void saveKolonieCountLocal(userId, saved);
              setName('');
            }
          }}
        />
        <Button label="Zuruecksetzen" icon="restart-alt" variant="secondary" onPress={resetWithUndo} />
      </View>
      {resetSnapshot ? (
        <NoticeBanner
          title="Zaehlung zurueckgesetzt"
          description="Die vorherigen Werte bleiben kurz verfuegbar."
          tone="warning"
          icon="undo"
          action={<Button label="Rueckgaengig" icon="undo" variant="secondary" onPress={undoReset} />}
        />
      ) : null}
      {!isInstrumentMode && latestCounts.length ? (
        <Section title="Letzte Zaehlungen">
          <ExportMessageCard message={message} status={exportStatus} onRetry={canRetry ? () => void retryExport() : undefined} />
          {latestCounts.map((count) => (
            <ListRow
              key={count.id}
              icon="picture-as-pdf"
              title={count.name ?? 'Kolonienzaehlung'}
              subtitle={`${count.totalColonies} Kolonien · ${new Intl.NumberFormat('de-DE').format(count.totalCfu)} CFU/ml · ${isExporting ? 'PDF wird erstellt' : 'PDF exportieren'}`}
              accentColor={theme.area.mibi}
              actionLabel="Export"
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
  instrumentBar: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  instrumentCopy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  inputGrid: {
    gap: spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  category: {
    width: '48%',
    minHeight: 154,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.xs,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  actions: {
    gap: spacing.sm,
  },
});
