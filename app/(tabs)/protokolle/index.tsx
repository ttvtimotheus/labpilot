import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ExportMessageCard } from '@/src/components/domain/ExportMessageCard';
import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { ListRow } from '@/src/components/ui/ListRow';
import { protokolle } from '@/src/features/protokolle/data';
import { useProtokollRunStore } from '@/src/features/protokolle/store';
import { usePdfExport } from '@/src/hooks/usePdfExport';
import { shareProtokollRunPdf } from '@/src/lib/export/pdf';
import { areaLabels, spacing, useAppTheme } from '@/src/lib/theme/tokens';
import type { ProtokollRun } from '@/src/types/domain';

export default function ProtokolleScreen() {
  const theme = useAppTheme();
  const completedRuns = useProtokollRunStore((state) => state.completedRuns.slice(0, 3));
  const { exportPdf, isExporting, message } = usePdfExport();

  async function exportRun(run: ProtokollRun) {
    await exportPdf(() => shareProtokollRunPdf(run));
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Protokolle</AppText>
        <AppText variant="callout" muted>Schrittfolgen fuer Faerbungen und wiederkehrende Laborablaeufe.</AppText>
      </View>
      <Section title="Standardprotokolle">
        {protokolle.map((protokoll) => (
          <ListRow
            key={protokoll.id}
            icon="assignment"
            title={protokoll.name}
            subtitle={`${areaLabels[protokoll.bereich]} · ${protokoll.steps.length} Schritte`}
            accentColor={theme.area[protokoll.bereich]}
            onPress={() => router.push(`/(tabs)/protokolle/${protokoll.id}`)}
          />
        ))}
      </Section>
      {completedRuns.length ? (
        <Section title="Letzte Durchlaeufe">
          <ExportMessageCard message={message} />
          {completedRuns.map((run) => (
            <ListRow
              key={run.id}
              icon="picture-as-pdf"
              title={run.protokollSnapshot.name}
              subtitle={`${new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(run.completedAt))} · ${isExporting ? 'Export laeuft' : 'PDF exportieren'}`}
              accentColor={theme.area[run.protokollSnapshot.bereich]}
              onPress={() => void exportRun(run)}
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
});
