import { router } from 'expo-router';

import { ExportMessageCard } from '@/src/components/domain/ExportMessageCard';
import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Section } from '@/src/components/layout/Section';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ResourceRow } from '@/src/components/ui/ResourceRow';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { protokolle } from '@/src/features/protokolle/data';
import { useProtokollRunStore } from '@/src/features/protokolle/store';
import { usePdfExport } from '@/src/hooks/usePdfExport';
import { shareProtokollRunPdf } from '@/src/lib/export/pdf';
import { areaLabels, useAppTheme } from '@/src/lib/theme/tokens';
import type { ProtokollRun } from '@/src/types/domain';

export default function ProtokolleScreen() {
  const theme = useAppTheme();
  const completedRuns = useProtokollRunStore((state) => state.completedRuns);
  const { exportPdf, isExporting, message } = usePdfExport();
  const recentCompletedRuns = completedRuns.slice(0, 3);

  async function exportRun(run: ProtokollRun) {
    await exportPdf(() => shareProtokollRunPdf(run));
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Bibliothek"
        title="Protokolle"
        description="Standardablaeufe fuer wiederkehrende Laborwege mit ruhiger Bibliotheksstruktur und direktem Verlaufsexport."
        chips={
          <>
            <StatusChip label={`${protokolle.length} Standardablaeufe`} icon="assignment" tone="info" />
            <StatusChip label={recentCompletedRuns.length ? `${recentCompletedRuns.length} im Verlauf` : 'Bibliothek'} icon="history" tone="neutral" />
          </>
        }
      />

      <Section title="Bibliothek" description="Integrierte Standardprotokolle fuer Routine, Lehre und wiederkehrende Arbeitsschritte.">
        {protokolle.map((protokoll) => (
          <ResourceRow
            key={protokoll.id}
            icon="assignment"
            eyebrow={areaLabels[protokoll.bereich]}
            title={protokoll.name}
            subtitle={`${protokoll.steps.length} Schritte · ${protokoll.description}`}
            accentColor={theme.area[protokoll.bereich]}
            onPress={() => router.push(`/(tabs)/protokolle/${protokoll.id}`)}
          />
        ))}
      </Section>

      <Section title="Verlauf & Export" description="Abgeschlossene Durchlaeufe mit direkter PDF-Ausgabe aus dem Verlauf.">
        <ExportMessageCard message={message} />
        {recentCompletedRuns.length ? (
          recentCompletedRuns.map((run) => (
            <ResourceRow
              key={run.id}
              icon="picture-as-pdf"
              eyebrow={areaLabels[run.protokollSnapshot.bereich]}
              title={run.protokollSnapshot.name}
              subtitle={`${new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(run.completedAt))} · ${isExporting ? 'Export laeuft' : 'PDF exportierbar'}`}
              accentColor={theme.area[run.protokollSnapshot.bereich]}
              onPress={() => void exportRun(run)}
              disabled={isExporting}
            />
          ))
        ) : (
          <EmptyState icon="assignment" title="Noch kein Verlauf" description="Sobald du einen Ablauf dokumentierst, kannst du ihn hier erneut aufrufen und als PDF ausgeben." />
        )}
      </Section>
    </Screen>
  );
}
